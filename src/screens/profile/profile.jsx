import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
//import component
import Name from "./friend/name";
import CollectReward from "../component/collect-reward";

import MainFriend from "./friend/mainFriend";

function Profile() {
  return (
    <View style={styles.container}>
      <Name />
      <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
        <View style={styles.header_home}>
          <MainFriend />
        </View>
        <View style={styles.container_body}>
          <CollectReward />
        </View>
      </ScrollView>
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