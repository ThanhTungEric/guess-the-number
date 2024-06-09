import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabNavigator } from "./src/navigator/tabbar";
import { Platform } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlayWithBot from "./src/screens/home/components/play-with-bot";
import PlayOneToOne from "./src/screens/home/components/play-one-one";
import Room from "./src/screens/home/components/room";
import Login from "./src/screens/login/login";
import { DataProvider } from "./src/HookToGetUserInfo/DataContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DataProvider>
      <SafeAreaView style={styles.droidSafeArea}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="PlayWithBot" component={PlayWithBot} options={{ headerShown: false }} />
            <Stack.Screen name="Room" component={Room} options={{ headerShown: false }} />
            <Stack.Screen name="PlayOneToOne" component={PlayOneToOne} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </DataProvider>

  );
}
const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
});