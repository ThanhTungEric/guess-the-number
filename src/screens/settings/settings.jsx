import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

//
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';

function Settings() {
  const navigation = useNavigation();
  //back to home
  const backToHome = () => {
    navigation.navigate("Home");
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#fff" barStyle="light-content" />
      <View style={{ flexDirection: "row", paddingHorizontal: 10, alignItems: "center", paddingVertical: 10, backgroundColor: "#fff" }}>
        <TouchableOpacity onPress={backToHome}>
        <AntDesign name="arrowleft" size={26} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, backgroundColor: "#fff", fontWeight: "500", marginLeft: 10 }}>Cài đặt</Text>
      </View>
      {/* <View style={{ width: "100%", paddingVertical: 15, backgroundColor: "#fff", marginTop: 8, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>Xóa bộ nhớ cache</Text>
        <AntDesign name="right" size={17} color="#bdbdbd" />
      </View> */}
      <View style={{ width: "100%", paddingVertical: 15, backgroundColor: "#fff", marginTop: 8, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>Ngôn ngữ</Text>
        <AntDesign name="right" size={17} color="#bdbdbd" />
      </View>
      <View style={{ width: "100%", paddingVertical: 15, backgroundColor: "#fff", marginTop: 8, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>Về chúng tôi</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{color: "#bdbdbd", marginRight: 5}}>v1.0.0</Text>
          <AntDesign name="right" size={17} color="#bdbdbd" />
        </View>
      </View>
      <View style={{ width: "100%", paddingVertical: 15, backgroundColor: "#fff", marginTop: 8, paddingHorizontal: 20, flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>Đăng xuất</Text>
      </View>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  }
});