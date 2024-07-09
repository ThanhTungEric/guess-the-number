import React, { useState } from "react";
import { Text, TouchableOpacity, View, BackHandler, Alert } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
export default function Instructions({toggleModal, handleShowInstructions}) {
    // volume status
    const [volumeStatus, setVolumeStatus] = useState(true);
    const handleVolume = () => {
        setVolumeStatus(!volumeStatus);
    }
    //exit
    const  backPressed = () => {
        Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }

    //handle game rules
    const handleGameRules = () => {
        toggleModal();
        handleShowInstructions();
    }

    return (
        <View style={{ width: 150, height: 180, backgroundColor: "#fff", position: "absolute", top: 57, left: 230, zIndex: 1000, borderRadius: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
            <View style={{
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderTopWidth: 20,
                borderRightWidth: 20,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
                borderTopColor: "#fff",
                borderRightColor: "transparent",
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                position: "absolute",
                top: -10,
                right: 13,
                transform: [{ rotate: "45deg" }]
            }} />
            <View style={{ paddingHorizontal: 5, paddingVertical: 8, height: "100%", justifyContent: "center" }}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 5, justifyContent: "space-between", height: "30%" }} onPress={handleVolume}>
                    {volumeStatus ? <FontAwesome5 name="volume-down" size={28} color="#747570" /> : <FontAwesome5 name="volume-mute" size={28} color="#747570" />}
                    <Text style={{ fontSize: 17, color: "#747570", fontWeight: "500" }}>Âm lượng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 5, justifyContent: "space-between", height: "30%", borderBottomWidth: 0.3, borderTopWidth: 0.3, borderColor: "#747570" }} onPress={handleGameRules}>
                    <MaterialCommunityIcons name="file-document" size={28} color="#747570" />
                    <Text style={{ fontSize: 17, color: "#747570", fontWeight: "500" }}>Luật chơi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 5, justifyContent: "space-between", height: "30%" }} onPress={backPressed}>
                    <Ionicons name="exit-outline" size={28} color="#747570" />
                    <Text style={{ fontSize: 17, color: "#747570", fontWeight: "500" }}>Thoát</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}