import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
//icon
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

function Home({ navigation }) {
  //go to play with bot
  const handlePress = (props) => {
    navigation.navigate('PlayWithBot')
  }
  return (
    <View style={styles.container}>
      <View style={styles.header_home}>
        <View style={styles.header_home_left}>
          <View style={styles.header_home_item}>
            <MaterialCommunityIcons name="crown-outline" size={24} color="#ff861d" />
            <Text style={styles.header_home_item_text}> 852 </Text>
            <Entypo name="circle-with-plus" size={24} color="#01d48b" />
          </View>
          <View style={styles.header_home_item}>
            <Feather name="heart" size={24} color="#fc4e4f" />
            <Text style={styles.header_home_item_text}> Full </Text>
            <Entypo name="circle-with-plus" size={24} color="#01d48b" />
          </View>
        </View>
        <View style={styles.header_home_right}>
          <Entypo name="menu" size={30} color="#5d7081" />
        </View>
      </View>
      <View style={styles.main_container}>
        <View style={styles.main_container_info}>
          <View style={styles.main_container_info_header}>
            <View style={styles.cricle}>
              <Ionicons name="mail" size={24} color="white" />
            </View>
            <View style={{ alignItems: "center" }}>
              <Image source={require('../../../image/avatar.png')} style={{ width: 70, height: 70, borderRadius: 50 }} />
              <Text style={{ color: "#262c32", fontSize: 20, fontWeight: "bold" }}>John Doe</Text>
            </View>
            <View style={styles.cricle}>
              <MaterialCommunityIcons name="gift" size={24} color="white" />
            </View>
          </View>
          <View style={{ flexDirection: "row", width: "90%", justifyContent: "space-between", marginTop: 15 }}>
            <View style={{ alignItems: "center", width: "33%" }}>
              <FontAwesome6 name="ranking-star" size={24} color="white" />
              <Text style={{ color: "#fff", fontSize: 16 }}>Ranking</Text>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}> -2 </Text>
            </View>
            <View style={{ alignItems: "center", width: "33%" }}>
              <FontAwesome5 name="medal" size={24} color="white" />
              <Text style={{ color: "#fff", fontSize: 15 }}>Total Points</Text>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}> 1200 </Text>
            </View>
            <View style={{ alignItems: "center", width: "33%" }}>
              <AntDesign name="star" size={24} color="#ffd433" />
              <Text style={{ color: "#fff", fontSize: 15 }}>Level</Text>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}> 85/900 </Text>
            </View>
          </View>
        </View>
        <View style={styles.main_container_unlimited}>
          <View style={{ width: 40, height: 40, backgroundColor: "#ff861d", alignItems: "center", justifyContent: "center", borderRadius: 50 }}>
            <MaterialCommunityIcons name="crown-outline" size={30} color="white" />
          </View>
          <View style={{ justifyContent: "center", marginLeft: 20 }}>
            <Text style={{ color: "#fe841d", fontSize: 20, fontWeight: "bold" }}>200 Coins</Text>
            <Text style={{ color: "#000", fontSize: 15, fontWeight: 'bold' }}>Unlimited Games</Text>
          </View>
        </View>
        <View style={styles.main_container_game}>
          <View style={{ width: "45%", aspectRatio: 1, backgroundColor: '#04c977', borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
            <FontAwesome5 name="play" size={50} color="#04583e" />
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 8 }}>Play 1 vs 1</Text>
          </View>
          <TouchableOpacity
            onPress={handlePress}
            style={{ width: "45%", aspectRatio: 1, backgroundColor: '#04c977', borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
            <MaterialCommunityIcons name="robot-confused" size={50} color="#04583e" />
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 8 }}>Play vs Bot</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  header_home_left: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header_home_right: {
    margin: 10,
  },
  header_home_item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 100,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 15,
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
  },
  main_container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#f4f4f6",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center"
  },
  main_container_info: {
    width: "90%",
    height: "33%",
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: "#5d7081",
    alignItems: "center"
  },
  main_container_info_header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#2d3a43",
    borderBottomWidth: 1,
  },
  cricle: {
    width: 40,
    height: 40,
    backgroundColor: "#2d3a43",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  main_container_unlimited: {
    flexDirection: "row",
    height: "12%",
    width: "90%",
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: "#fed034",
    borderColor: "#ffbe2e",
    borderWidth: 8,
    alignItems: "center",
    padding: 10
  },
  main_container_game: {
    width: "90%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  }
});