import { Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { Calendar } from 'react-native-calendars';
import { attendanceRoute, getUserByIdRoute, getMissionRoute, doneMissionRoute } from '../../apiRouter/API';
import { useData } from '../../HookToGetUserInfo/DataContext';

export default function CollectReward() {
    const { userData } = useData();
    const { data } = userData;
    const [user, setUser] = useState();
    const [gamesPerDay, setGamesPerDay] = useState([]);
    const [winsPerDay, setWinsPerDay] = useState([]);
    const now = new Date();
    const [isCalendarVisible, setCalendarVisibility] = useState(false);

    const nowFormat = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const id = data.user._id;
    const [markedDates, setMarkedDates] = useState({});

    const [missions, setMissions] = useState([]);
    const [dailyMissions, setDailyMissions] = useState([]);
    console.log(dailyMissions, "dailyMissions");

    const ATTENDANCE_MISSION = { _id: 'attendance', description: 'Điểm danh', points: 10, title: 'attendance' };

    // Helper function to select random missions
    const selectRandomMissions = (missionsList) => {
        const shuffledMissions = missionsList.sort(() => Math.random() - 0.5);
        return shuffledMissions.slice(0, 2);
    };

    useEffect(() => {
        const getStoredDailyMissions = async () => {
            try {
                const storedMissions = await AsyncStorage.getItem(`dailyMissions-${nowFormat}`);
                if (storedMissions) {
                    setDailyMissions(JSON.parse(storedMissions));
                } else if (missions.length > 0) {
                    const randomMissions = selectRandomMissions(missions);
                    const finalDailyMissions = [ATTENDANCE_MISSION, ...randomMissions];
                    setDailyMissions(finalDailyMissions);
                    await AsyncStorage.setItem(`dailyMissions-${nowFormat}`, JSON.stringify(finalDailyMissions));
                }
            } catch (error) {
                console.log("Error getting stored daily missions:", error);
            }
        };

        getStoredDailyMissions();
    }, [missions]);

    const loadCheckedInDates = async () => {
        const checkedInDates = await AsyncStorage.getItem('checkedInDates');
        if (checkedInDates) {
            const parsedDates = JSON.parse(checkedInDates);
            const markedDates = {};
            parsedDates.forEach(date => {
                markedDates[date] = { selected: true, marked: true, selectedColor: "#fc4e4f" };
            });
            setMarkedDates(markedDates);
        }
    };

    useEffect(() => {
        const fetchMissions = async () => {
            handleGetUserById();
            loadCheckedInDates();
        };
        fetchMissions();
    }, []);

    const missionDone = async (missionId, userId) => {
        try {
            const response = await axios.post(`${doneMissionRoute}`, {
                id: missionId,
                userId
            });

            if (response.status === 200) {
                const updatedMissions = dailyMissions.filter(mission => mission._id !== missionId);
                setDailyMissions(updatedMissions);
                await AsyncStorage.setItem(`dailyMissions-${nowFormat}`, JSON.stringify(updatedMissions));
            } else {
                console.error('Mission completion failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error completing mission:', error.response ? error.response.data : error.message);
        }
    };

    const handleAttendance = async (dateString) => {
        try {
            const response = await axios.put(`${attendanceRoute}/${id}`);
            if (response.status === 200) {
                await AsyncStorage.setItem('attendanceCompleted', 'true');
                setDailyMissions((prevMissions) => prevMissions.filter(mission => mission.title !== "attendance"));
                setMarkedDates(prev => ({
                    ...prev,
                    [dateString]: { selected: true, marked: true, selectedColor: "#fc4e4f" }
                }));
            } else {
                console.error('Attendance marking failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error marking attendance:', error.response ? error.response.data : error.message);
        }
    };

    const handleGetUserById = async () => {
        try {
            const response = await axios.get(`${getUserByIdRoute}/${id}`);
            setUser(response.data.user);
        } catch (error) {
            console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        }
    };

    const handleGetMission = async () => {
        try {
            const response = await axios.get(`${getMissionRoute}`);
            setMissions(response.data.missions);
        } catch (error) {
            console.error('Error fetching missions:', error.response ? error.response.data : error.message);
            setMissions([]);
        }
    };

    useEffect(() => {
        if (user) {
            setGamesPerDay(user.gamesPerDay || []);
            setWinsPerDay(user.winsPerDay || []);
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            await handleGetUserById();
            await handleGetMission();
        };
        fetchData();
    }, []);

    const showCalendar = () => {
        setCalendarVisibility(true);
    };

    const hideCalendar = () => {
        setCalendarVisibility(false);
    };

    const handleDayPress = (day) => {
        handleAttendance(day.dateString);
        hideCalendar();
    };

    const checkMissionCondition = (condition) => {
        const todayGames = gamesPerDay.find(item => item.date === nowFormat);
        const todayWins = winsPerDay.find(item => item.date === nowFormat);

        if (!condition) {
            return true;
        }
        if (condition.title === "game") {
            return todayGames && todayGames.count >= condition.condition;
        }
        if (condition.title === "win") {
            return todayWins && todayWins.count >= condition.condition;
        }
        return false;
    };

    const renderRewardItem = () => {
        if (!Array.isArray(dailyMissions)) {
            return null;
        }

        return (
            <View>
                {dailyMissions.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                        if (item.title === 'attendance') {
                            showCalendar();
                        } else {
                            missionDone(item._id, id);
                        }
                    }}>
                        <View style={styles.missionContainer}>
                            <Text style={styles.missionText}>{item.description}</Text>
                            <View style={styles.rewardContainer}>
                                {checkMissionCondition(item) ? (
                                    <AntDesign name="heart" size={24} color="#fc4e4f" />
                                ) : (
                                    <Feather name="heart" size={24} color="#fc4e4f" />
                                )}
                                <Text style={styles.rewardText}>+ {item.points}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

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
    };

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
                            markedDates={markedDates}
                            disableAllTouchEventsForDisabledDays
                            disabledByDefault
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#fc4e4f',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});