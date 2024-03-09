import { View, Text, Image, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
      setTimeout(() => {
          navigation.replace("Login")
      },4000)
  },[])
  useEffect(() => {
    fadeIn()
  },[])
  const animation = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(animation, {
        toValue:1,
        duration:2000,
        useNativeDriver:true
    }).start()
  }
    
  return (
    <Animated.View
      style={[{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FEBE10",
      },
      {opacity:animation}
      ]}
    >
      <Text style={{ fontSize: 40, fontWeight: "bold" }}>Welcome To</Text>
      <Animated.Image
        style={{ width: 150, height: 150, resizeMode: "contain" }}
        source={{
          //   uri: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
          uri: "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png",
        }}
      />
      <Text style={{ fontSize: 40, fontWeight: "bold" }}>AMAZON.COM</Text>
    </Animated.View>
  );
};

export default SplashScreen;
