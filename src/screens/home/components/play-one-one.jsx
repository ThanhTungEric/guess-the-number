import { FontAwesome, FontAwesome6, Ionicons, Octicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import io from 'socket.io-client';
import { useData } from '../../../HookToGetUserInfo/DataContext';
const { width } = Dimensions.get("window");

import { getRoomRoute, guessNumberRoute, leaveRoomRoute } from "../../../apiRouter/API";
import LoadingDots from '../../../loadingDots/react-native-loading-dots';

const socket = io('http://14.225.207.218:3000');

const PlayOneToOne = ({ navigation }) => {
  const winner = require('../components/img/win.jpg');
  const scrollViewRef = useRef();
  const route = useRoute();
  const [selectedNumbers, setSelectedNumbers] = useState(["", "", "", ""]);
  const [roomInfo, setRoomInfo] = useState();
  const { userData } = useData();
  const { data } = userData;
  const id = data.user._id;
  const POLL_INTERVAL = 5000;
  const [rs, setRs] = useState("");
  const playerNumbers = roomInfo?.playerNumbers;
  const guesses = roomInfo?.guesses;
  const [showWinnerAlert, setShowWinnerAlert] = useState(false);
  const [matchingDigitsForGuesses, setMatchingDigitsForGuesses] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const endRef = useRef(null);

  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    if (guesses) {
      const newMatchingDigitsForGuesses = {};
      guesses.forEach((guess) => {
        newMatchingDigitsForGuesses[guess._id] = handleCompare(id, guess.number);
      });
      setMatchingDigitsForGuesses(newMatchingDigitsForGuesses);
    }
  }, [guesses]);

  const sortedGuesses = Array.isArray(guesses) ? guesses.sort((a, b) => a.createdAt - b.createdAt) : [];

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
      socket.on('game-won', (winnerInfo) => { // Listen for win event
        setWinnerInfo(winnerInfo);
        setShowWinnerAlert(true);
        setIsModalVisible(true);
      });
    }
  }, [roomInfo]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    if (checkMember() && !alertShown) {
      Alert.alert("Đã có người chơi tham gia");
      setAlertShown(true); // Mark alert as shown
    }
  }, [roomInfo, alertShown]);

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

  const getNumberByUser = () => {
    if (playerNumbers) {
      const userNumber = playerNumbers.find(player => player.player === id);
      return userNumber ? userNumber.number : null;
    }
    return null;
  };

  const getNumberByOpponent = () => {
    if (playerNumbers) {
      const opponentNumber = playerNumbers.find(player => player.player !== id);
      return opponentNumber ? opponentNumber.number : null;
    }
    return null;
  };

  const toggleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleClickOutsideEndRef = (event) => {
    if (endRef.current && !endRef.current.contains(event.nativeEvent.target)) {
      const { width, height } = Dimensions.get("window");
      if (
        event.nativeEvent.locationX < 0 ||
        event.nativeEvent.locationX > width ||
        event.nativeEvent.locationY < 0 ||
        event.nativeEvent.locationY > height
      ) {
        setIsModalVisible(false);
      }
    }
  };

  useEffect(() => {
    const listener = Dimensions.addEventListener("change", handleClickOutsideEndRef);
    return () => {
      listener.remove();
    };
  }, [endRef]);

  const numberEntered = selectedNumbers.join('');
  const numberOpponent = getNumberByOpponent();

  const checkPositionNumberCorrect = (id) => {
    const [matchingDigits, correctPositions] = matchingDigitsForGuesses[id] || [0, 0];

    if (matchingDigits === 4 && correctPositions !== 4) {
      return (
        <Text style={styles.positionText}>
          Chưa đúng vị trí
        </Text>
      );
    }
    if (correctPositions === 4) {
      return (
        <Text style={styles.positionText}>
          Bạn đã đoán đúng số của đối thủ!
        </Text>
      );
    }
    return null;
  };

  const handleCompare = (userId, number) => {
    const opponentNumber = getNumberByOpponent();
    if (!opponentNumber) {
      return [0, 0];
    }

    const str1 = number.toString();
    const str2 = opponentNumber.toString();

    let matchingDigits = 0;
    let correctPositions = 0;

    for (let i = 0; i < str1.length; i++) {
      if (str2.includes(str1[i])) {
        matchingDigits++;
      }
      if (str2[i] === str1[i]) {
        correctPositions++;
      }
    }

    return [matchingDigits, correctPositions];
  };

  const getTurn = () => {
    if (roomInfo?.currentTurn === id) {
      return (
        <TouchableOpacity style={styles.sendButton} onPress={handleGuest}>
          <FontAwesome name="send" size={24} color="#fff" />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.sendButtonHide}>
        <FontAwesome name="send" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  const handleGuest = async () => {
    if (!roomInfo || roomInfo?.gameStatus === "waiting") {
      Alert.alert("Phòng chưa đủ người hoặc thông tin phòng chưa được tải.");
      return;
    }
    if (roomInfo.currentTurn !== id) {
      Alert.alert("Chưa đến lượt bạn đoán");
      return;
    }
    const number = selectedNumbers.join('');
    const opponentNumber = getNumberByOpponent();
    if (number.length < 4) {
      Alert.alert("Vui lòng chọn đủ 4 số.");
      return;
    }
    if (number === opponentNumber) {
      Alert.alert("Bạn đã đoán đúng số của đối thủ!");
      return;
    }
    try {
      const response = await axios.post(guessNumberRoute, {
        roomNumber: roomInfo.roomNumber,
        userId: id,
        number: number,
      });
      const responseData = response.data;
      setRs(responseData);
      const guessInfo = {
        user: id,
        number: number,
        result: responseData.result,
      };
      setSelectedNumbers(["", "", "", ""]);
      setMatchingDigitsForGuesses((prev) => ({
        ...prev,
        [responseData.guessId]: handleCompare(id, number),
      }));
      socket.emit('guess-number', {
        roomId: roomInfo.roomNumber,
        guessInfo,
      });

      if (responseData.result && responseData.result.winner === id) {
        setShowWinnerAlert(true);
        setIsModalVisible(true);
      }
    } catch (err) {
      console.error("Error occurred while guessing:", err);
      Alert.alert("Error occurred while guessing");
    }
  };

  const checkMember = () => {
    return roomInfo?.players.length === 2;
  };

  const hiddenMember = () => {
    return !checkMember();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0082B4ed" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableHighlight style={styles.circleBack} onPress={handleBackHome}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableHighlight>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={{ marginLeft: 8, fontSize: 20, color: "#fff", fontWeight: "600" }}>{roomInfo?.roomNumber}</Text>
        </View>
        <View style={styles.bound}>
          <View style={styles.userNumber}>
            <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}>
              {getNumberByUser()}
            </Text>
          </View>
          {/* <View style={{ marginLeft: 10, marginTop: 10 }}>
            {getTurn()}
          </View> */}
        </View>
      </View>
      {hiddenMember() && (
        <View style={{ padding: 10, alignItems: "center", flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, color: "#111", fontWeight: "600", marginBottom: 30 }}>
            Chờ đủ người chơi
          </Text>
          <LoadingDots />
        </View>
      )}
      {hiddenMember() !== true && (
        <View style={styles.guessTable}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.messageContainer}>
              {sortedGuesses.map((guess, index) => (
                <View
                  key={index}
                  style={[
                    guess.user === id ? styles.ownerMessage : styles.guestMessage,
                    styles.message,
                    guess.user === id ? styles.ownerMessageUnique : styles.guestMessageUnique, // Special shape style
                  ]}
                >
                  <Text style={guess.user === id ? styles.ownerText : styles.guestText}>
                    {guess.user === id ? 'Bạn' : 'Đối thủ'} đã đoán số: {guess.number}.
                  </Text>
                  {guess.user === id && matchingDigitsForGuesses[guess._id] !== undefined && (
                    <Text style={styles.matchingDigitsText}> Đúng: {matchingDigitsForGuesses[guess._id][0]} số</Text>
                  )}
                  {guess.user === id && matchingDigitsForGuesses[guess._id] !== undefined && (
                    checkPositionNumberCorrect(guess._id)
                  )}
                </View>
              ))}
              {roomInfo && roomInfo.gameStatus === 'finished' && (
                <View style={[
                  styles.endGameMessage,
                  roomInfo.winner === id ? styles.winnerMessage : styles.loserMessage
                ]}>
                  <Text style={styles.endGameText}>End Game!</Text>
                  {
                    roomInfo.winner === id ? (
                      <Text style={styles.endGameText}>Chúc mừng! Bạn đã chiến thắng!</Text>
                    ) : (
                      <Text style={styles.endGameText}>Rất tiếc! Bạn đã thua!</Text>
                    )
                  }
                </View>
              )}

            </View>
          </ScrollView>
        </View>
      )}
      {hiddenMember() !== true && (
        <>
          <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={styles.inputNumber}>
                <Text style={styles.inputNumberText}>
                  {selectedNumbers[index]}
                </Text>
              </View>
            ))}
            {getTurn()}
          </SafeAreaView>

          <SafeAreaView style={styles.numberPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item) => (
              <TouchableOpacity key={item} style={styles.numberButton} onPress={() => handleNumberPress(item)}>
                <Text style={styles.numberButtonText}>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
              <FontAwesome6 name="delete-left" size={30} color="red" />
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModalVisibility}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={winner} style={{ width: 200, height: 200, resizeMode: 'contain' }} />
            <Text style={styles.modalText}>Chúc mừng! {winnerInfo?.winnerId === id ? "Đối thủ đã" : "Bạn đã"} đoán đúng số!</Text>
            <TouchableOpacity onPress={toggleModalVisibility} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default PlayOneToOne;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0082B4',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "98%",
    borderRadius: 20,
  },
  circleBack: {
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  userNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7E39',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  iconUserNumber: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  inputNumber: {
    backgroundColor: '#0B9D6A',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  inputNumberText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#0071d8',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  sendButtonHide: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 15,
  },
  numberButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FF7E39',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  numberButtonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  guessTable: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F5F5F5',
    marginTop: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  scrollView: {
    width: '100%',
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.43,
    shadowRadius: 2.62,
    elevation: 4,
  },
  ownerMessage: {
    backgroundColor: '#d1f2eb',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  guestMessage: {
    backgroundColor: '#f9e79f',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  ownerMessageUnique: {
    transform: [{ rotate: '1deg' }],
  },
  guestMessageUnique: {
    transform: [{ rotate: '-1deg' }],
  },
  ownerText: {
    color: '#0B9D6A',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  guestText: {
    color: '#FF7E39',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  matchingDigitsText: {
    color: '#000',
    marginTop: 5,
    fontWeight: 'bold',
  },
  positionText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#61dafb',
    borderRadius: 5,
    width: 80,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  endGameMessage: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
  },
  winnerMessage: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    color: '#155724',
  },
  loserMessage: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    color: '#721c24',
  },
  endGameText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});





