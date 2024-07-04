import React from "react";
import { Text, View, Image } from "react-native";
import { useData } from "../../../HookToGetUserInfo/DataContext";
export default function Name() {
    const { userData } = useData();
    const { data } = userData;
    const avatar = data.user.avatar;
    return (
        <View style={{ width: '100%', paddingHorizontal: 10}}>
            <View style={{flexDirection: "row", width: "100%"}}>
                <View style={{width: 60, height: 60}}>
                    <Image source={{uri: avatar}} style={{width: 60, height: 60, borderRadius: 50}} />
                </View>
                <View style={{justifyContent: "center", marginLeft: 10, backgroundColor: "#fed034", flex: 1, paddingHorizontal: 10, borderRadius: 15}}>
                    <Text style={{fontSize: 18, fontWeight: "bold"}}>{data.user.username}</Text>
                    <Text style={{fontSize: 16}}>Viet Nam</Text>
                </View>
            </View>
        </View>
    );
}