import { Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { attendanceRoute, getUserByIdRoute, missionsUserRoute, getMissionRoute } from '../../apiRouter/API';
import { useData } from '../../HookToGetUserInfo/DataContext';

export default function CollectReward() {
    const { userData } = useData();
    const { data } = userData;
    const [user, setUser] = useState();
    const [gamesPerDay, setGamesPerDay] = useState([]);
    const [winsPerDay, setWinsPerDay] = useState([]);
    const now = new Date();
    const nowFormat = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const id = data.user._id;

    const [missions, setMissions] = useState([]);
    console.log(missions);

    //random mission with daily mission
    const [dailyMissions, setDailyMissions] = useState([]);
    const selectRandomMissions = (missionsList) => {
        const shuffledMissions = missionsList.sort(() => 0.5 - Math.random());
        return shuffledMissions.slice(0, 2);
    };
    useEffect(() => {
        if (missions.length > 0) {
            setDailyMissions(selectRandomMissions(missions));
        }
    }, [missions]);


    // API attendance
    const handleAttendance = async (dateString) => {
        try {
            await axios.put(`${attendanceRoute}/${id}`);
            await AsyncStorage.setItem('attendanceCompleted', 'true');
            setDailyMissions((prevMissions) => prevMissions.filter(mission => mission.missionName !== "Điểm danh"));
            setMarkedDates(prev => ({
                ...prev,
                [dateString]: { selected: true, marked: true, selectedColor: "#fc4e4f" }
            }));
        } catch (error) {
            console.log(error);
        }
    };

    // API user
    const handleGetUserById = async () => {
        try {
            const rs = await axios.get(`${getUserByIdRoute}/${id}`);
            setUser(rs.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    // API get missions
    const handleGetMission = async () => {
        try {
            const rs = await axios.get(`${getMissionRoute}`);
            setMissions(rs.data.missions);
        } catch (error) {
            console.log(error);
            setMissions([]); // Set missions to an empty array in case of error
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

    const checkMissionCondition = (mission) => {
        if (mission.title === 'win') {
            const todayWins = winsPerDay.filter(item => item.date === nowFormat);
            return todayWins.length >= mission.condition;
        } else if (mission.title === 'game') {
            const todayGames = gamesPerDay.filter(item => item.date === nowFormat);
            return todayGames.length >= mission.condition;
        }
        return false;
    };

    const renderRewardItem = () => {
        if (!Array.isArray(missions)) {
            return null;
        }

        return (
            <View>
                {dailyMissions.map((item, index) => (
                    <TouchableOpacity key={index}>
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
        </View>
    );
}

const styles= StyleSheet.create({
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
});
