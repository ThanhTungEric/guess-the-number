import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";

const Guest = ({ userId, roomId, createBy, guesses }) => {
    useEffect(() => {
        console.log("userId:", userId);
        console.log("createBy:", createBy);
        console.log("guesses:", guesses);
    }, [userId, createBy]);

    const isRoomOwner = userId === createBy;

    // Sắp xếp lại danh sách các lượt đoán theo thứ tự thời gian
    const sortedGuesses = Array.isArray(guesses) ? guesses.sort((a, b) => a.createdAt - b.createdAt) : [];

    // Hiển thị số lượt đoán theo thứ tự
    const renderGuesses = () => {
        if (Array.isArray(sortedGuesses) && sortedGuesses.length > 0) {
            return (
                <View style={styles.messageContainer}>
                    {sortedGuesses.map((guess, index) => (
                        <View
                            key={index}
                            style={[
                                guess.user === createBy
                                    ? styles.ownerMessage
                                    : styles.guestMessage,
                                styles.message,
                            ]}>
                            <Text
                                style={
                                    guess.user === createBy
                                        ? styles.ownerText
                                        : styles.guestText
                                }>
                                {guess.user === createBy
                                    ? 'Chủ phòng'
                                    : 'Khách'}{" "}
                                đã đoán số: {guess.number}
                            </Text>
                        </View>
                    ))}
                </View>
            );
        }
        return <Text style={styles.infoText}>Không có số nào đã được đoán</Text>;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                {isRoomOwner ? "Bạn là chủ phòng" : "Bạn là khách"}
            </Text>
            <View style={styles.chatContainer}>{renderGuesses()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: 'center',
    },
    chatContainer: {
        flex: 1,
        marginTop: 16,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
    },
    messageContainer: {
        marginBottom: 12,
    },
    ownerMessage: {
        alignSelf: 'flex-start',
        backgroundColor: "#d1e7dd",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    guestMessage: {
        alignSelf: 'flex-end',
        backgroundColor: "#f8d7da",
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    ownerText: {
        color: "#0f5132",
    },
    guestText: {
        color: "#842029",
    },
    infoText: {
        color: "#555",
        textAlign: "center",
        marginTop: 10,
    },
    allGuessesContainer: {
        marginTop: 20,
    },
    allGuessesHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    allGuessText: {
        fontSize: 16,
        marginBottom: 8,
    },
});

export default Guest;
