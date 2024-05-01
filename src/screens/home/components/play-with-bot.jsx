import React, { useState } from "react";
import {
  Button, SafeAreaView, StyleSheet, Modal, TouchableOpacity, Text,
  View, TextInput, Dimensions
} from "react-native";

//icon
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

function PlayWithBot({ navigation }) {
  const handleBackHome = () => {
    navigation.navigate('Home')
  }
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  }
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const handleNumberPress = (number) => {
    if (selectedNumbers.length < 4 && !selectedNumbers.includes(number)) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };
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
      
      <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {[...Array(4)].map((_, index) => (
          <TextInput key={index} value={selectedNumbers[index] ? selectedNumbers[index].toString() : ""} style={{
            width: 50, height: 50, backgroundColor: "#ff7e39",
            justifyContent: "center", alignItems: "center", margin: 5,
            borderRadius: 5, color: "#fff", fontSize: 20, fontWeight: "600"
          }} />
        ))}
      </SafeAreaView>
      <SafeAreaView style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <TouchableOpacity key={item} style={{
            width: 30, height: 30, backgroundColor: "#ff7e39",
            justifyContent: "center", alignItems: "center", margin: 5,
            borderRadius: 5
          }} onPress={() => handleNumberPress(item)}>
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "600" }}> {item} </Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
      
      <Button title="Show Modal" onPress={toggleModalVisibility} />
      <Modal animationType="slide"
        transparent visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}>
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <TextInput placeholder="Enter something..."
              value={inputValue} style={styles.textInput}
              onChangeText={(value) => setInputValue(value)} />

            {/** This button is responsible to close the modal */}
            <Button title="Close" onPress={toggleModalVisibility} />
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
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  }
});