import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, Image, Modal, Dimensions, ImageBackground } from 'react-native';
import { createUserRoute, getUserByNameRoute } from '../../apiRouter/API';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import logo from '../../../image/guessnumber-removebg.png';
import backgroud from '../../../image/xchJnRzvQW-min.png';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { createUserRoute } from '../../apiRouter/API';
import { useData } from '../../HookToGetUserInfo/DataContext';

const { width } = Dimensions.get("window");

const Login = () => {
    const [scaleValue] = useState(new Animated.Value(1));
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();
    const { updateUserData } = useData(); // Lấy dữ liệu từ context
    const [isModalVisible, setIsModalVisible] = useState(false);
    //get user from async storage

    const [userDataLocal, setUserDataLocal] = useState(null);

    useEffect(() => {
        const checkUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('@user_data');
                setUserDataLocal(userData);
                if (userData !== null) {
                    const data = JSON.parse(userData);
                    updateUserData({ data: data });
                    navigation.navigate('BottomTabNavigator', { data: data });
                } else {
                    setIsModalVisible(true);
                }
            } catch (e) {
                console.error('Failed to load user data from AsyncStorage', e);
            }
        };

        checkUserData();
    }, []);

    const login = async () => {
        try {
            const response = await fetch(`${createUserRoute}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: name }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            alert('Login successful');
            await AsyncStorage.setItem('@user_data', JSON.stringify(data));
            updateUserData({ data: data });
            navigation.navigate('BottomTabNavigator', { data: data });

        } catch (error) {
            console.error('There was an error with the login request:', error);
            setErrorMessage('Login failed. Please try again.');
        }
    };


    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const animatedStyle = {
        transform: [{ scale: scaleValue }],
    };

    const handleLogin = () => {
        if (!userDataLocal) {
            login();
        } else {
            getUserByName();
            navigation.navigate('BottomTabNavigator', { data: userDataLocal });
        }
    };
    const toggleModalVisibility = () => {
        setIsModalVisible(!isModalVisible);
    }
    return (
        <View style={styles.container}>
            {/* <ImageBackground source={backgroud} style={{ width: "100%", height: "100%", justifyContent: "space-around", alignItems: "center" }}> */}
            <StatusBar style="auto" />
            <Image source={logo} style={{ width: 200, height: 200 }} />
            <View style={{ height: "20%", width: "100%", marginTop: 20, paddingLeft: 20 }}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 50, color: "#23c393" }}>win </Text>
                    <Text style={{ fontSize: 50, color: "#fff" }}>by fun</Text>
                </View>
                <Text style={{ fontSize: 20, color: "#fff" }}>Play unlimited games and win prizes</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: "#22bb91", width: "80%", height: 45, borderRadius: 10, justifyContent: "center", alignItems: "center" }}
                onPress={toggleModalVisibility}>
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: "900" }}>Get started</Text>
            </TouchableOpacity>

            <Modal animationType="slide"
                transparent visible={isModalVisible}
                presentationStyle="overFullScreen"
                onPress={toggleModalVisibility}>
                <View style={styles.viewWrapper}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            value={name}
                            onChangeText={setName}
                        />

                        {errorMessage ? (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        ) : null}

                        <View style={{ flexDirection: 'row', width: "90%", justifyContent: "flex-end", paddingRight: 10 }}>
                            <TouchableOpacity onPress={toggleModalVisibility} style={{ backgroundColor: "#d85762", padding: 8, justifyContent: 'center', alignItems: "center", borderRadius: 10, width: 70 }}>
                                <Text style={{ color: "#fff", fontSize: 16 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLogin}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                style={{ backgroundColor: "#22BB91", padding: 8, justifyContent: 'center', alignItems: "center", borderRadius: 10, width: 70, marginLeft: 10 }}>
                                <Text style={{ fontSize: 17, color: '#fff', fontWeight: "700" }}>Play</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* </ImageBackground> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        width: '90%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 50,
        backgroundColor: '#fdd835',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
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
    }
});

export default Login;