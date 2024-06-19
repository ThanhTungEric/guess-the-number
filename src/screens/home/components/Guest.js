import React, { useEffect, useRef } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";

const Guest = ({ userId, roomId, createBy, guesses }) => {
    const scrollViewRef = useRef();
  
    // Ensure guesses are sorted and an array before using it
    const sortedGuesses = Array.isArray(guesses) ? guesses.sort((a, b) => a.createdAt - b.createdAt) : [];
  
    // Scroll to the bottom whenever guesses change
    useEffect(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [guesses]);
  
    const renderGuesses = () => {
      if (sortedGuesses.length > 0) {
        return (
          <View style={styles.messageContainer}>
            {sortedGuesses.map((guess, index) => (
              <View
                key={index}
                style={[
                  guess.user === createBy ? styles.ownerMessage : styles.guestMessage,
                  styles.message,
                ]}
              >
                <Text style={guess.user === createBy ? styles.ownerText : styles.guestText}>
                  {guess.user === createBy ? 'Chủ phòng' : 'Khách'} {` đã đoán số: ${guess.number}`}
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
          {userId === createBy ? "Bạn là chủ phòng" : "Bạn là khách"}
        </Text>
        <ScrollView style={styles.scrollView} ref={scrollViewRef}>
          {renderGuesses()}
        </ScrollView>
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: 'center',
    },
    scrollView: {
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
});

export default Guest;
