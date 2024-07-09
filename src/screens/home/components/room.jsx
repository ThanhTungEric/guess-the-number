import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import io from 'socket.io-client';
import { createRoomRoute, deleteAllRoomRoute, getAllRoomRoute, joinRoomRoute,host } from "../../../apiRouter/API";
import { useData } from "../../../HookToGetUserInfo/DataContext";
const { width } = Dimensions.get("window");
import { useTranslation } from 'react-i18next';


const Room = ({ navigation }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [secretNumber, setSecretNumber] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isJoinVisible, setJoinVisible] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [roomNumberList, setRoomNumberList] = useState([]);
  const { userData } = useData();
  const { data } = userData;
  const id = data.user._id;
  const [dataUser, setDataUser] = useState({});
  const socket = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    socket.current = io(`${host}`);
    return () => {
      socket.current.disconnect();
    }
  }, []);
  useEffect(() => {
    getAllRoom();
  }, []);

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    setSecretNumber('');
  };

  const toggleSearchRoomVisibility = () => {
    setSearchVisible(!isSearchVisible);
  };

  const toggleJoinRoomVisibility = (roomNumber) => {
    setJoinVisible(true);
    setRoomNumber(roomNumber); // Lưu roomNumber vào state để sử dụng khi nhấn nút "Join"
  };

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
  
      // Add new room to roomList
      setRoomList(prevRoomList => [...prevRoomList, newRoom]);
  
      toggleModalVisibility();
      navigation.navigate('PlayOneToOne', { roomId: newRoom.roomNumber, secretNumber });
    } catch (error) {
      console.error('Error creating room:', error);
      Alert.alert('Failed to create room. Please try again later.');
    }
  };
  
  // useEffect(() => {
  //   createRoom();
  //   getAllRoom();

  // }, [createRoom]);

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


  const joinSearcRoom = async () => {
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

        socket.current.on('join-room', (data) => {
          if (data.room) {
            console.log('join-room', data.room);
          }
        });

        socket.current.emit('join-room', { roomNumber, secretNumber });
        navigation.navigate('PlayOneToOne', { roomId: roomNumber, secretNumber });
      } else {
        Alert.alert(data.message || 'Failed to join room. Please try again later.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      if (error.response) {
        Alert.alert(`Error ${error.response.status}: ${error.response.data.message}`);
      } else {
        Alert.alert('Failed to join room. Please try again later.');
      }
    }
  };
    const joinRoom = async () => {
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
      const responseData = response.data;
      if (response.status === 200) {
        Alert.alert('Room joined successfully');
        socket.current.emit('join-room', { roomNumber, secretNumber });
        navigation.navigate('PlayOneToOne', { roomId: roomNumber, secretNumber });
      } else {
        Alert.alert(responseData.message || 'Failed to join room. Please try again later.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      if (error.response) {
        Alert.alert(`Error ${error.response.status}: ${error.response.data.message}`);
      } else {
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
    setRoomNumberList(roomList.map(room => room.roomNumber));
  }, [roomList]);

  useEffect(() => {
    socket.current.on('create-room', (data) => {
      console.log('create-room', data);
    });
  }, []);
  const renderItem = ({ item }) => (
    <View style={styles.roomCard}>
      <Text style={styles.roomNumber}>{t('number room')}: {item.roomNumber}</Text>
      <Text style={styles.roomCardText}>{t('number of players')}: {item.players.length}</Text>
      <Text style={styles.roomCardText}>{t('room status')}: {item.gameStatus}</Text>
      {
        item.gameStatus === 'waiting' && (
          <TouchableOpacity style={styles.joinButton} onPress={() => toggleJoinRoomVisibility(item.roomNumber)}>
            <Text style={styles.joinButtonText}>{t('join')}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
  useEffect(() => {
    socket.current.on('create-room', (data) => {
      console.log('create-room', data);
      renderRoomList();
      renderItem();
    });
  }, [roomList]);

  // API delete all room theo id người tạo
  const deleteAllRoom = async () => {
    try {
      const response = await axios.delete(`${deleteAllRoomRoute}/${id}`, {
        params: {
          createdBy: id,
        },
      });
      const data = response.data;
      if (response.status === 200) {
        getAllRoom();
      } 
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        console.error('Error delete all room:', error);
      }
    }
  };
  useEffect(() => {
    deleteAllRoom();
  }, []);


  return (
    <View style={styles.container}>
      <StatusBar style={styles.status} hidden={false} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleBack} onPress={handleBackHome}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.userNumber}>
          <TextInput style={styles.inputSearchRoom} placeholder="Search on game" />
          <TouchableOpacity onPress={toggleSearchRoomVisibility}>
            <Feather name="search" size={24} color="#ff4301" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleModalVisibility} style={styles.addRoomButton}>
          <AntDesign name="pluscircle" size={30} color="#ff4301" />
        </TouchableOpacity>
      </View>
      <Text style={styles.roomListHeader}>{t('room list')}</Text>
      <FlatList
        style={styles.roomListContainer}
        data={roomList}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      {/* Modal create room */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onRequestClose={toggleModalVisibility}
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{t('create room')}</Text>
            <TextInput
              placeholder="Enter your secret number"
              style={styles.inputCreateRoom}
              onChangeText={handleCheckSecretNumber}
              value={secretNumber}
              maxLength={4}
              keyboardType="numeric"
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Close" onPress={toggleModalVisibility} />
              <Button title="Create room" onPress={createRoom} />
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal search room */}
      <Modal
        animationType="slide"
        transparent
        visible={isSearchVisible}
        presentationStyle="overFullScreen"
        onRequestClose={toggleSearchRoomVisibility}
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{t('join')}</Text>
            <TextInput
              placeholder="Enter room number"
              style={styles.inputCreateRoom}
              onChangeText={setRoomNumber}
              value={roomNumber}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Enter your secret number"
              style={styles.inputCreateRoom}
              onChangeText={setSecretNumber}
              maxLength={4}
              value={secretNumber}
              keyboardType="numeric"
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Close" onPress={toggleSearchRoomVisibility} />
              <Button title="Join room" onPress={joinSearcRoom} />
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal join room */}
      <Modal
  animationType="slide"
  transparent
  visible={isJoinVisible}
  presentationStyle="overFullScreen"
  onRequestClose={() => setJoinVisible(false)} // Updated this line
