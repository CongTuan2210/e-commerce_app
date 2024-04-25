import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { cleanCart } from "../redux/CartReducer";
// import RazorpayCheckout from "react-native-razorpay"

const ConfirmationScreen = () => {
  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Summary" },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
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
  const [selectedAddress, setSelectedAddress] = useState("");
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };

      const response = await axios.post(
        "http://10.0.2.2:8000/orders",
        orderData
      );
      if (response.status === 200) {
        navigation.navigate("Order");
        dispatch(cleanCart());
        console.log("Order created successfully", response.data.order);
      } else {
        console.log("Error creating order: ", response.data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  // const pay = async() => {
  //   try {
  //     const options = {
  //       description: "Adding To Wallet",
  //       currency: "INR",
  //       name: "Amazon",
  //       key: "rzp_test_E3GWYimxN7YMk8",
  //       amount: total * 100,
  //       prefill: {
  //         email: "void@razorpay.com",
  //         contact: "0817423022",
  //         name: "RazorPay Software",
  //       },
  //       theme: { color: "#F37254" },
  //     };

  //     const data = await RazorpayCheckout.open(options)

  //     const orderData = {
  //       userId: userId,
  //       cartItems: cart,
  //       totalPrice: total,
  //       shippingAddress: selectedAddress,
  //       paymentMethod: selectedOption,
  //     };

  //     const response = await axios.post(
  //       "http://10.0.2.2:8000/orders",
  //       orderData
  //     );
  //     if (response.status === 200) {
  //       navigation.navigate("Order");
  //       dispatch(cleanCart());
  //       console.log("Order created successfully", response.data.order);
  //     } else {
  //       console.log("Error creating order: ", response.data);
  //     }
  //   } catch (error) {
  //     console.log("Error: ",error)
  //   }
  // }
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.step}>
          {steps?.map((step, index) => (
            <View style={styles.step_container}>
              {index > 0 && (
                <View
                  style={[
                    styles.step_detail,
                    index <= currentStep && { backgroundColor: "green" },
                  ]}
                />
              )}
              <View
                style={[
                  styles.step_complete,
                  index < currentStep && { backgroundColor: "green" },
                ]}
              >
                {index < currentStep ? (
                  <Text style={styles.check_index}>&#10003;</Text>
                ) : (
                  <Text style={styles.check_index}>{index + 1}</Text>
                )}
              </View>
              <Text style={styles.step_title}>{step.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {currentStep == 0 && (
        <View style={styles.current_step_container}>
          <Text style={styles.current_step0_option}>
            Select Delivery Address
          </Text>

          <TouchableOpacity>
            {addresses?.map((item, index) => (
              <TouchableOpacity style={styles.btn_choose_address}>
                {selectedAddress && selectedAddress._id === item?._id ? (
                  <FontAwesome5 name="dot-circle" size={24} color="#008397" />
                ) : (
                  <Entypo
                    onPress={() => setSelectedAddress(item)}
                    name="circle"
                    size={24}
                    color="black"
                  />
                )}

                <View style={styles.address_positon}>
                  <View style={styles.address_info}>
                    <Text style={styles.address_name}>{item?.name}</Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>

                  <Text style={styles.address_info_other}>
                    {item?.houseNo}, {item?.landmark}
                  </Text>

                  <Text style={styles.address_info_other}>{item?.street}</Text>

                  <Text style={styles.address_info_other}>
                    Vietnam, Ho Chi Minh
                  </Text>

                  <Text style={styles.address_info_other}>
                    Phone No: {item?.mobileNo}
                  </Text>

                  <Text style={styles.address_info_other}>
                    Pin code: {item?.postalCode}
                  </Text>

                  <View style={styles.handle_address}>
                    <TouchableOpacity style={styles.handle_btn}>
                      <Text>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.handle_btn}>
                      <Text>Remove</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.handle_btn}>
                      <Text>Set as Default</Text>
                    </TouchableOpacity>
                  </View>

                  <View>
                    {selectedAddress && selectedAddress._id === item._id && (
                      <TouchableOpacity
                        onPress={() => setCurrentStep(1)}
                        style={styles.deliver_btn}
                      >
                        <Text style={styles.deliver_btn_text}>
                          Deliver to this Address
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 1 && (
        <View style={styles.current_step_container}>
          <Text style={styles.delivery_step_text}>
            Choose your delivery options
          </Text>

          <View style={styles.delivery_step_container}>
            {option ? (
              <FontAwesome5 name="dot-circle" size={24} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={24}
                color="gray"
              />
            )}
            <Text style={styles.delivery_step_content}>
              <Text style={styles.delivery_step_text_bold}>
                Tomorrow by 10pm
              </Text>{" "}
              - FREE delivery with your Prime membership
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setCurrentStep(2)}
            style={styles.btn_continue}
          >
            <Text>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.current_step_container}>
          <Text style={styles.payment_title}>Select your payment Method</Text>

          <View style={styles.cash_on_deliver}>
            {selectedOption === "cash" ? (
              <FontAwesome5 name="dot-circle" size={24} color="#008379" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("cash")}
                name="circle"
                size={24}
                color="gray"
              />
            )}

            <Text>Cash on Deliver</Text>
          </View>

          <View style={styles.cash_on_deliver}>
            {selectedOption === "card" ? (
              <FontAwesome5 name="dot-circle" size={24} color="#008379" />
            ) : (
              <Entypo
                onPress={() => {
                  setSelectedOption("card");
                  Alert.alert(
                    "Coming Soon!",
                    "We will launch this service soon!",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          console.log("OK PAYMENT ONLINE");
                          setSelectedOption(null);
                        },
                      },
                    ]
                  );
                }}
                name="circle"
                size={24}
                color="gray"
              />
            )}

            <Text>UPI / Credit or debit card</Text>
          </View>

          <TouchableOpacity
            onPress={() => setCurrentStep(3)}
            style={styles.btn_continue}
          >
            <Text>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 3 && selectedOption === "cash" && (
        <View style={styles.current_step_container}>
          <Text style={styles.order_title}>Order Now</Text>

          <View style={styles.order_container}>
            <View>
              <Text style={styles.order_content}>
                Save 5% and never run out
              </Text>
              <Text style={styles.order_content_text}>
                Turn on auto deliveries
              </Text>
            </View>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>

          <View style={styles.ship_info}>
            <Text>Shipping to {selectedAddress?.name}</Text>

            <View style={styles.info_item}>
              <Text style={styles.items}>Items</Text>
              <Text style={styles.ship_total}>${total}</Text>
            </View>

            <View style={styles.delivery_money}>
              <Text style={styles.deliver}>Delivery</Text>
              <Text style={styles.money_style}>$0</Text>
            </View>

            <View style={styles.order_total}>
              <Text style={styles.order_total_text}>Order Total</Text>
              <Text style={styles.total_price}>${total}</Text>
            </View>
          </View>

          <View style={styles.payment_method}>
            <Text style={styles.payment_method_text}>Pay with</Text>

            <Text style={styles.payment_delivery}>Pay on delivery (Cash)</Text>
          </View>

          <TouchableOpacity
            onPress={handlePlaceOrder}
            style={styles.accept}
          >
            <Text>Place your order</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  step_container: {
    justifyContent: "center",
    alignItems: "center",
  },
  step_detail: {
    flex: 1,
    height: 2,
    backgroundColor: "green",
  },
  step_complete: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
  },
  check_index: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  step_title: {
    textAlign: "center",
    marginTop: 8,
  },
  current_step_container: {
    marginHorizontal: 20,
  },
  current_step0_option: {
    fontSize: 16,
    fontWeight: "bold",
  },
  btn_choose_address: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    padding: 10,
    flexDirection: "row",
    gap: 5,
    paddingBottom: 17,
    marginVertical: 7,
    alignItems: "center",
    borderRadius: 6,
  },
  address_positon: {
    marginLeft: 6,
  },
  address_info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  address_name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  address_info_other: {
    fontSize: 15,
    color: "#181818",
  },
  handle_address: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 7,
  },
  handle_btn: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0",
  },
  deliver_btn: {
    backgroundColor: "#008397",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  deliver_btn_text: {
    textAlign: "center",
    color: "#FFF",
  },
  delivery_step_text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  delivery_step_container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 8,
    gap: 7,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
  },
  delivery_step_content: {
    flex: 1,
  },
  delivery_step_text_bold: {
    color: "green",
    fontWeight: "500",
  },
  btn_continue: {
    backgroundColor: "#FFC72C",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  payment_title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cash_on_deliver: {
    backgroundColor: "#FFF",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 12,
  },
  order_title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  order_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#FFF",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
  },
  order_content: {
    fontSize: 17,
    fontWeight: "bold",
  },
  order_content_text: {
    fontSize: 15,
    color: "gray",
    marginTop: 5,
  },
  ship_info: {
    backgroundColor: "#FFF",
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
  },
  info_item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  items: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
  },
  ship_total: {
    fontSize: 16,
    color: "gray",
  },
  delivery_money: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deliver: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
  },
  money_style: {
    fontSize: 16,
    color: "gray",
  },
  order_total: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  order_total_text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  total_price: {
    fontSize: 16,
    color: "#C60C30",
    fontWeight: "bold",
  },
  payment_method: {
    backgroundColor: "#FFF",
    padding: 8,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
  },
  payment_method_text: {
    fontSize: 16,
    color: "gray",
  },
  payment_delivery: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 7,
  },
  accept: {
    backgroundColor: "#FFC72C",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
