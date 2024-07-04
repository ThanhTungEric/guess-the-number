import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StatusBar } from 'expo-status-bar';
//import component
import UserInfor from '../component/user-infor'
import CollectReward from "../component/collect-reward";

import MainFriend from "./friend/mainFriend";

function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.header_home}>
        <MainFriend />
      </View>
      <View style={styles.container_body}>
        <CollectReward />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  header_home: {
    width: "100%",
    alignItems: "center",
  },
  container_body: {
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});