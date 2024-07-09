import React, { useState, useEffect, useRef } from "react";
import { Text, View, Image, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainNotification({ toggleModalNotification, modalVisibleNotification }) {

    //get notification save to async storage
    const [notification, setNotification] = useState([]);
    const getNotificationFromAsyncStorage = async () => {
        const storedNotifications = await AsyncStorage.getItem("notification");
        const storedNotificationsData = storedNotifications ? JSON.parse(storedNotifications) : [];
        setNotification(storedNotificationsData);
    };
    useEffect(() => {
        getNotificationFromAsyncStorage();
    }, []);

    const scrollViewRef = useRef(null);
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd();
        }
    }, [notification]);
    return (
        <Modal
            visible={modalVisibleNotification}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleModalNotification}
        >
            <View style={styles.modalContainer}>
                <View style={{ width: "90%", height: "90%", borderRadius: 10, backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 8 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>Thông báo</Text>
                    <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                        {notification.map((item, index) => (
                            <View key={index} style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 8 }}>Guess the number</Text>
                                        <Text style={{ fontSize: 12, color: "#ccc", marginLeft: 8 }}>
                                            {new Date(item.createdAt).toLocaleString("vi-VN", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 16 }}>{item.content}</Text>
                                <Image source={{ uri: item.image }} style={{ width: "100%", height: 450, borderRadius: 10, marginVertical: 8 }} resizeMode="contain" />

                            </View>
                        ))}
                    </ScrollView>
                    <View style={{ alignItems: "center", width: "100%" }}>
                        <TouchableOpacity style={styles.closeButton} onPress={toggleModalNotification}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#fed034',
        paddingVertical: 8,
        paddingHorizontal: 8,
        width: "30%",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    closeButtonText: {
        color: '#111',
        fontSize: 16,
        fontWeight: 'bold',
    },
});