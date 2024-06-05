import React, { useState, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert, TouchableOpacity, Modal, Dimensions } from "react-native";
import io from 'socket.io-client';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const { width } = Dimensions.get("window");

const socket = io('http://192.168.1.6:3000');

const Room = ({ navigation }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [secretNumber, setSecretNumber] = useState('');
  const [notification, setNotification] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [inputValue, setInputValue] = useState("");
  console.log("roomNumber", roomNumber);
  console.log("secretNumber", secretNumber);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);

  }

  useEffect(() => {
    socket.on('notification', (data) => {
      setNotification(data.message);
    });
    return () => {
      socket.off('notification');
    };
  }, []);

  const handleRoomJoined = (data) => {
    const roomId = data.room;
    if (!roomId) {
      Alert.alert("Phòng không tồn tại. Vui lòng kiểm tra lại số phòng!");
      return;
    }
    console.log("Joined room:", roomId);
    navigation.navigate('PlayOneToOne', { roomId, secretNumber, notification });
  };

  const handleUserJoined = (data) => {
    socket.on('userJoined', (data) => {
      setNotification(data.message);
    });

  };
  socket.on('userJoined', (data) => {
    setNotification(data.message);
  });

  useEffect(() => {
    if (isOwner) {
      socket.on('notification', (data) => {
        setNotification(data.message); // Hiển thị thông báo cho chủ phòng khi có người tham gia vào phòng
      });
      return () => {
        socket.off('notification'); // Hủy lắng nghe khi component unmount
      };
    }
  }, [isOwner]);

  useEffect(() => {
    socket.on('roomJoined', handleRoomJoined);
    socket.on('userJoined', handleUserJoined);

    return () => {
      // Hủy lắng nghe khi component unmount
      socket.off('roomJoined', handleRoomJoined);
      socket.off('userJoined', handleUserJoined);
    };
  }, [navigation, secretNumber, notification]);

  //   const createRoom = () => {
  //     if (!secretNumber) {
  //         Alert.alert("Vui lòng nhập số bí mật!");
  //         return;
  //     }
  //     console.log("Creating room...");
  //     socket.emit('createRoom', { secretNumber, isOwner: true }, (response) => {
  //         console.log("Room created:", response.room);
  //         setRoomNumber(response.room); // Lưu mã phòng vừa tạo
  //         Alert.alert(`Mã phòng: ${response.room}`);
  //         navigation.navigate('PlayOneToOne', { roomId: response.room, secretNumber, notification });
  //     });
  // };

  const createRoom = () => {
    if (!secretNumber) {
      Alert.alert("Vui lòng nhập số bí mật!");
      return;
    }
    console.log("Creating room...");
    socket.emit('createRoom', { secretNumber }, (response) => {
      console.log("Room created:", response.room);
      setRoomNumber(response.room); // Lưu mã phòng vừa tạo
      if (response.isOwner) {
        // Nếu người tạo phòng là chủ phòng, chuyển đến màn hình PlayOneToOne với thông tin là chủ phòng
        navigation.navigate('PlayOneToOne', { roomId: response.room, secretNumber, notification, isOwner: true });
      } else {
        // Nếu không phải chủ phòng, chuyển đến màn hình PlayOneToOne với thông tin không phải là chủ phòng
        navigation.navigate('PlayOneToOne', { roomId: response.room, secretNumber, notification, isOwner: false });
      }
    });
  };



  const joinRoom = () => {
    if (!roomNumber || !secretNumber) {
      Alert.alert("Vui lòng nhập số phòng và số bí mật!");
      return;
    }

    console.log("Joining room:", roomNumber);
    socket.emit('joinRoom', { roomNumber, secretNumber, notification }, (response) => {
      if (response.error) {
        Alert.alert(response.error);
      } else {
        console.log("Joined room:", response.room);
        navigation.navigate('PlayOneToOne', { roomId: response.room, secretNumber, notification });
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.cricle_back} onPress={() => handleBackHome()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.user_number}>
          <TextInput style={styles.input_search_room} placeholder="Search on game" />
          <Feather name="search" size={24} color="#ff4301" />
        </View>
        <TouchableOpacity
          onPress={toggleModalVisibility}
          style={{ backgroundColor: "#fff", borderRadius: 50, padding: 3, justifyContent: "center", alignItems: "center" }}>
          <AntDesign name="pluscircle" size={30} color="#ff4301" />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide"
        transparent visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}>
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 20, marginBottom: 10}}>Create room</Text>
            <TextInput placeholder="Enter room number" style={styles.input_create_room} onChangeText={setSecretNumber} />
            <TextInput placeholder="Enter your secret number" style={styles.input_create_room} onChangeText={setSecretNumber} />
            <View style={{ flexDirection: "row", width: '90%', justifyContent: "space-around", marginTop: 10 }}>
              <Button title="Close" onPress={toggleModalVisibility} />
              <Button title="Create room" onPress={createRoom} />
            </View>
          </View>
        </View>
      </Modal>


      {notification ? (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      ) : null}
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
  notificationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffeb3b',
    borderRadius: 5,
  },
  notificationText: {
    color: '#000',
    textAlign: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#5d7081",
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
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: "60%",
  },
  input_search_room: {
    marginRight: 10,
    width: "80%",
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
  input_create_room: {
    width: "80%",
    marginBottom: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ff4301",
  },
});

export default Room;
