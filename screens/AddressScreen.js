import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import { decode } from "base-64";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

global.atob = decode;

const jwt_decode = require("jwt-decode").jwtDecode;

const AddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodeToken = jwt_decode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);
  console.log(userId);
  const handleAddAddress = () => {
    const address = {
      name,
      mobileNo,
      houseNo,
      street,
      landmark,
      postalCode,
    };
    axios
      .post("http://10.0.2.2:8000/addresses", { userId, address })
      .then((response) => {
        Alert.alert("Success", "Addresses added successfully");
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLandmark("");
        setPostalCode("");

        setTimeout(() => {
          navigation.goBack();
        }, 500);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to add address");
        console.log("Error added addresses: ", error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header} />
      <View style={styles.address_info}>
        <Text style={styles.address_add_title}>Add a new Address</Text>
        <TextInput
          placeholder="Vietnam"
          placeholderTextColor={"#000"}
          style={styles.address_input}
        />

        <View style={styles.info}>
          <Text style={styles.address_fullname}>
            Full name (First and last name)
          </Text>
          <TextInput
            style={styles.address_input}
            placeholder="Enter your name"
            placeholderTextColor={"#000"}
            value={name}
            onChangeText={(value) => setName(value)}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.address_no_mobile}>Mobile number</Text>
          <TextInput
            style={styles.address_input}
            placeholder="Mobile number"
            placeholderTextColor={"#000"}
            value={mobileNo}
            onChangeText={(value) => setMobileNo(value)}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.address_info_more}>
            Flat, House No, Building, Company
          </Text>
          <TextInput
            style={styles.address_input}
            placeholder=""
            placeholderTextColor={"#000"}
            value={houseNo}
            onChangeText={(value) => setHouseNo(value)}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.address_info_more}>
            Area, Street, Sector, Village
          </Text>
          <TextInput
            style={styles.address_input}
            placeholder=""
            placeholderTextColor={"#000"}
            value={street}
            onChangeText={(value) => setStreet(value)}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.address_info_more}>Landmark</Text>
          <TextInput
            style={styles.address_input}
            placeholder="Eg near appollp hopital"
            placeholderTextColor={"#000"}
            value={landmark}
            onChangeText={(value) => setLandmark(value)}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.text_pincode}>Pincode</Text>
          <TextInput
            style={styles.address_input}
            placeholder="Enter Pincode"
            placeholderTextColor={"#000"}
            value={postalCode}
            onChangeText={(value) => setPostalCode(value)}
          />
        </View>

        <TouchableOpacity
          onPress={handleAddAddress}
          style={styles.address_btn_handle_add}
        >
          <Text style={styles.address_title_btn_add}>Add Address</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  address_info: {
    padding: 10,
  },
  info: {
    marginVertical: 10,
  },
  text_pincode: {
    marginVertical: 10,
  },
  header: {
    height: 50,
    backgroundColor: "#00CED1",
  },
  address_add_title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  address_fullname: {
    fontSize: 15,
    fontWeight: "bold",
  },
  address_no_mobile: {
    fontSize: 15,
    fontWeight: "bold",
  },
  address_info_more: {
    fontSize: 15,
    fontWeight: "bold",
  },
  address_input: {
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
  },
  address_btn_handle_add: {
    backgroundColor: "#FFC72C",
    padding: 19,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  address_title_btn_add: {
    fontWeight: "bold",
  },
});