>
  <View style={styles.viewWrapper}>
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Join room</Text>
      <Text style={styles.roomNumber}>{t('room number')}: {roomNumber}</Text>
      <TextInput
        placeholder="Enter your secret number"
        style={styles.inputCreateRoom}
        onChangeText={handleCheckSecretNumber}
        value={secretNumber}
        maxLength={4}
        keyboardType="numeric"
      />
      <View style={styles.modalButtonContainer}>
        <Button title="Close" onPress={() => setJoinVisible(false)} /> 
        <Button title="Join room" onPress={joinRoom} />
      </View>
    </View>
  </View>
</Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f6",
    padding: 10,
  },
  status: {
    backgroundColor: "#fed034",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#5d7081",
    borderRadius: 10,
    marginBottom: 10,
  },
  circleBack: {
    backgroundColor: "#04c677",
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  userNumber: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: "60%",
  },
  inputSearchRoom: {
    marginRight: 10,
    width: "80%",
  },
  addRoomButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  roomListHeader: {
    color: "#000",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  roomCard: {
    backgroundColor: "#34495e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  roomCardText: {
    color: "#fff",
    fontSize: 18,
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
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 270,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  inputCreateRoom: {
    width: "80%",
    marginBottom: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ff4301",
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: '90%',
    justifyContent: "space-around",
    marginTop: 10,
  },
  roomListContainer: {
    marginTop: 10,
  },
  list: {
    paddingHorizontal: 10,
  },
  roomCard: {
    backgroundColor: "#fed034",
    borderWidth: 5,
    borderColor: "#ffbe2e",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10,
    flex: 1,
  },
  roomNumber: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  roomCardText: {
    color: "#fe841d",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  joinButton: {
    backgroundColor: "#04c977",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Room;
