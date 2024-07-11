import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Image, ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import logo from '../../../image/guessnumber-removebg.png';
import background from '../../../image/xchJnRzvQW-min.png';
import { createUserRoute } from '../../apiRouter/API';
import { useData } from '../../HookToGetUserInfo/DataContext';
import EN from './img/Anh.png';
import VN from './img/VN.png';


const Login = () => {
    const [scaleValue] = useState(new Animated.Value(1));
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();
    const { updateUserData } = useData();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { i18n } = useTranslation();
    const { t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const login = async () => {
        try {
            const response = await fetch(createUserRoute, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: name, password: password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            alert('Login successful');
            updateUserData({ data });
            navigation.navigate('BottomTabNavigator', { data });

        } catch (error) {
            console.error('There was an error with the login request:', error);
            setErrorMessage('Login failed. Please try again.');
        }
    };

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 10,
            useNativeDriver: true,
        }).start();
        setErrorMessage('');
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
        login();
    };

    const toggleModalVisibility = () => {
        setIsModalVisible(!isModalVisible);
        setErrorMessage('');
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={background} style={styles.background}>
                <StatusBar style="auto" />
                <Image source={logo} style={styles.logo} />
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>win</Text>
                        <Text style={[styles.title, styles.titleWhite]}>by fun</Text>
                    </View>
                    <Text style={styles.subtitle}>Play unlimited games and win prizes</Text>
                </View>
                <TouchableOpacity style={styles.getStartedButton} onPress={toggleModalVisibility} activeOpacity={0.8}>
                    <LinearGradient colors={['#22bb91', '#1aa079']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.getStartedButtonBackground}>
                        <Text style={styles.getStartedButtonText}>Get started</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.languageContainer}>
                    <TouchableOpacity style={styles.languageButton} onPress={() => changeLanguage('en')}>
                        <Image source={EN} style={styles.languageLogo} />
                        <Text style={styles.languageText}>English</Text>
                    </TouchableOpacity>
                    <Text style={styles.separator}> | </Text>
                    <TouchableOpacity style={styles.languageButton} onPress={() => changeLanguage('vi')}>
                        <Image source={VN} style={styles.languageLogo} />
                        <Text style={styles.languageText}>Tiếng Việt</Text>
                    </TouchableOpacity>
                </View>

                <Modal animationType="slide" transparent visible={isModalVisible} presentationStyle="overFullScreen" onRequestClose={toggleModalVisibility}>
                    {/* <Modal animationType="slide" transparent visible={isModalVisible} onRequestClose={toggleModalVisibility}> */}
                    <View style={styles.modalWrapper}>
                        <View style={styles.modalView}>
                            <TextInput style={styles.input} placeholder={t('enter your name')} value={name} onChangeText={setName} />
                            <TextInput style={styles.input} placeholder={t('enter your password')} value={password} onChangeText={setPassword} />

                            {errorMessage ? (<Text style={styles.errorText}>{errorMessage}</Text>) : null}
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity onPress={toggleModalVisibility} style={styles.cancelButton}>
                                    <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleLogin} onPressIn={handlePressIn} onPressOut={handlePressOut} style={[styles.playButton, animatedStyle]}>
                                    <Text style={styles.playButtonText}>{t('play')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* </Modal> */}
                </Modal>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        width: "100%",
        height: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    logo: {
        width: 200,
        height: 200,
    },
    header: {
        height: "20%",
        width: "100%",
        marginTop: 20,
        paddingLeft: 20,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: 'center',
    },
    title: {
        fontSize: 50,
        color: "#23c393",
        fontWeight: "bold",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        paddingRight: 5,
    },
    titleWhite: {
        color: "#fff",
        fontSize: 50,
        fontWeight: "bold",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,

    },
    subtitle: {
        fontSize: 20,
        color: "#fff",
        marginTop: 10,
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    getStartedButton: {
        width: "80%",
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#22bb91', // Fallback color
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    getStartedButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "900",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    languageLogo: {
        width: 24,
        height: 24,
        marginRight: 5,
    },
    languageText: {
        color: '#fff',
    },
    separator: {
        color: '#fff',
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#d85762',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    playButton: {
        backgroundColor: '#22BB91',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    playButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Login;
