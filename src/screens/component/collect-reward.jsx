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
                        <View key={index} style={{ flexDirection: 'row', borderColor: "#ffbe2e", borderWidth: 1, borderRadius: 10, marginTop: 8, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10, height: 45, backgroundColor: "#fed034" }}>
                            <Text style={{fontSize: 16, color: "#fff"}}>{item.missionName}</Text>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Feather name="heart" size={24} color="#fc4e4f" />
                                <Text style={{fontSize: 16, marginLeft: 8}}>+ {item.reward}</Text>
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