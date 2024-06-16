import React, { useState, useEffect, useRef } from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert, TouchableOpacity, Modal, Dimensions } from "react-native";
import io from 'socket.io-client';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
const { width } = Dimensions.get("window");
import {createRoomRoute, joinRoomRoute, getAllRoomRoute} from "../../../apiRouter/API";
import { useData } from "../../../HookToGetUserInfo/DataContext";

const Room = ({ navigation }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [secretNumber, setSecretNumber] = useState('');
  const [notification, setNotification] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isJoinRoomVisible, setJoinRoomVisible] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [roomNumberList, setRoomNumberList] = useState([]);
  const { userData } = useData();
  const { data } = userData;
  const id = data.user._id;


  const socket = useRef(null); // Sử dụng useRef để lưu trữ socket

  useEffect(() => {
    socket.current = io('http://192.168.1.8:3000'); // Khởi tạo socket khi component được mount

    // Hủy bỏ socket khi component unmount
    return () => {
      socket.current.disconnect();
    }
  }, []);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    setSecretNumber('');
  }

  const toggleJoinRoomVisibility = () => {
    setJoinRoomVisible(!isJoinRoomVisible);
  }

  

  const createRoom = async () => {
    if (!secretNumber) {
      Alert.alert("Vui lòng nhập số bí mật!");
      return;
    }
  
    try {
      const response = await axios.post(createRoomRoute, {
        createdBy: id,
        playerNumber: secretNumber,
      });
      const newRoom = response.data;
      Alert.alert('Room created successfully'); 
      socket.current.emit('create-room', {
        roomNumber: newRoom.roomNumber,
        secretNumber: secretNumber
      });
  
      toggleModalVisibility(); // Ẩn modal sau khi gửi thông điệ
      navigation.navigate('PlayOneToOne', { roomId: newRoom.roomNumber, secretNumber });
      
      // Cập nhật danh sách phòng
      getAllRoom();
    } catch (error) {
      console.error('Error creating room:', error);
      Alert.alert('Failed to create room. Please try again later.');
    }
  };
  


  

  const getAllRoom = async () => {
    try {
      const response = await axios.get(getAllRoomRoute);
      const data = response.data;
      setRoomList(data);
      setRoomNumberList(data.map(room => room.roomNumber));
    } catch (error) {
      console.error('Error getting all room:', error);
      Alert.alert('Failed to get all room. Please try again later.');
    }
  };

  const joinRoom = async () => {
    if (!roomNumber || !secretNumber) {
        Alert.alert("Vui lòng nhập số phòng và số bí mật!");
        return;
    }
    if (!roomNumberList.includes(roomNumber)) {
        Alert.alert("Phòng không tồn tại. Vui lòng kiểm tra lại số phòng!");
        return;
    }
    try {
        const response = await axios.post(joinRoomRoute, {
            roomNumber,
            userId: id,
            playerNumber: secretNumber,
        });
        const data = response.data;
        if (response.status === 200) {
            Alert.alert('Room joined successfully');

            // Lắng nghe thông điệp từ server khi tham gia phòng thành công
            socket.current.on('join-room', (data) => {
                if (data.room) {
                    // Đảm bảo rằng bạn đang điều hướng sau khi tham gia phòng thành công
                    console.log('join-room', data.room);
                }
            });
            // Gửi thông điệp tham gia phòng qua socket
            socket.current.emit('join-room', { roomNumber, secretNumber });
            navigation.navigate('PlayOneToOne', { roomId: roomNumber, secretNumber });
        } else {
            // Hiển thị thông điệp lỗi từ server
            Alert.alert(data.message || 'Failed to join room. Please try again later.');
        }
    } catch (error) {
        console.error('Error joining room:', error);
        if (error.response) {
            // Phản hồi từ server với mã lỗi và thông điệp cụ thể
            Alert.alert(`Error ${error.response.status}: ${error.response.data.message}`);
        } else {
            // Lỗi không phải từ phản hồi của server
            Alert.alert('Failed to join room. Please try again later.');
        }
    }
};
const handleCheckSecretNumber = (text) => {
  const newText = text.split("").filter((item, index) => text.indexOf(item) === index).join("");
  if (/^\d*$/.test(newText) && newText.length <= 4) {
    setSecretNumber(newText);
  }
};
  

  const handleBackHome = () => {
    navigation.goBack();
  };

  useEffect(() => {
    getAllRoom();
  }, [roomList]);
  useEffect(() => {
    setRoomNumberList(roomList.map(room => room.roomNumber));
  }, [roomList]);
  //create room
  useEffect(() => {
    socket.current.on('create-room', (data) => {
      console.log('create-room', data);
    });
  }, []);


  return (
    <View style={styles.container}>
      <StatusBar style="auto" hidden={false} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.cricle_back} onPress={handleBackHome}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.user_number}>
          <TextInput style={styles.input_search_room} placeholder="Search on game" />
          <TouchableOpacity onPress={toggleJoinRoomVisibility}>
            <Feather name="search" size={24} color="#ff4301" />
          </TouchableOpacity>
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
        onPress={toggleModalVisibility}>
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Create room</Text>
            <TextInput
              placeholder="Enter your secret number"
              style={styles.input_create_room}
              onChangeText={(text) => {handleCheckSecretNumber(text)}}
              value={secretNumber}
              maxLength={4}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: "row", width: '90%', justifyContent: "space-around", marginTop: 10 }}>
              <Button title="Close" onPress={toggleModalVisibility} />
              <Button title="Create room" onPress={createRoom} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide"
        transparent visible={isJoinRoomVisible}
        presentationStyle="overFullScreen"
        onPress={toggleJoinRoomVisibility}>
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Join room</Text>
            <TextInput placeholder="Enter room number" style={styles.input_create_room} onChangeText={setRoomNumber} value={roomNumber} 
              keyboardType="numeric" />
            <TextInput placeholder="Enter your secret number" style={styles.input_create_room} onChangeText={setSecretNumber} maxLength={4} value={secretNumber} keyboardType="numeric"/>
            <View style={{ flexDirection: "row", width: '90%', justifyContent: "space-around", marginTop: 10 }}>
              <Button title="Close" onPress={toggleJoinRoomVisibility} />
              <Button title="Join room" onPress={joinRoom} />
            </View>
          </View>
        </View>
      </Modal>

      {notification ? (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      ) : null}

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
