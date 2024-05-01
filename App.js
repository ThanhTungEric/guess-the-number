import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabNavigator } from "./src/navigator/tabbar";
import { Platform } from 'react-native';


export default function App() {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <NavigationContainer>
        <BottomTabNavigator></BottomTabNavigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
});