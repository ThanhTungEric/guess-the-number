import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
const rewardData = [
    {
        missionName: "Đăng nhập",
        reward: 1,
        experience: 10,
    },
    {
        missionName: "Mời bạn bè",
        reward: 2,
        experience: 20,
    },
    {
        missionName: "Chơi 5 trận với người chơi khác",
        reward: 3,
        experience: 30,
    }
];

export default function CollectReward() {
    const rewardItem = () => {
        return (
            <View>
                {rewardData.map((item, index) => {
                    return (
                        <View key={index} style={{ flexDirection: 'row', borderColor: "#3a3a3a", borderWidth: 1, borderRadius: 10, marginTop: 8 }}>
                            <Text>{item.missionName}</Text>
                            <View style={{backgroundColor: "#5d7081", width: 30, height: 30}}>
                                <Feather name="heart" size={24} color="#fc4e4f" />
                                <Text>{item.reward}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#262c32" }}>Nhận thưởng ngay</Text>
            {rewardItem()}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 15
    },
});