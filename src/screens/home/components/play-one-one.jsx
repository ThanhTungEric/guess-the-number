import { AntDesign, FontAwesome, Ionicons, Octicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import io from 'socket.io-client';
import styles from './play-one-one.styles';
import {createRoomRoute} from '../../../apiRouter/API';

const socket = io('http://192.168.1.6:3000');

function PlayOneToOne({ navigation }) {
  const route = useRoute();
  const { roomId, secretNumber, notification, isOwner } = route.params;
  const [selectedNumbers, setSelectedNumbers] = useState(["", "", "", ""]);
  const [hint, setHint] = useState("");
  const [opponentGuess, setOpponentGuess] = useState(null);
  console.log("roomId", roomId);
  console.log("secretNumber", secretNumber);
  console.log("notificationssss", notification);
  console.log("isOwner", isOwner);

  useEffect(() => {
    socket.emit('joinGame', { roomId });

    socket.on('startGame', (message) => {
      alert(message);
    });

    socket.on('opponentGuess', (guess) => {
      setOpponentGuess(guess);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleNumberPress = (number) => {
    const firstEmptyIndex = selectedNumbers.findIndex(num => num === "");
    if (firstEmptyIndex !== -1 && !selectedNumbers.includes(number.toString())) {
      const newSelectedNumbers = [...selectedNumbers];
      newSelectedNumbers[firstEmptyIndex] = number.toString();
      setSelectedNumbers(newSelectedNumbers);
    }
  };

  const handleBackHome = () => {
    navigation.navigate('Home');
  };

  const handleDeletePress = () => {
    const lastFilledIndex = selectedNumbers.slice().reverse().findIndex(num => num !== "");
    if (lastFilledIndex !== -1) {
      const indexToDelete = selectedNumbers.length - 1 - lastFilledIndex;
      const newSelectedNumbers = [...selectedNumbers];
      newSelectedNumbers[indexToDelete] = "";
      setSelectedNumbers(newSelectedNumbers);
    }
  };

  const compareNumber = () => {
    const number = selectedNumbers.join('');
    const secretNumberString = secretNumber.toString();
    let correctNumbers = 0;
    let correctPositions = 0;

    for (let i = 0; i < number.length; i++) {
      if (number[i] === secretNumberString[i]) {
        correctPositions++;
      } else if (secretNumberString.includes(number[i])) {
        correctNumbers++;
      }
    }

    let result = "";
    if (correctPositions === 4) {
      result = "Chúc mừng! Bạn đã đoán đúng số.";
    } else if (correctPositions > 0) {
      result = `Bạn có ${correctPositions} số đúng vị trí.`;
    } else if (correctNumbers > 0) {
      result = `Bạn có ${correctNumbers} số đúng nhưng sai vị trí.`;
    } else {
      result = "Không có số nào đúng.";
    }
    setHint(result);
    setSelectedNumbers(["", "", "", ""]);

    socket.emit('numberGuess', { roomId, guess: number });
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableHighlight style={styles.cricle_back} onPress={handleBackHome}>
          <Ionicons name="chevron-back" size={30} color="white" /> 
        </TouchableHighlight>
        <View style={{ alignItems: "center" }}>
          <Text>Số phòng</Text>
          <Text style={{ fontSize: 20, color: "#f66a1d", fontWeight: "600" }}>{roomId}</Text>
        </View>
        <View style={styles.user_number}>
          <View style={styles.icon_user_number}>
            <Octicons name="number" size={20} color="#ff7e39" />
          </View>
          <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
            {selectedNumbers.join('')} 
          </Text>
        </View>
      </View>
      <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={styles.input_number}>
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600", textAlign: "center" }}>
              {selectedNumbers[index]}
            </Text>
          </View>
        ))}
      </SafeAreaView>
      <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <TouchableOpacity key={item} style={styles.number_button} onPress={() => handleNumberPress(item)}>
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}> {item} </Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
      <SafeAreaView>
        <View>
          <Text>Số bí mật của bạn là {secretNumber}</Text>
        </View>
      </SafeAreaView>
      <SafeAreaView style={styles.functionButton}>
        <TouchableOpacity onPress={handleDeletePress}>
          <AntDesign name="delete" size={34} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={compareNumber}>
          <FontAwesome name="check" size={34} color="green" />
        </TouchableOpacity>
      </SafeAreaView>
      {hint ? (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      ) : null}
      {opponentGuess ? (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>Đối thủ đã đoán: {opponentGuess}</Text>
        </View>
      ) : null}
      {notification ? (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default PlayOneToOne;

