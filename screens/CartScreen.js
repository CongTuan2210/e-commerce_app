import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   decrementQuantity,
//   incrementQuantity,
//   removeFromCart,
// } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import useCartStore from "../zustand/CartStore";

const CartScreen = () => {
  // 
  const {cart,totalPrice, incrementQuantity, decrementQuantity, removeFromCart} = useCartStore()
  // 
  const navigation = useNavigation();
  // const cart = useSelector((state) => state.cart.cart);
  // const total = cart
  //   ?.map((item) => item.price * item.quantity)
  //   .reduce((curr, prev) => curr + prev, 0);
  const dispatch = useDispatch();
  const increaseQuantity = (item) => {
    // dispatch(incrementQuantity(item));
    incrementQuantity(item)
  };
  const decreaseQuantity = (item) => {
    // dispatch(decrementQuantity(item));
    decrementQuantity(item)
  };
  const deleteItem = (item) => {
    // dispatch(removeFromCart(item));
    removeFromCart(item)
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.search_btn}>
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

      <View style={styles.calculate}>
        <Text style={styles.subtotal_text}>Subtotal: </Text>
        <Text style={styles.total_text}>{totalPrice()}</Text>
      </View>

      <Text style={styles.emi_detail_text}>EMI details Available</Text>

      <TouchableOpacity
        onPress={() => {
          totalPrice() > 0 && navigation.navigate("Confirm")
          }}
        style={styles.quantity_item}
      >
        <Text>Proceed to Buy ({cart.length}) items</Text>
        {/* <Text>Proceed to Buy () items</Text> */}
      </TouchableOpacity>

      <Text style={styles.text} />

      <View style={styles.cart_container}>
        {cart?.map((item, index) => (
          <View style={styles.cart_item} key={index}>
            <TouchableOpacity style={styles.cart_item_btn}>
              <View>
                <Image
                  style={styles.cart_item_img}
                  source={{ uri: item?.image }}
                />
              </View>

              <View>
                <Text numberOfLines={3} style={styles.cart_item_title}>
                  {item?.title}
                </Text>
                <Text style={styles.cart_item_price}>{item?.price}</Text>
                <Image
                  style={styles.cart_item_prime_img}
                  source={{
                    uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                  }}
                />
                <Text style={styles.cart_item_stock}>In Stock</Text>
                {/* <Text style={{ fontWeight: "500", marginTop: 6 }}>
                  {item?.rating?.rate} ratings
                </Text> */}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cart_handle_quantity}>
              <View style={styles.cart_handle_quantity_container}>
                {item?.quantity > 1 ? (
                  <TouchableOpacity
                    onPress={() => decreaseQuantity(item)}
                    style={styles.handle_btn}
                  >
                    <AntDesign name="minus" size={24} color="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => deleteItem(item)}
                    style={styles.handle_btn}
                  >
                    <AntDesign name="delete" size={24} color="black" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.quantity_btn}>
                  <Text>{item?.quantity}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => increaseQuantity(item)}
                  style={styles.handle_btn}
                >
                  <Feather name="plus" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => deleteItem(item)}
                style={styles.handle_btn}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <View style={styles.save_later_btn}>
              <TouchableOpacity style={styles.later_btn}>
                <Text>Save For Later</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.later_btn}>
                <Text>See More Like This</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#00CED1",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  search_btn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 3,
    height: 38,
    flex: 1,
  },
  calculate: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  subtotal_text: {
    fontSize: 18,
    fontWeight: "400",
  },
  total_text: {
    fontSize: 18,
    fontWeight: "400",
  },
  emi_detail_text: {
    marginHorizontal: 10,
  },
  quantity_item: {
    backgroundColor: "#FFC72C",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  text: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 16,
  },
  cart_container: {
    marginHorizontal: 10,
  },
  cart_item: {
    backgroundColor: "#FFF",
    marginVertical: 10,
    borderBottomColor: "#F0F0F0",
    borderWidth: 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cart_item_btn: {
    marginVertical: 10,
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  cart_item_img: {
    height: 140,
    width: 140,
    resizeMode: "contain",
  },
  cart_item_title: {
    width: 150,
    marginTop: 10,
  },
  cart_item_price: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
  },
  cart_item_prime_img: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  cart_item_stock: {
    color: "green",
  },
  cart_handle_quantity: {
    marginTop: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cart_handle_quantity_container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
  },
  handle_btn: {
    backgroundColor: "#D8D8D8",
    padding: 7,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  quantity_btn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  save_later_btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  later_btn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#C0C0C0",
    borderWidth: 0.6,
  },
});
