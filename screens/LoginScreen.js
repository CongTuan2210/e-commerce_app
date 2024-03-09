import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  // useEffect(() => {
  //   const checkLoginStatus = async() => {
  //     try {
  //       const token = await AsyncStorage.getItem("authToken")

  //       if(token) {
  //         navigation.replace("Main")
  //       }
  //     } catch (error) {
  //       console.log("Error message: ",error)
  //     }
  //   } 
  //   checkLoginStatus()
  // },[])

  // if(loading) {
  //   return <SplashScreen/>
  // }

  const handleLogin = () => {
    // setLoading(true)
    const user = {
      email: email,
      password: password
    }

    axios.post("http://10.0.2.2:8000/login", user).then((response) => {
      console.log(response);
      const token = response.data.token
      AsyncStorage.setItem("authToken",token)
      navigation.replace("Main")

    }).catch((error) => {
      Alert.alert("Login error", "Invalid Email")
      console.log(error)
    })
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", marginTop:50 }}
    >
      <View style={{ marginTop: 50 }}>
        <Image
          style={{ width: 200, height: 100 }}
          source={{
            uri: "https://cdn.pixabay.com/photo/2021/08/10/16/02/amazon-6536326_960_720.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Login In to your Account
          </Text>
        </View>

        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Enter your email"
              value={email}
              onChangeText={(value) => setEmail(value)}
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock1"
              size={24}
              color="gray"
            />
            <TextInput
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Enter your password"
              value={password}
              secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me logged in</Text>

          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>

        <View style={{ marginTop: 80 }} />

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={{marginTop:15}}
        >
            <Text style={{textAlign:"center",color:"gray",fontSize:16}}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
