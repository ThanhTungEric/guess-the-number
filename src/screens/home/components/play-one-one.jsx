import { AntDesign, FontAwesome, Ionicons, Octicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import io from 'socket.io-client';
import { useData } from '../../../HookToGetUserInfo/DataContext';
import { getRoomRoute, guessNumberRoute, leaveRoomRoute } from "../../../apiRouter/API";
import Guest from './Guest';
import styles from './play-one-one.styles';

const socket = io('http://192.168.1.6:3000');

function PlayOneToOne({ navigation }) {
  const route = useRoute();
  const [selectedNumbers, setSelectedNumbers] = useState(["", "", "", ""]);
  const [hint, setHint] = useState("");
  const [opponentGuess, setOpponentGuess] = useState(null);
  const [roomInfo, setRoomInfo] = useState();
  const { userData } = useData();
  const { data } = userData;
  const id = data.user._id;
  const POLL_INTERVAL = 5000; // Poll every 5 seconds

  useEffect(() => {
    const initializeRoom = async () => {
      await getRoomInfo();
    };

    initializeRoom();

    const intervalId = setInterval(() => {
      getRoomInfo();
    }, POLL_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (roomInfo?.roomNumber && id) {
        socket.emit('leave-room', { roomId: roomInfo.roomNumber, userId: id });
        socket.off('opponent-info');
      }
    };
  }, [id]);

  useEffect(() => {
    if (roomInfo?.roomNumber && id) {
      socket.emit('join-room', { roomId: roomInfo.roomNumber, userId: id });

      socket.on('opponent-info', (info) => {
        setOpponentInfo(info);
      });

      socket.on('room-updated', () => {
        getRoomInfo();
      });
    }
  }, [roomInfo]);

  const getRoomInfo = async () => {
    try {
      const response = await axios.get(`${getRoomRoute}/${route.params.roomId}`);
      const data = response.data;
      setRoomInfo(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNumberPress = (number) => {
    const firstEmptyIndex = selectedNumbers.findIndex(num => num === "");
    if (firstEmptyIndex !== -1 && !selectedNumbers.includes(number.toString())) {
      const newSelectedNumbers = [...selectedNumbers];
      newSelectedNumbers[firstEmptyIndex] = number.toString();
      setSelectedNumbers(newSelectedNumbers);
    }
  };

  const handleBackHome = async () => {
    try {
      const response = await axios.post(leaveRoomRoute, {
        userId: id,
        roomId: roomInfo.roomNumber,
      });
      console.log(response.data);
      navigation.navigate('Home');
      Alert.alert("Bạn đã rời phòng");
      socket.emit('leave-room', {
        roomId: roomInfo.roomNumber,
      });
    } catch (err) {
      console.log(err, "err");
    }
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

  const handleGuest = async () => {
    if (!roomInfo || roomInfo?.gameStatus === "waiting") {
      Alert.alert("Phòng chưa đủ người hoặc thông tin phòng chưa được tải.");
      return;
    }

    try {
      const response = await axios.post(guessNumberRoute, {
        roomNumber: roomInfo.roomNumber,
        userId: id,
        number: selectedNumbers.join(''),
      });
      console.log(response.data);

      socket.emit('guess-number', {
        roomId: roomInfo.roomNumber,
        userId: id,
        number: selectedNumbers.join(''),
      });
    } catch (err) {
      console.log(err);
      Alert.alert("Đã xảy ra lỗi khi gửi dự đoán. Vui lòng thử lại.");
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableHighlight style={styles.cricle_back} onPress={handleBackHome}>
          <Ionicons name="chevron-back" size={30} color="white" /> 
        </TouchableHighlight>
        <View style={{ alignItems: "center" }}>
          <Text>Số phòng</Text>
          <Text style={{ fontSize: 20, color: "#f66a1d", fontWeight: "600" }}>{roomInfo?.roomNumber}</Text>
        </View>
        <View style={styles.user_number}>
          <View style={styles.icon_user_number}>
            <Octicons name="number" size={20} color="#ff7e39" />
          </View>
          <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
            {roomInfo?.secretNumber} 
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
        {[0,1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <TouchableOpacity key={item} style={styles.number_button} onPress={() => handleNumberPress(item)}>
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}> {item} </Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
      <SafeAreaView style={styles.functionButton}>
        <TouchableOpacity onPress={handleDeletePress}>
          <AntDesign name="delete" size={34} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGuest}>
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

      <ScrollView  style={styles.guest}>
        <Guest 
          userId={id} 
          roomId={roomInfo?.roomNumber} 
          createBy={roomInfo?.createdBy} 
          playerNumbers={roomInfo?.playerNumbers}
          guesses={roomInfo?.guesses}
        />
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}


export default PlayOneToOne;
