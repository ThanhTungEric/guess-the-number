import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, Dimensions, Image } from "react-native";
import Home from "../../screens/home/home";
import Profile from "../../screens/profile/profile";
import ProfileSettings from "../../screens/settings/settings";
import { getPathDown } from "./curve";
import { Svg, Path } from "react-native-svg";
import { scale } from "react-native-size-scaling";
import { useTranslation } from "react-i18next";

// Icon
import { Octicons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
export const BottomTabNavigator = () => {
  const route = useRoute();
  const [maxWidth, setMaxWidth] = useState(Dimensions.get("window").width);
  const returnpathDown = getPathDown(maxWidth, 60, 50);
  const { t } = useTranslation();

  // Lấy dữ liệu từ route.params.data
  const {data} = route.params;


  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarItemStyle: {
            margin: 0,
            backgroundColor: "white",
          },
          tabBarIcon: () => (
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={{
                uri: "https://img.icons8.com/small/64/null/gender-neutral-user.png",
              }}
            />
          ),
          tabBarLabel: () => (
            <Text className="text-black text-xs">{t('profile')}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        initialParams={{ data: data }}
        component={Home}
        options={{
          headerShown: false,
          unmountOnBlur: false,
          tabBarItemStyle: {
            margin: 0,
            zIndex: -50,
          },
          tabBarIcon: () => (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 56,
                width: 56,
                backgroundColor: "#ff861d",
                borderRadius: 35,
              }}
            >
              <Octicons name="home" size={30} color="white" />
            </View>
          ),
          tabBarLabel: () => (
            <View>
              <Svg width={maxWidth} height={scale(60)}>
                <Path fill={"white"} {...{ d: returnpathDown }} />
              </Svg>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileSetting"
        component={ProfileSettings}
        options={{
          headerShown: false,
          tabBarItemStyle: {
            margin: 0,
            backgroundColor: "white",
          },
          tabBarIcon: () => (
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={{
                uri: "https://img.icons8.com/small/64/null/gear.png",
              }}
            />
          ),
          tabBarLabel: () => (
            <Text className="text-black text-xs">{t('setting')}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};