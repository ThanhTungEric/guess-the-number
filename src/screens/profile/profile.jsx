import { StatusBar } from 'expo-status-bar';
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import CollectReward from "../component/collect-reward";
import Name from "./friend/name";
import { useTranslation } from 'react-i18next';
import MainFriend from "./friend/mainFriend";
import bg from '../../screens/component/img/bg.jpg';

function Profile({ navigation }) {
  const { t } = useTranslation();

  const handleLogout = () => {
    navigation.navigate('Chart');
  };
  

  return (
    <ImageBackground source={bg} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Name />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.header_home}>
            <MainFriend />
          </View>
          <View style={styles.container_body}>
            <CollectReward />
          </View>
        </ScrollView>
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>{t('explore rank')}</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // Màu nền trong suốt để xem nền hình ảnh
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Đảm bảo nền hình ảnh bao phủ toàn bộ không gian
  },
  header_home: {
    width: "100%",
    alignItems: "center",
  },
  container_body: {
    backgroundColor: "rgba(255,255,255,0.3)", 
    alignItems: "center",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20, 
  },
  logoutButtonContainer: {
    alignItems: "center",
    marginBottom: 100, 
  },
  logoutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
