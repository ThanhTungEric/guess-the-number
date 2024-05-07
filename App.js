import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabNavigator } from "./src/navigator/tabbar";
import { Platform } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlayWithBot from "./src/screens/home/components/play-with-bot";
import Room from "./src/screens/home/components/room";
import PlayWithPlayer from "./src/screens/home/components/play-1-vs-1";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="PlayWithBot" component={PlayWithBot} options={{ headerShown: false }} />
          <Stack.Screen name="Room" component={Room} options={{ headerShown: false }} />
          <Stack.Screen name="PlayWithPlayer" component={PlayWithPlayer} options={{ headerShown: false }} />
        </Stack.Navigator>
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