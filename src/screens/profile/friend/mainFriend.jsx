import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Name from "./name";
import ListFriend from "./listFriend";
export default function MainFriend() {
    return (
        <View style={{ width: '100%'}}>
            <Name />
            <ListFriend />
        </View>
    );
}