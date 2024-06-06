import React, { useState, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import io from 'socket.io-client';

const socket = io('http://192.168.1.8:3000');

const Room = ({ navigation }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [secretNumber, setSecretNumber] = useState('');
  const [notification, setNotification] = useState("");
  const [isOwner, setIsOwner] = useState(false);

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
    setNotification(data.message);
  };

  useEffect(() => {
    if (isOwner) {
      socket.on('notification', (data) => {
        setNotification(data.message);
      });
      return () => {
        socket.off('notification');
      };
    }
  }, [isOwner]);

  useEffect(() => {
    socket.on('roomJoined', handleRoomJoined);
    socket.on('userJoined', handleUserJoined);

    return () => {
      socket.off('roomJoined', handleRoomJoined);
      socket.off('userJoined', handleUserJoined);
    };
  }, [navigation, secretNumber, notification]);

  const joinRoom = () => {
    if (!roomNumber || !secretNumber) {
      Alert.alert("Vui lòng nhập số phòng và số bí mật!");
      return;
    }
  
    console.log("Joining room:", roomNumber);
    socket.emit('joinRoom', { roomNumber, secretNumber }, (response) => {
      if (response.error) {
        Alert.alert(response.error);
      } else {
        console.log("Joined room:", response.room);
        navigation.navigate('PlayOneToOne', { roomId: response.room, secretNumber, notification });
      }
    });
  };
  
  const createRoom = async () => {
    console.log("Creating room...");
    try {
      const response = await fetch('http://192.168.1.8:8000/room/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ createdBy: '6659f3f1c138d8449c9fdd00' }) // Replace 'userId' with actual user ID
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Room created:", data);
        setRoomNumber(data._id); // Assuming data contains the room ID as _id
        setIsOwner(true);
        socket.emit('createRoom', { secretNumber, room: data._id }, (socketResponse) => {
          console.log("aaaaa", socketResponse);
          navigation.navigate('PlayOneToOne', { roomId: data._id, secretNumber, notification, isOwner: true });

          if (socketResponse.error) {
            Alert.alert(socketResponse.error);
          } else {
            console.log("Socket room created:", data._id);
          }
        });
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      Alert.alert("Error creating room");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập số phòng (chỉ khi tham gia phòng)"
        onChangeText={(text) => setRoomNumber(text)}
        value={roomNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập số bí mật"
        onChangeText={(text) => setSecretNumber(text)}
        value={secretNumber}
        secureTextEntry
      />
      <Button title="Tham gia" onPress={joinRoom} style={styles.button} />
      <Button title="Tạo phòng" onPress={createRoom} style={styles.button} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
});

export default Room;
