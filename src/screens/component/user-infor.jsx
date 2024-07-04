import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
//icon
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useData } from "../../HookToGetUserInfo/DataContext";

export default function UserInfor() {
    const { userData } = useData();
    const { data } = userData;
    
    const username = data.user.username;
    const point = data.user.point;
    const numberWin = data.user.numberWin;
    const numberLose = data.user.numberLose;
    const avatar = data.user.avatar;
    const ranking = numberWin - numberLose;
    const [currentPoint, setCurrentPoint] = useState(point);
    useEffect(() => {
        setCurrentPoint(point);
    }, [point]);
    console.log(point);
    
    const calculateLevel = (ranking) => {
        let level = Math.floor((ranking - 1) / 100) + 1;
        return level;
    }
    console.log(calculateLevel(ranking));

    useEffect(() => {
        calculateLevel(ranking);
    }
    , [ranking]);
    
    return (
        <View style={styles.main_container_info}>
            <View style={styles.main_container_info_header}>
                <View style={styles.cricle}>
                    <Ionicons name="mail" size={24} color="white" />
                </View>
                <View style={{ alignItems: "center" }}>
                    <Image source={{uri: avatar}} style={{ width: 70, height: 70, borderRadius: 50 }} />
                    <Text style={{ color: "#262c32", fontSize: 20, fontWeight: "bold" }}>{username}</Text>
                </View>
                <View style={styles.cricle}>
                    <MaterialCommunityIcons name="gift" size={24} color="white" />
                </View>
            </View>
            <View style={{ flexDirection: "row", width: "90%", justifyContent: "space-between", marginTop: 15 }}>
                <View style={{ alignItems: "center", width: "33%" }}>
                    <FontAwesome6 name="ranking-star" size={24} color="white" />
                    <Text style={{ color: "#fff", fontSize: 16 }}>Ranking</Text>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}> {ranking} </Text>
                </View>
                <View style={{ alignItems: "center", width: "33%" }}>
                    <FontAwesome5 name="medal" size={24} color="white" />
                    <Text style={{ color: "#fff", fontSize: 15 }}>Total Points</Text>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}> {point} </Text>
                </View>
                <View style={{ alignItems: "center", width: "33%" }}>
                    <AntDesign name="star" size={24} color="#ffd433" />
                    <Text style={{ color: "#fff", fontSize: 15 }}>Level</Text>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}> {calculateLevel(ranking)} </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main_container_info: {
        width: "90%",
        height: "auto",
        marginTop: 20,
        borderRadius: 15,
        backgroundColor: "#5d7081",
        alignItems: "center",
        paddingBottom: 20,
    },
    main_container_info_header: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomColor: "#2d3a43",
        borderBottomWidth: 1,
    },
    cricle: {
        width: 40,
        height: 40,
        backgroundColor: "#2d3a43",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
});