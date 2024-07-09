import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Image, TouchableOpacity } from "react-native";

import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

import { getFriendRoute, searchUserRoute, acceptFriendRoute, declineFriendRoute } from "../../../apiRouter/API";
import { useData } from "../../../HookToGetUserInfo/DataContext";

import FindFriend from "./findFriend";

export default function ListFriend() {
    const [showTextInput, setShowTextInput] = useState(false);
    const [searchText, setSearchText] = useState('');

    const showInputAndSearch = () => {
        if (showTextInput && searchText === '') {
            setShowTextInput(false);
        } else if (showTextInput && searchText !== '') {
            searchUser(searchText);
        } else {
            setShowTextInput(true);
        }
    }

    // list friend
    const [listFriendData, setListFriendData] = useState([]);
    const { userData } = useData();
    const { data } = userData;
    const username = data.user.username;
    const getListFriend = async () => {
        try {
            const response = await fetch(`${getFriendRoute}/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setListFriendData(data.friends);
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
    useEffect(() => {
        getListFriend();
    }, []);

    // searrh user
    const [searchUserData, setSearchUserData] = useState([]); // [{}
    const searchUser = async (nameOfUser) => {
        try {
            const response = await fetch(`${searchUserRoute}/${nameOfUser}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSearchUserData(data);
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
    const acceptFriend = async (friendname) => {
        try {
            const response = await fetch(`${acceptFriendRoute}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    friendname: friendname
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            getListFriend();
            setSearchUserData([]);
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
    // hide action
    const [action, setAction] = useState(null);
    const toggleAction = (index) => {
        if (action === index) {
            setAction(null);
        } else {
            setAction(index);
        }
    };

    //delete friend
    const deleteFriend = async (friendname) => {
        try {
            const response = await fetch(`${declineFriendRoute}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    friendname: friendname
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            getListFriend();
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
    return (
        <View style={{ width: '100%', alignItems: "center", marginTop: 10 }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, backgroundColor: "#fff", width: "95%", borderRadius: 15 }}>
                <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", width: "40%", height: 35 }}>
                        <FontAwesome name="user" size={24} color="black" />
                        <Text style={{ fontWeight: "bold", marginLeft: 10, fontSize: 16 }}>List Friend</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", width: "60%", justifyContent: "flex-end" }}>
                        {showTextInput && (
                            <TextInput
                                placeholder="Search"
                                style={{ width: "80%", height: 35, borderRadius: 10, backgroundColor: "#e8e8e8", paddingHorizontal: 10 }}
                                value={searchText}
                                onChangeText={(text) => setSearchText(text)}
                            />
                        )}
                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={showInputAndSearch}>
                            <Ionicons name="search-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                {searchUserData.length !== 0 &&
                    <FindFriend searchUserData={searchUserData} />
                }
                <View>
                    {listFriendData.map((friend, index) => (
                        <View key={index}>
                            <View key={index} style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", marginTop: 10, alignItems: "center", backgroundColor: "#f3f5f6", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image source={{ uri: friend.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                    <Text style={{ fontWeight: "bold", marginLeft: 10, fontSize: 16 }}>{friend.username}</Text>
                                </View>
                                {friend.status === 1 && friend.createBy === username && (
                                    <TouchableOpacity style={{ flexDirection: "row", marginLeft: 8, backgroundColor: "#0071d8", padding: 5, borderRadius: 10, alignItems: "center", width: "23%", height: 35, justifyContent: "center", paddingHorizontal: 8 }}>
                                        <Text style={{ fontSize: 16, color: "#fff" }}>Cancel</Text>
                                    </TouchableOpacity>
                                )}
                                {friend.status === 1 && friend.createBy !== username && (
                                    <TouchableOpacity
                                        onPress={() => acceptFriend(friend.username)}
                                        style={{ flexDirection: "row", marginLeft: 8, backgroundColor: "#0071d8", padding: 5, borderRadius: 10, alignItems: "center", width: "23%", height: 35, justifyContent: "center", paddingHorizontal: 8 }}>
                                        <Text style={{ fontSize: 16, color: "#fff" }}>Accept</Text>
                                    </TouchableOpacity>
                                )}
                                {friend.status === 2 && (
                                    <TouchableOpacity style={{ height: 30, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => toggleAction(index)}>
                                        <SimpleLineIcons name="options-vertical" size={24} color="black" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {action === index && (
                                <View style={{ flexDirection: "row", width: "100%", marginTop: 8, justifyContent: "flex-end" }}>
                                    <TouchableOpacity
                                        onPress={() => deleteFriend(friend.username)}
                                        style={{ flexDirection: "row", marginLeft: 8, padding: 5, borderRadius: 10, alignItems: "center", width: "23%", height: 35, justifyContent: "center", paddingHorizontal: 8, backgroundColor: "#fd3730" }}>
                                        <Text style={{ fontSize: 16, color: "#fff" }}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: "row", marginLeft: 8, padding: 5, borderRadius: 10, alignItems: "center", width: "23%", height: 35, justifyContent: "center", paddingHorizontal: 8, borderColor: "#edeef2", borderWidth: 1 }}>
                                        <Image style={{ width: 30, height: 30 }} source={require("../image/5930147.png")} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                    {listFriendData === 0 && (
                        <View style={{ flexDirection: "row", width: "100%", height: 30, justifyContent: "flex-end", alignItems: "center" }}>
                            <TouchableOpacity style={{ flexDirection: "row", width: "30%", height: "100%", justifyContent: "center", alignItems: "center" }} onPress={getListFriend}>
                                <Text style={{ color: '#0071d8' }}>Refresh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: "row", width: "30%", height: "100%", justifyContent: "center", alignItems: "center" }} onPress={getListFriend}>
                                <Text style={{ textDecorationLine: "underline" }}>See all</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}