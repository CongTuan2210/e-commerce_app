import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
// import addItemToCart from
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";

const ProductItem = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };
  return (
    <TouchableOpacity style={styles.product_container}>
      <Image style={styles.product_image} source={{ uri: item?.image }} />
      <Text numberOfLines={1} style={styles.product_title}>
        {item?.title}
      </Text>

      <View style={styles.product_info_container}>
        <Text style={styles.product_info_price}>${item?.price}</Text>
        <Text style={styles.product_info_rate}>
          {item?.rating?.rate} ratings
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => addItemToCart(item)}
        style={styles.product_btn_add}
      >
        {addedToCart ? (
          <View>
            <Text>Added to Cart</Text>
          </View>
        ) : (
          <Text>Add to cart</Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  product_container: {
    marginHorizontal: 20,
    marginVertical: 25,
  },
  product_image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  product_title: {
    width: 150,
    marginTop: 10,
  },
  product_info_container: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  product_info_price: {
    fontSize: 15,
    fontWeight: "bold",
  },
  product_info_rate: {
    color: "#FFC72C",
    fontWeight: "bold",
  },
  product_btn_add: {
    backgroundColor: "#FFC72C",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
});
