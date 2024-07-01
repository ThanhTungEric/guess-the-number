import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { attendanceRoute, getUserByIdRoute, missionsUserRoute } from '../../apiRouter/API';
import { useData } from '../../HookToGetUserInfo/DataContext';

const rewardData = [
    { missionName: "Điểm danh", reward: 1, experience: 10 },
    { missionName: "Chiến thắng 3 trận", reward: 3, experience: 30, condition: { type: "wins", count: 0 } },
    { missionName: "Chơi 10 trận", reward: 5, experience: 50, condition: { type: "wins", count: 0 } },
    { missionName: "Chơi với 5 người bạn", reward: 4, experience: 40, condition: { type: "games", count: 0 } },
    { missionName: "Chiến thắng 10 trận", reward: 8, experience: 80, condition: { type: "wins", count: 0 } },
];

const getRandomDailyMissions = async () => {
    const dailyMissions = [rewardData[0]]; 
    const otherMissions = rewardData.slice(1);
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const random = (seed) => {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    for (let i = otherMissions.length - 1; i > 0; i--) {
        const j = Math.floor(random(seed + i) * (i + 1));
        [otherMissions[i], otherMissions[j]] = [otherMissions[j], otherMissions[i]];
    }
    const numberOfMissions = 2;
    dailyMissions.push(...otherMissions.slice(0, numberOfMissions));

    const lastCheckedDate = await AsyncStorage.getItem('lastCheckedDate');
    const attendanceStatus = await AsyncStorage.getItem('attendanceCompleted');
    
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (lastCheckedDate !== formattedToday) {
        await AsyncStorage.setItem('lastCheckedDate', formattedToday);
        await AsyncStorage.setItem('attendanceCompleted', 'false');
    }

    if (attendanceStatus === 'true') {
        return dailyMissions.filter(mission => mission.missionName !== "Điểm danh");
    }

    const userMissionsStatus = await AsyncStorage.getItem('userMissions');
    if (userMissionsStatus === 'true') {
        const userMissions = JSON.parse(userMissionsStatus);
        const missionNames = userMissions.map(user => user.missionName);
        return dailyMissions.filter(mission => !missionNames.includes(mission.missionName));
    }

    return dailyMissions;
}


export default function CollectReward() {
    const [dailyMissions, setDailyMissions] = useState([]);
    const [isCalendarVisible, setCalendarVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const { userData } = useData();
    const { data } = userData;
    const [user, setUser] = useState();
    const [userMissions, setUserMissions] = useState([]);
    const [gamesPerDay, setGamesPerDay] = useState([]);
    const [winsPerDay, setWinsPerDay] = useState([]);
    const now = new Date(); 
    const nowFormat = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const id = data.user._id;

    const handleAttendance = async () => {
        try {
            await axios.put(`${attendanceRoute}/${id}`);
            await AsyncStorage.setItem('attendanceCompleted', 'true');
            setDailyMissions((prevMissions) => prevMissions.filter(mission => mission.missionName !== "Điểm danh"));
        } catch (error) {
            console.log(error);
        }
    }
    

    const handleMissionsUser = async (missionName) => {
        try {
            const expectedMissionNames = ["Chiến thắng 3 trận", "Chơi 10 trận", "Chơi với 5 người bạn", "Chiến thắng 10 trận"];
            if (!expectedMissionNames.includes(missionName)) {
                return;
            }
    
            const response = await axios.put(`${missionsUserRoute}/${id}`, { missionName });
            setUserMissions(prev => [...prev, response.data.user]);

            // Update AsyncStorage with the completed mission
            const completedMissions = await AsyncStorage.getItem("completedMissions");
            const updatedCompletedMissions = completedMissions ? JSON.parse(completedMissions) : [];
            updatedCompletedMissions.push(missionName);
            await AsyncStorage.setItem("completedMissions", JSON.stringify(updatedCompletedMissions));

            // Update daily missions to remove the completed mission
            setDailyMissions((prev) => prev.filter((mission) => mission.missionName !== missionName));
        } catch (error) {
            if (error.response) {
                console.error("Error details:", error.response.data);
            } else {
                console.error("Error message:", error.message);
            }
        }
    };

    const handleGetUserById = async () => {
        try {
            const rs = await axios.get(`${getUserByIdRoute}/${id}`);
            setUser(rs.data.user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            setGamesPerDay(user.gamesPerDay || []);
            setWinsPerDay(user.winsPerDay || []);
        }
    }, [user]);

    useEffect(() => {
        const fetchMissions = async () => {
            const missions = await getRandomDailyMissions();
            setDailyMissions(missions);
            handleGetUserById();
        };
        fetchMissions();
    }, []);
    

    useEffect(() => {
        const fetchMissions = async () => {
            const missions = await getRandomDailyMissions();
            setDailyMissions(missions);
            handleGetUserById();
        };
        fetchMissions();
    }, [nowFormat]);

    const showCalendar = () => {
        setCalendarVisibility(true);
    };

    const hideCalendar = () => {
        setCalendarVisibility(false);
    };

    const handleDayPress = (day) => {
        console.log("Ngày đã chọn: ", day.dateString);
        setSelectedDate(day.dateString);
        handleAttendance();
    };

    const missionPress = (missionName) => {
        if (missionName === "Điểm danh") {
            showCalendar();
        } else {
            if (checkMissionCondition(rewardData.find(mission => mission.missionName === missionName).condition)) {
                handleMissionsUser(missionName);
            }
        }
    };

    const checkMissionCondition = (condition) => {
        const todayGames = gamesPerDay.find(item => item.date === nowFormat);
        const todayWins = winsPerDay.find(item => item.date === nowFormat);
    
        if (!condition) {
            return true;
        }
        if (condition.type === "games") {
            return todayGames && todayGames.count >= condition.count;
        }
        if (condition.type === "wins") {
            return todayWins && todayWins.count >= condition.count;
        }
        return false;
    };

    const renderRewardItem = () => {
        return (
            <View>
                {dailyMissions.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => missionPress(item.missionName)}>
                        <View style={styles.missionContainer}>
                            <Text style={styles.missionText}>{item.missionName}</Text>
                            <View style={styles.rewardContainer}>
                                {checkMissionCondition(item.condition) ? (
                                    <AntDesign name="heart" size={24} color="#fc4e4f" />
                                ) : (
                                    <Feather name="heart" size={24} color="#fc4e4f" />
                                )}
                                <Text style={styles.rewardText}>+ {item.reward}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    const renderGamesAndWinsPerDay = () => {
        const todayGames = gamesPerDay.filter(item => item.date === nowFormat);
        const todayWins = winsPerDay.filter(item => item.date === nowFormat);
    
        return (
            <View style={styles.statsContainer}>
                <View style={styles.statSection}>
                    <Text style={styles.statsTitle}>Games Per Day</Text>
                    {todayGames.length > 0 ? todayGames.map((item, index) => (
                        <View key={index} style={styles.statItem}>
                            <Text style={styles.statDate}>{item.date}</Text>
                            <Text style={styles.statCount}>{item.count}</Text>
                        </View>
                    )) : <Text style={styles.noDataText}>No data</Text>}
                </View>
                <View style={styles.statSection}>
                    <Text style={styles.statsTitle}>Wins Per Day</Text>
                    {todayWins.length > 0 ? todayWins.map((item, index) => (
                        <View key={index} style={styles.statItem}>
                            <Text style={styles.statDate}>{item.date}</Text>
                            <Text style={styles.statCount}>{item.count}</Text>
                        </View>
                    )) : <Text style={styles.noDataText}>No data</Text>}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nhận thưởng ngay</Text>
            {renderRewardItem()}
            {renderGamesAndWinsPerDay()}
            <Modal visible={isCalendarVisible} transparent={true} animationType="slide" onRequestClose={hideCalendar}>
                <View style={styles.modalContainer}>
                    <View style={styles.calendarContainer}>
                        <Calendar
                            onDayPress={handleDayPress}
                            markedDates={{[selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: "#fc4e4f" }}}
                            disableAllTouchEventsForDisabledDays disabledByDefault
                        />
                        <TouchableOpacity onPress={hideCalendar} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );    
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#262c32",
    },
    missionContainer: {
        flexDirection: 'row',
        borderColor: "#ffbe2e",
        borderWidth: 3,
        borderRadius: 10,
        marginTop: 8,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        height: 45,
        backgroundColor: "#fed034",
    },
    missionText: {
        fontSize: 16,
        color: "#fff",
    },
    rewardContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rewardText: {
        fontSize: 16,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    calendarContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        margin: 20,
    },
    closeButton: {
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    closeButtonText: {
        fontSize: 16,
        color: "#007bff",
    },
    statsContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f4f4f4',
        borderRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    statSection: {
        marginBottom: 20,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
    },
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    statDate: {
        fontSize: 16,
        color: '#666',
    },
    statCount: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        paddingVertical: 20,
    },
});
