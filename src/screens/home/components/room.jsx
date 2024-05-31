import React, { useState, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import io from 'socket.io-client';

const socket = io('http://192.168.1.6:3000');

const Room = ({ navigation }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [secretNumber, setSecretNumber] = useState('');
  const [notification, setNotification] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  console.log("roomNumber", roomNumber);
  console.log("secretNumber", secretNumber);

  useEffect(() => {
    socket.on('notification', (data) => {
      setNotification(data.message);
    });
    
    return () => {
      // Hủy lắng nghe khi component unmount
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
      setNotification(data.message); // Hiển thị thông báo khi có người tham gia vào phòng
  });
    //setNotification(data.message);
    // setTimeout(() => setNotification(""), 3000);
  
  };
  socket.on('userJoined', (data) => {
    setNotification(data.message); // Hiển thị thông báo khi có người tham gia vào phòng
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
