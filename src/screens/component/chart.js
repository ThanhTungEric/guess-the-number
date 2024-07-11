import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserRoute } from '../../apiRouter/API';
import bg from './img/bg.jpg';
import top1 from './img/top1.jpg';
import top2 from './img/top2.jpg';
import top3 from './img/top3.jpg';


const Chart = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const top = [top1, top2, top3];
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchUsers();
        startGlowAnimation();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(getUserRoute);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            data.sort((a, b) => b.point - a.point);
            const trophyIcons = ['trophy', 'trophy', 'trophy'];
            const top1TrophyIcon = 'star';
            const topUsers = data.slice(0, 10).map((user, index) => ({
                ...user,
                trophyIcon: index === 0 ? top1TrophyIcon : trophyIcons[index],
            }));
            setUsers(topUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const startGlowAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    };

    const renderIcon = (index) => {
        const iconList = [];
        if (index === 0) {
            for (let i = 0; i < 5; i++) {
                iconList.push(<Icon key={i} name="trophy" size={24} color="#FFD700" style={styles.trophyIcon} />);
            }
        } else if (index === 1) {
            for (let i = 0; i < 5; i++) {
                iconList.push(<Icon key={i} name="trophy" size={24} color={i === 4 ? '#C0C0C0' : '#FFD700'} style={styles.trophyIcon} />);
            }
        } else if (index === 2) {
            for (let i = 0; i < 5; i++) {
                iconList.push(<Icon key={i} name="trophy" size={24} color={i < 3 ? '#FFD700' : '#C0C0C0'} style={styles.trophyIcon} />);
            }
        }
        return <View style={styles.iconContainer}>{iconList}</View>;
    };

    const glowColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFFFFF', '#FFD700'],
    });
    const handleBackHome = () => {
        navigation.goBack();
    }

    return (
        <ImageBackground source={bg} style={styles.backgroundImage}>
            <TouchableOpacity style={styles.circleBack} onPress={handleBackHome}>
                <Ionicons name="chevron-back" size={30} color="#FFD700" />
            </TouchableOpacity>
            <ScrollView>
                <View style={styles.container}>
                    <Animated.Text style={[styles.title, { textShadowColor: glowColor }]}>Top Users</Animated.Text>
                    <View style={styles.userList}>
                        {users.map((user, index) => (
                            <View key={index} style={styles.userItem}>
                                <View style={styles.userInfo}>
                                    {index < 3 ? (
                                        <Image source={top[index]} style={styles.userImage} />
                                    ) : (
                                        <Text style={styles.rank}>{index + 1}</Text>
                                    )}
                                    <View style={styles.userText}>
                                        <Text style={styles.username}>{user.username}</Text>
                                        <Text style={styles.points}>{user.point} points</Text>
                                    </View>
                                </View>
                                {renderIcon(index)}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    circleBack: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(44, 44, 44, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFD700',
        textTransform: 'uppercase',
        textShadowRadius: 20,
        textShadowOffset: { width: 0, height: 0 },
    },
    userList: {
        width: '100%',
        marginTop: 10,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(44, 44, 44, 0.8)', // Màu nền với độ mờ
        marginBottom: 12,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: '#FFD700',
    },

    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    rank: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginRight: 15,
        width: 60,
        height: 60,
        textAlign: 'center',
        lineHeight: 60,
        borderRadius: 30,
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    userText: {
        flexDirection: 'column',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    points: {
        fontSize: 16,
        color: '#FFD700',
    },
    trophyIcon: {
        marginLeft: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Chart;
