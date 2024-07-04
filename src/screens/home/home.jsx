import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// import component
import UserInfor from '../component/user-infor';
//icon
import { Entypo, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
function Home({ navigation }) {
  //go to play with bot
  const handlePress = (props) => {
    navigation.navigate('PlayWithBot')
  }
  //go to play one to one
  const handlePressPlayOneToOne = (props) => {
    navigation.navigate('Room')
  }
  //get user infor
  const route = useRoute();
  const { data } = route.params;
// test delete @user_data from asyn
  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@user_data')
    } catch (e) {
      // remove error
    }
    console.log('Done.')
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
        <UserInfor />
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
          <TouchableOpacity onPress={handlePressPlayOneToOne} on style={{ width: "45%", aspectRatio: 1, backgroundColor: '#04c977', borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
            <FontAwesome5 name="play" size={50} color="#04583e" />
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 8 }}>1 Vs 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePress}
            style={{ width: "45%", aspectRatio: 1, backgroundColor: '#04c977', borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
            <MaterialCommunityIcons name="robot-confused" size={50} color="#04583e" />
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 8 }}>Play Vs Bot</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={{width: 100, height: 100, backgroundColor: "pink"}} onPress={removeValue}>
        <Text>Remove</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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