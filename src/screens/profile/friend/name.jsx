import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { useData } from "../../../HookToGetUserInfo/DataContext";
import img from "../image/5930147.png";
import VN from "../../login/img/VN.png";
export default function Name() {
    const { userData } = useData();
    const { data } = userData;
    const avatar = data.user.avatar;
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image source={avatar ? { uri: avatar } : img}
                style={styles.avatarImage} />
            </View>
            <View style={styles.userInfoContainer}>
                <Text style={styles.username}>{data.user.username}</Text>
                <View style={styles.country}>
                    <Text style={styles.location}>VietNam</Text>
                    <Image source={VN} style={styles.avatarCountry} />
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 50
    },
    avatarCountry: {
        width: 30,
        height: 30,
        resizeMode: "cover",
        
    },
    country:{
        flexDirection: "column",
        alignItems: "center",

    },
    userInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(44, 44, 44, 0.8)', // Màu nền với độ mờ
        marginBottom: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: '#FFD700',
        height: 70,
        marginLeft: 10,
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFD700",
    },
    location: {
        fontSize: 16,
        color: "#fff",
    },
});