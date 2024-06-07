import {View, Text, Image, ScrollView, TouchableOpacity, Alert} from "react-native";
import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {Ionicons, AntDesign} from "@expo/vector-icons";
import axios from "axios";
import {UserType} from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatBot from "../chatbot/modal/ChatBot";

const ProfileScreen = () => {
    const navigation = useNavigation();
    const {userId, setUserId} = useContext(UserType);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerStyle: {
                backgroundColor: "#00CED1",
            },
            headerLeft: () => (
                <Image
                    style={{width: 140, height: 120, resizeMode: "contain"}}
                    source={{
                        uri: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c518.png",
                    }}
                />
            ),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginRight: 12,
                    }}
                >
                    <Ionicons name="notifications-outline" size={24} color="black"/>

                    <AntDesign name="search1" size={24} color="black"/>
                </View>
            ),
        });
    }, []);
    const [user, setUser] = useState();
    // const [orders, setOrders] = useState([]);
    const {orders, setOrders} = useContext(UserType)
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(
                    `http://10.0.2.2:8000/profile/${userId}`
                );
                const {user} = response.data;
                setUser(user);
            } catch (error) {
                console.log("Error: ", error);
            }
        };
        fetchUserProfile();
    }, []);


    // const logout = () => {
    //   clearAuthToken();
    // };
    const logout = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        clearAuthToken();
                    },
                },
            ],
            {cancelable: false}
        );
    }


    const clearAuthToken = async () => {
        await AsyncStorage.removeItem("authToken");
        console.log("Auth token cleared");
        navigation.replace("Login");
    };
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `http://10.0.2.2:8000/orders/${userId}`
                );
                const orders = response.data.orders;
                setOrders(orders);
                setLoading(false);
            } catch {
                console.log("Error: ", error);
            }
        };
        fetchOrders();
    }, []);
    console.log("Orders: ", orders);
    return (
        <>
            <ScrollView style={{padding: 10, backgroundColor: "#FFF", flex: 1}}>
                <ChatBot
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(!modalVisible)}
                />
                <Image
                    source={{uri: 'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474308TQo/photo-10-16536250469001766985704.jpg'}}
                    style={{
                        height: 50, width: 50, borderRadius: 20, marginLeft: '45%'
                    }}
                />
                <Text style={{fontSize: 16, fontWeight: "bold", marginLeft: '32%'}}>
                    Welcome {user?.name}
                </Text>

                <View
                    style={{
                        gap: 60,
                        marginTop: 20,
                        marginLeft: "auto",
                        marginRight: "auto",
                        alignItems: "center",
                        flexDirection: "row",
                    }}
                >
                    <TouchableOpacity>
                        <Ionicons name="briefcase-outline" size={24} color="black" style={{textAlign: 'center'}}/>
                        <Text style={{textAlign: "center"}}>To Pay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="bus-outline" size={24} color="black" style={{textAlign: 'center'}}/>
                        <Text style={{textAlign: "center"}}>To Receive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="star-outline" size={24} color="black" style={{textAlign: 'center'}}/>
                        <Text style={{textAlign: "center"}}>To Rating</Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 12,
                    }}
                >
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <TouchableOpacity
                                style={{
                                    marginTop: 20,
                                    padding: 15,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: "#d0d0d0",
                                    marginHorizontal: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                key={order._id}
                            >
                                {order.products.slice(0, 1)?.map((product) => (
                                    <View style={{marginVertical: 10}} key={product._id}>
                                        <Image
                                            source={{uri: product.image}}
                                            style={{width: 100, height: 100, resizeMode: "contain"}}
                                        />
                                    </View>
                                ))}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No orders found</Text>
                    )}
                </ScrollView>

                <TouchableOpacity
                    style={{
                        padding: 10,
                        margin: 20,
                        backgroundColor: "#E0E0E0",
                        borderRadius: 25,
                        flex: 1,
                    }}
                    onPress={() => navigation.navigate('My order')}
                >
                    <Text style={{textAlign: 'center'}}>{'My order'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor: "#E0E0E0",
                        borderRadius: 25,
                        flex: 1
                    }}
                    onPress={logout}

                >
                    <Text style={{textAlign: "center"}}>Log out</Text>
                </TouchableOpacity>
            </ScrollView>

            <View
                style={{
                    width: 100,
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                }}
            >
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                        width: 70,
                        height: 70,
                        backgroundColor: "#F2F2F2",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                    }}
                >
                    <Image
                        style={{width: 50, height: 50}}
                        source={require("../chatbot/chaticon/chaticon.png")}
                    />
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ProfileScreen;
