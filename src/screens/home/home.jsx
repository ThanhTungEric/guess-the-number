import React from "react";
import { Text, View, StyleSheet } from "react-native";
//icon
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header_home}>
        <View style={styles.header_home_item}>
          <MaterialCommunityIcons name="crown-outline" size={24} color="#ff861d" />
          <Text style={styles.header_home_item_text}> 852 </Text>
          <Entypo name="circle-with-plus" size={24} color="#01d48b" />
        </View>
      </View>
      <Text>Home</Text>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
  },
  header_home: {
    flexDirection: "row",
    justifyContent: "center",
  },
  header_home_item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 100,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
  },
  header_home_item_text: {
    fontSize: 17,
    color: "#000",
    fontWeight: "bold",
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  }
});