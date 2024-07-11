import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Modal, Image, BackHandler, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

//
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
//
import {useTranslation} from 'react-i18next';
//  
import VN from "./img/VN.png";
import EN from "./img/Anh.png";

function Settings() {
  const navigation = useNavigation();
  //back to home
  const backToHome = () => {
    navigation.navigate("Home");
  }
  //translate
  const { t, i18n } = useTranslation()
  //logout
  //exit
  const  backPressed = () => {
    Alert.alert(
        'Exit App',
        'Do you want to exit?',
        [
            { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false });
    return true;
}


  //Modal for language
  const [modalLanguageVisible, setModalLanguageVisible] = React.useState(false);
  const openModalLanguage = () => {
    setModalLanguageVisible(!modalLanguageVisible);
  }
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setModalLanguageVisible(!modalLanguageVisible);
  }
  const ModalLanguage = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalLanguageVisible} onRequestClose={() => { setModalLanguageVisible(!modalLanguageVisible) }}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Language</Text>
          <View style={styles.ChangeLanguage} >
            <TouchableOpacity onPress={()=> changeLanguage('en')}>
              <View style={styles.languageContainer}>
                <Image source={EN} style={styles.languageImage} />
                <Text style={styles.languageText}>English</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> changeLanguage('vi')}>
              <View style={styles.languageContainer}>
                <Image source={VN} style={styles.languageImage} />
                <Text style={styles.languageText}>Vietnamese</Text>
              </View>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
    )
  }




  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#fff" barStyle="light-content" />
      <View style={{ flexDirection: "row", paddingHorizontal: 10, alignItems: "center", paddingVertical: 10, backgroundColor: "#fff" }}>
        <TouchableOpacity onPress={backToHome}>
        <AntDesign name="arrowleft" size={26} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, backgroundColor: "#fff", fontWeight: "500", marginLeft: 10 }}>{t('delete')}</Text>
      </View>
      <View style={{ width: "100%", paddingVertical: 15, backgroundColor: "#fff", marginTop: 8, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>{t('delete cache')}</Text>
        <AntDesign name="right" size={17} color="#bdbdbd" />
      </View>
      <TouchableOpacity onPress={openModalLanguage} style={{ width: "100%", paddingVertical: 15, backgroundColor: "#fff", marginTop: 8, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>{t('language')}</Text>
        <AntDesign name="right" size={17} color="#bdbdbd" />
      </TouchableOpacity>
      <View style={{ width: "100%", paddingVertical: 15, backgroundColor: "#fff", marginTop: 8, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>{t('about us')}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{color: "#bdbdbd", marginRight: 5}}>v1.0.0</Text>
          <AntDesign name="right" size={17} color="#bdbdbd" />
        </View>

      </View>
      <TouchableOpacity onPress={backPressed} style={{ width: "100%", paddingVertical: 15, backgroundColor: "#fff", marginTop: 8, paddingHorizontal: 20, flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "400" }}>{(t('log out'))}</Text>
      </TouchableOpacity>

      {modalLanguageVisible ? <ModalLanguage /> : null}
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  ChangeLanguage:{
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  languageImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});