import React, { useState, useEffect } from "react";
import {
  Button, SafeAreaView, StyleSheet, Modal, TouchableOpacity, Text,
  View, TextInput, Dimensions, Image
} from "react-native";

//icon
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const currentChat = {
  username: "thaothu",
  _id: "6634fbcddbd65d4b403b6007",
}
const data =
{
  username: "thanhtung",
  _id: "6634f26fdbd65d4b403b5fef",
}

function PlayWithPlayer({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const handleBackHome = () => {
    navigation.navigate('Home')
  }
  const [botNumber, setBotNumber] = useState('2031');
  const [isModalVisible, setModalVisible] = useState(true);
  const [inputValue, setInputValue] = useState([]);

  //navigation.navigate('PlayWithPlayer', { room, socket })
  const roomName = route.params.room;
  const socket = route.params.socket;

  const toggleModalVisibility = () => {
    if (inputValue.length === 4) {
      setModalVisible(!isModalVisible);

    }
  }
  const handleInputNumber = (number) => {
    if (inputValue.length < 4 && !inputValue.includes(number)) {
      setInputValue([...inputValue, number]);
    }
  }
  const handleDeleteNumber = () => {
    if (inputValue.length > 0) {
      setInputValue(inputValue.slice(0, -1));
    }
  }

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const handleNumberPress = (number) => {
    if (selectedNumbers.length < 4 && (number === 0 || !selectedNumbers.includes(number))) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleDeleteNumberGuess = () => {
    if (selectedNumbers.length > 0) {
      setSelectedNumbers(selectedNumbers.slice(0, -1));
    }
  };
  const [listNumber, setListNumber] = useState([]);
  const [numberIsCorrect, setNumberIsCorrect] = useState([]);
  const handleGuess = async () => {
    //if turn is false return 
    if (listNumber.length === 52) {
      console.log("You lose");
      return;
    }
    const number = selectedNumbers.join('');
    if (number.length < 4) {
      console.log("Please enter 4 numbers");
      return;
    }
    setListNumber([...listNumber, number]);
    let count = 0;
    for (let i = 0; i < 4; i++) {
      if (botNumber.includes(number[i])) {
        count++;
      }
    }
    setNumberIsCorrect([...numberIsCorrect, count]);
    if (number === botNumber) {
      console.log("You win");
      return;
    } else if (count === 4) {
      console.log("4 number is correct");
    } else if (count === 1) {
      console.log("1 number is correct");
    }
    else if (count === 2) {
      console.log("2 number is correct");
    }
    else if (count === 3) {
      console.log("3 number is correct");
    }
    else {
      console.log("0 number is correct");
    }
    setSelectedNumbers([]);
  };

  useEffect(() => {
    console.log(listNumber);
  }, [listNumber]);

  const handleSendMsg = async (msg) => {
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    handleGuess();
    setSelectedNumbers([]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.cricle_back} onPress={() => handleBackHome()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.user_number}>
          <View style={styles.icon_user_number}>
            <Octicons name="number" size={20} color="#ff7e39" />
          </View>
          <Text style={{ fontSize: 18, color: "#fff", fontWeight: "600" }}> {inputValue} </Text>
        </View>
      </View>
      <View style={styles.guess_table}>
        <Text style={{ fontSize: 20, color: "#fe841d", fontWeight: "bold" }}>Guess Table</Text>
        <SafeAreaView style={{ flexWrap: "wrap", paddingBottom: 10 }}>
          {listNumber.map((item, index) => (
            <View key={index} style={{ paddingTop: 1, marginLeft: 6, paddingRight: 6, flexDirection: "row", borderRightWidth: 1 }}>
              <Text style={{ fontSize: 20, color: "#02583d", fontWeight: "600" }}> {item} </Text>
              {numberIsCorrect[index] !== undefined && (
                <Text style={{ fontSize: 20, color: "#02583d", fontWeight: "600" }}> {numberIsCorrect[index]} </Text>
              )}
            </View>
          ))}
        </SafeAreaView>
      </View>
      <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", backgroundColor: '#fff' }}>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={{
            width: 50, height: 50, backgroundColor: "#5d7081",
            justifyContent: "center", alignItems: "center", margin: 5,
            borderRadius: 5
          }}>
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}> {selectedNumbers[index] !== undefined ? selectedNumbers[index] : ""} </Text>
          </View>
        ))}
        <TouchableOpacity style={{ backgroundColor: '#0b9d6a', width: 50, height: 50, justifyContent: "center", alignItems: "center", margin: 5, borderRadius: 5 }}  onPress={() => handleSendMsg(selectedNumbers.join(''))}>
          <FontAwesome name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", backgroundColor: "#fff" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item) => (
          <TouchableOpacity key={item} style={{
            width: 40, height: 40, backgroundColor: "#ff7e39",
            justifyContent: "center", alignItems: "center", margin: 5,
            borderRadius: 5
          }} onPress={() => handleNumberPress(item)}>
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}> {item} </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={{ justifyContent: "center", marginLeft: 8 }} onPress={handleDeleteNumberGuess}>
          <FontAwesome6 name="delete-left" size={30} color="red" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* <Button title="Show Modal" onPress={toggleModalVisibility} /> */}
      <Modal animationType="slide"
        transparent visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}>
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <Text style={{ color: "#fe841d", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Enter your number</Text>
            <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
              {[...Array(4)].map((_, index) => (
                <View key={index} style={{
                  width: 50, height: 50, backgroundColor: "#5d7081",
                  justifyContent: "center", alignItems: "center", margin: 5,
                  borderRadius: 5
                }}>
                  <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}> {inputValue[index] !== undefined ? inputValue[index] : ""} </Text>
                </View>
              ))}
            </SafeAreaView>

            <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item) => (
                <TouchableOpacity key={item} style={{
                  width: 35, height: 35, backgroundColor: "#fed034",
                  justifyContent: "center", alignItems: "center", margin: 5,
                  borderRadius: 5
                }} onPress={() => handleInputNumber(item)}>
                  <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}> {item} </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={{ justifyContent: "center", marginLeft: 8 }} onPress={handleDeleteNumber}>
                <FontAwesome6 name="delete-left" size={30} color="red" />
              </TouchableOpacity>
            </SafeAreaView>
            <TouchableOpacity onPress={toggleModalVisibility} style={{ marginTop: 10 }}>
              <Image source={require('../../../../image/start-the-game.png')} resizeMode="contain" style={{ width: 170, height: 50 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default PlayWithPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  cricle_back: {
    backgroundColor: "#04c677",
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  user_number: {
    backgroundColor: "#ff7e39",
    flexDirection: "row",
    padding: 5,
    borderRadius: 20,
    width: 100,
    alignItems: "center",
  },
  icon_user_number: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) },
    { translateY: -90 }],
    height: 270,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  guess_table: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }
});