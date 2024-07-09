import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getNotificationRoute } from "../../apiRouter/API";
//icon
import { AntDesign, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { useData } from "../../HookToGetUserInfo/DataContext";

export default function UserInfor({toggleModalNotification, toggleModalGift}) {
    const { userData } = useData();
    const { data } = userData;
    const { t } = useTranslation();

    const username = data.user.username;
    const point = data.user.point;
    const numberWin = data.user.numberWin;
    const numberLose = data.user.numberLose;
    const avatar = data.user.avatar;
    const ranking = numberWin - numberLose;
    const level = data.user.level;
    const coin = data.user.coin;
    console.log(data.user, "data user");
    const [currentPoint, setCurrentPoint] = useState(point);
    useEffect(() => {
        setCurrentPoint(point);
    }, [point]);

    const calculateLevel = (ranking) => {
        let level = Math.floor((ranking - 1) / 100) + 1;
        return level;
    }
    useEffect(() => {
        calculateLevel(ranking);
    },[ranking]);

    //get notification save to async storage
    const getNotification = async () => {
        try {
            const response = await fetch(getNotificationRoute, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const result = await response.json();
                const storedNotifications = await AsyncStorage.getItem("notification");
                const storedNotificationsData = storedNotifications ? JSON.parse(storedNotifications) : [];

                const notificationData = result.map(item => {
                    const existingItem = storedNotificationsData.find(n => n._id === item._id);
                    if (existingItem) {
                        return existingItem;
                    } else {
                        return {
                            ...item,
                        };
                    }
                });
                await AsyncStorage.setItem("notification", JSON.stringify(notificationData));
            } else {
                console.error('Lỗi khi lấy thông báo:', response.status);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    }


    useEffect(() => {
        getNotification();
    }, []);

    //test get notification from async storage
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const getNotificationFromAsyncStorage = async () => {
        const storedNotifications = await AsyncStorage.getItem("notification");
        const storedNotificationsData = storedNotifications ? JSON.parse(storedNotifications) : [];

        // Tìm các thông báo chưa đọc
        const unreadNotifications = storedNotificationsData.filter(item => item.status === "unread");
        setUnreadNotifications(unreadNotifications);
    };
    useEffect(() => {
        getNotificationFromAsyncStorage();
    }, []);
    const handlePress = () => {
        toggleModalNotification();
        setUnreadNotifications([]);

        // Cập nhật trạng thái của thông báo
        const updateNotification = async () => {
            const storedNotifications = await AsyncStorage.getItem("notification");
            const storedNotificationsData = storedNotifications ? JSON.parse(storedNotifications) : [];

            const updatedNotifications = storedNotificationsData.map(item => {
                if (item.status === "unread") {
                    return {
                        ...item,
                        status: "read",
                    };
                } else {
                    return item;
                }
            });
            await AsyncStorage.setItem("notification", JSON.stringify(updatedNotifications));
        };
        updateNotification();
    }
    //
    return (
        <View style={styles.main_container_info}>
            <View style={styles.main_container_info_header}>
                <TouchableOpacity style={styles.cricle} onPress={handlePress}>
                    <Ionicons name="mail" size={24} color="white" />
                    {unreadNotifications.length > 0 && (
                        <View style={{ width: 13, height: 13, borderRadius: 50, backgroundColor: "red", position: "absolute", top: -1, right: -3 }} />
                    )}
                </TouchableOpacity>
                <View style={{ alignItems: "center" }}>
                    <Image source={{ uri: avatar }} style={{ width: 70, height: 70, borderRadius: 50 }} />
                    <Text style={{ color: "#262c32", fontSize: 20, fontWeight: "bold" }}>{username}</Text>
                </View>
                <TouchableOpacity style={styles.cricle} onPress={toggleModalGift}>
                    <MaterialCommunityIcons name="gift" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", width: "90%", justifyContent: "space-between", marginTop: 15 }}>
                <View style={{ alignItems: "center", width: "33%" }}>
                    <FontAwesome6 name="ranking-star" size={24} color="white" />
                    <Text style={{ color: "#fff", fontSize: 16 }}>{t('rank')}</Text>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}> {ranking} </Text>
                </View>
                <View style={{ alignItems: "center", width: "33%" }}>
                    <FontAwesome5 name="medal" size={24} color="white" />
                    <Text style={{ color: "#fff", fontSize: 15 }}>{t('point')}</Text>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}> {point}</Text>
                </View>
                <View style={{ alignItems: "center", width: "33%" }}>
                    <AntDesign name="star" size={24} color="#ffd433" />
                    <Text style={{ color: "#fff", fontSize: 15 }}>{t('level')}</Text>
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