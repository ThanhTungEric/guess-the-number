import React from "react";
import { Text, View, StyleSheet} from "react-native";

function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Setting</Text>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  }
});