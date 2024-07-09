import React from "react";
import { Text, View, Image, TouchableOpacity, Modal, StyleSheet} from "react-native";

export default function Gift({ modalVisibleGift, toggleModalGift }) {
    return (
        <Modal
            visible={modalVisibleGift}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleModalGift}
        >
            <View style={styles.modalContainer}>
                <View style={{ width: "90%", height: "40%", borderRadius: 10, backgroundColor: "#fff", paddingHorizontal: 8, paddingVertical: 8, justifyContent: "space-around" }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>
                        Chưa mở được quà, cùng đón chờ nhé!
                    </Text>
                    <View style={{ alignItems: "center", width: "100%" }}>
                        <TouchableOpacity style={styles.closeButton} onPress={toggleModalGift}>
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