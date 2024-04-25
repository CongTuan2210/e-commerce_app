import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { UserType } from "../UserContext";

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  console.log("userId: ", userId);
  useEffect(() => {
    fetchAddresses();
  }, []);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http:/10.0.2.2:8000/addresses/${userId}`
      );
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
      <View style={styles.address_container}>
        <TouchableOpacity style={styles.address_btn_search}>
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput placeholder="Search Amazon.in" />
        </TouchableOpacity>

        <Feather name="mic" size={24} color="black" />
      </View>

      <View style={{ padding: 10 }}>
        <Text style={styles.address_title}>Your Address</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddAddress")}
          style={styles.address_btn_add}
        >
          <Text>Add a new Address</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
          {addresses?.map((item, index) => (
            <TouchableOpacity style={styles.address_btn_detail}>
              <View style={styles.address_btn_detail_container}>
                <Text style={styles.address_name}>{item?.name}</Text>
                <Entypo name="location-pin" size={24} color="red" />
              </View>

              <Text style={styles.address_info_more}>
                {item?.houseNo}, {item?.landmark}
              </Text>

              <Text style={styles.address_info_more}>{item?.street}</Text>

              <Text style={styles.address_info_more}>Vietnam, Ho Chi Minh</Text>

              <Text style={styles.address_info_more}>
                Phone No: {item?.mobileNo}
              </Text>

              <Text style={styles.address_info_more}>
                Pin code: {item?.postalCode}
              </Text>

              <View style={styles.address_handle}>
                <TouchableOpacity style={styles.address_btn_edit}>
                  <Text>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.address_btn_remove}>
                  <Text>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.address_btn_default}>
                  <Text>Set as Default</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  address_container: {
    backgroundColor: "#00CED1",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  address_btn_search: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 3,
    height: 38,
    flex: 1,
  },
  address_title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  address_btn_add: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  address_btn_detail: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    padding: 10,
    flexDirection: "column",
    gap: 5,
    marginVertical: 10,
  },
  address_btn_detail_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  address_name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  address_info_more: {
    fontSize: 15,
    color: "#181818",
  },
  address_handle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 7,
  },
  address_btn_edit: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
  address_btn_remove: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
  address_btn_default: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
});
