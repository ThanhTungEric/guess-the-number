import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet, TouchableOpacity, Text, View, Image
} from "react-native";

import { getAllRooms, host } from "../../../../router/APIRouter";
import axios from "axios";
import { io } from "socket.io-client";

//icon
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const currentUser =
{
    username: "thanhtung",
    _id: "6634f26fdbd65d4b403b5fef",
}
function Room({ navigation, route }) {
    const handleBackHome = () => {
        navigation.navigate('Home')
    }
    const handlePlayWithPlayer = ({ room }) => {
        navigation.navigate('PlayWithPlayer', { room, socket })
    }
    const [listRoom, setListRoom] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(getAllRooms);
                setListRoom(response.data)
            } catch (error) {
                console.log("error", error);
            }
        }
        fetchData()
    }, [])
    const socket = useRef();
    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.cricle_back} onPress={() => handleBackHome()}>
                    <Ionicons name="chevron-back" size={30} color="white" />
                </TouchableOpacity>
                <View style={styles.user_number}>
                    <View style={styles.icon_user_number}>
                        <FontAwesome name="home" size={24} color="#ff7e39" />
                    </View>
                    <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}> 6/10 </Text>
                </View>
            </View>
            <View style={styles.container_item_room}>
                {(listRoom || []).map((item, index) => (
                    <TouchableOpacity style={styles.item_room} key={index} onPress={() => handlePlayWithPlayer({ room: item })}>
                        <Image source={require('../../../../image/room.png')} style={{ width: 70, height: 70, borderRadius: 35 }} />
                        <Text style={{ color: "#fe841d", fontSize: 20, fontWeight: "bold" }}>ROOM {item.roomName}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

export default Room;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e8e8e8",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
    },
    cricle_back: {
        backgroundColor: "#04c677",
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    user_number: {
        backgroundColor: "#ff7e39",
        flexDirection: "row",
        padding: 5,
        borderRadius: 20,
        width: 100,
        alignItems: "center",
    },
    icon_user_number: {
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    item_room: {
        backgroundColor: "#fff",
        width: "40%",
        aspectRatio: 1,
        borderRadius: 15,
        borderColor: "#ffbe2e",
        borderWidth: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    container_item_room: {
        flexWrap: "wrap",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
    }
});