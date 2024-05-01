import React from "react";
import { Text, View, StyleSheet, SectionList } from "react-native";

function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  }
});