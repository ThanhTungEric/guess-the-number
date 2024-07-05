import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Image, TouchableOpacity } from "react-native";

import { addFriendRoute } from "../../../apiRouter/API";
import { useData } from "../../../HookToGetUserInfo/DataContext";

import { AntDesign } from '@expo/vector-icons';

export default function FindFriend({ searchUserData }) {
    const { userData } = useData();
    const { data } = userData;
    const username = data.user.username;
    const [isFriendAdded, setIsFriendAdded] = useState(false);

    const addFriend = async () => {
        try {
            const response = await fetch(`${addFriendRoute}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    friendname: searchUserData.username
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setIsFriendAdded(true);
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }

    return (
        <View style={{ width: '100%', alignItems: "center", marginTop: 10, backgroundColor: "#04c977", paddingHorizontal: 5, paddingVertical: 5, borderRadius: 10 }}>
            <View style={{ flexDirection: "row", width: "90%", alignItems: "center" }}>
                <Image source={{ uri: searchUserData.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                <Text style={{ fontWeight: "bold", marginLeft: 10, fontSize: 16, color: "#fff" }}>{searchUserData.username}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "flex-end" }}>
                {isFriendAdded ? (
                    <TouchableOpacity style={{ flexDirection: "row", marginLeft: 8, backgroundColor: "#fff", padding: 5, borderRadius: 10, alignItems: "center", width: "23%", height: 35, justifyContent: "center", paddingHorizontal: 8 }}>
                        <Text style={{ fontSize: 16 }}>Added</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{ flexDirection: "row", marginLeft: 8, backgroundColor: "#fff", padding: 5, borderRadius: 10, alignItems: "center", width: "23%", height: 35, justifyContent: "space-between", paddingHorizontal: 8 }} onPress={addFriend}>
                        <Text style={{ fontSize: 16 }}>Add</Text>
                        <AntDesign name="adduser" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}
