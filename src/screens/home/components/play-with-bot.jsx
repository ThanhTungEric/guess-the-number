import React, { useState, useEffect, useRef } from "react";
import {
  Button, SafeAreaView, StyleSheet, Modal, TouchableOpacity, Text,
  View, TextInput, Dimensions, Image, ScrollView
} from "react-native";

//icon
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

function PlayWithBot({ navigation }) {
  const handleBackHome = () => {
    navigation.navigate('Home')
  }
  const [botNumber, setBotNumber] = useState('');
  const [isModalVisible, setModalVisible] = useState(true);
  const scrollViewRef = useRef();
  const [inputValue, setInputValue] = useState([]);
  const [allNumber, setAllNumber] = useState([]);
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);


  const toggleModalVisibility = () => {
    if (inputValue.length === 4) {
      setModalVisible(!isModalVisible);
      const randomUniqueNumber = getRandomUniqueFourDigitNumber();
      setBotNumber(randomUniqueNumber);
      console.log("number of bot", randomUniqueNumber);
    }
  }
  //model input number
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

  // chọn số
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
      return;
    }
    const number = selectedNumbers.join('');
    if (number.length < 4) {
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
      setAllNumber(prevAllNumber => [
        ...prevAllNumber,
        { value: number, type: 'p', result: count },
        { value: `Bạn đã chiến thắng`, type: 'b', result: count }
      ]);
      return;
    }
    setAllNumber(prevAllNumber => [
      ...prevAllNumber,
      { value: number, type: 'p', result: count },
      { value: `Bạn đã đúng ${count} số`, type: 'b', result: count }
    ]);
    aiBotGuessNumber();
    setSelectedNumbers([]);
  };

  // AI bot guess number
  const [isCorect0, setIsCorect0] = useState([]);
  const [isCorect1, setIsCorect1] = useState([]);
  const [isCorect2, setIsCorect2] = useState([]);
  const [isCorect3, setIsCorect3] = useState([]);
  const [isCorect4, setIsCorect4] = useState([]);
  const [botGuessNumber, setBotGuessNumber] = useState([]);
  const aiBotGuessNumber = () => {
    let number = '';
    const inputValueNumber = inputValue.join('');

    let usedNumbers = [];
    // use number to random 4 number
    for (let i = 0; i < 4; i++) {
      let randomNumber;
      do {
        randomNumber = Math.floor(Math.random() * 10);
      } while (usedNumbers.includes(randomNumber));
      usedNumbers.push(randomNumber);
      number += randomNumber;
    }
    setBotGuessNumber([...botGuessNumber, number]);

    let count = 0;
    for (let i = 0; i < 4; i++) {
      if (inputValueNumber.includes(number[i])) {
        count++;
      }
    }
    if (number === inputValueNumber) {
      setAllNumber(prevAllNumber => [
        ...prevAllNumber,
        { value: number, type: 'b', result: count },
        { value: `Bot đã chiến thắng`, type: 'p', result: count }
      ]);
    } else if (count === 4) {
      isCorect4.push(number);
    } else if (count === 1) {
      isCorect1.push(number);
    }
    else if (count === 2) {
      isCorect2.push(number);
    }
    else if (count === 3) {
      isCorect3.push(number);
    }
    else {
      isCorect0.push(number);
    }
    setAllNumber(prevAllNumber => [
      ...prevAllNumber,
      { value: number, type: 'b', result: count },
      { value: `Bạn đã đúng ${count} số`, type: 'p', result: count }
    ]);
  }

  // ramdom number
  const getRandomUniqueFourDigitNumber = () => {
    let numArray = [];
    for (let i = 0; i < 10; i++) {
      numArray.push(i);
    }
    let result = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * numArray.length);
      result += numArray[randomIndex];
      numArray.splice(randomIndex, 1);
    }

    return result;
  }

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
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: 'flex-start' }}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {allNumber.map((num, index) => (
            <View
              key={index}
              style={num.type === 'p' ? styles.messageContainerSent : styles.messageContainer}
            >
              <View style={num.type === 'p' ? styles.messageSent : styles.messageReceived}>
                <Text style={styles.messageText}>{num.value}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
        <TouchableOpacity style={{ backgroundColor: '#0b9d6a', width: 50, height: 50, justifyContent: "center", alignItems: "center", margin: 5, borderRadius: 5 }} onPress={handleGuess}>
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
        onPress={toggleModalVisibility}>
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

export default PlayWithBot;

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
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    width: '100%'
  },
  messageReceived: {
    backgroundColor: '#e1ffc7',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginLeft: 10,
    maxWidth: '100%',
  },
  messageContainerSent: {
    flexDirection: 'row',
    marginVertical: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageSent: {
    backgroundColor: '#d1e7ff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  messageText: {
    fontSize: 17,
  },
});