import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Pressable,
} from "react-native";
import React from "react";
import { UserType } from "../../../UserContext";
import axios from "axios";
import { Product } from "../../../zustand/interface";

const WaitingForConfirm = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const { userId, setUser, orders, setOrders } = React.useContext(UserType);
    const [totalAmount, setTotalAmount] = React.useState<number>(0);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:8000/orders/${userId}`);
            const orders = response.data.orders;
            setOrders(orders);
            const totalAmount = orders?.reduce((total, order) => {
                return total + order.totalPrice;
            }, 0);
            setTotalAmount(totalAmount);
            setLoading(false);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const cancelOrder = async (orderId, productId) => {
        try {
            const response = await axios.put(
                `http://10.0.2.2:8000/orders/${orderId}/products/${productId}`
            );
            console.log(response.data.message); // In ra thông báo từ server

            setOrders((prevOrders) => {
                const updatedOrders = prevOrders
                    .map((order) => {
                        if (order._id === orderId) {
                            const updatedProducts = order.products.filter(
                                (product) => product._id !== productId
                            );
                            order.totalPrice -= order.products.find(p => p._id === productId).price;
                            return { ...order, products: updatedProducts };
                        }
                        return order;
                    })
                    .filter((order) => order.products.length > 0);

                // Tính lại tổng số tiền
                const newTotalAmount = updatedOrders.reduce((total, order) => {
                    return total + order.totalPrice;
                }, 0);
                setTotalAmount(newTotalAmount);

                return updatedOrders;
            });
        } catch (error) {
            console.log("Lỗi khi hủy đơn hàng: ", error);
        }
    };

    React.useEffect(() => {
        fetchOrders();
    }, []);

    React.useEffect(() => {
        const totalAmount = orders.reduce((total, order) => {
            return total + order.totalPrice;
        }, 0);
        setTotalAmount(totalAmount);
    }, [orders]);

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : orders.length > 0 ? (
                    orders?.map((order) => (
                        <View style={styles.productStyle} key={order.id}>
                            {order?.products?.map((product) => (
                                <View style={styles.productDetailContainer} key={product._id}>
                                    <View style={styles.productDetail}>
                                        <View>
                                            <Image
                                                source={{ uri: product.image }}
                                                style={styles.productImage}
                                            />
                                        </View>
                                        <View style={styles.productInfo}>
                                            <Text numberOfLines={2} style={styles.productTextName}>
                                                {product.name}
                                            </Text>
                                            <Text style={styles.quantityProduct}>
                                                {"x"}
                                                {product.quantity}
                                            </Text>
                                            <Text style={styles.priceProduct}>
                                                {product.price}$
                                            </Text>
                                        </View>
                                    </View>
                                    <Pressable
                                        onPress={() => cancelOrder(order._id, product._id)}
                                        style={styles.cancleBtn}
                                    >
                                        <Text style={styles.textCancleBtn}>Hủy đơn hàng</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    ))
                ) : (
                    <Text>No orders found</Text>
                )}
                <Text style={styles.totalText}>Total: {totalAmount}$</Text>
            </ScrollView>
        </View>
    );
};

export default WaitingForConfirm;

const styles = StyleSheet.create({
    productStyle: {
        borderRadius: 8,
    },
    productDetailContainer: {
        paddingVertical: 15,
        borderColor: "#ccc",
        borderBottomWidth: 0.9,
    },
    productDetail: {
        flexDirection: "row",
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 100,
    },
    productTextName: {
        fontSize: 14,
        fontWeight: "400",
    },
    quantityProduct: {
        textAlign: "right",
    },
    priceProduct: {
        textAlign: "right",
        color: "#525252",
        fontWeight: "700",
    },
    productInfo: {
        flex: 1,
        marginLeft: 5,
    },
    cancleBtn: {
        marginTop: 5,
        borderWidth: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderColor: "#ccc",
    },
    textCancleBtn: {
        fontSize: 14,
        color: "#000",
        fontWeight: "500",
    },
    totalText: {
        fontSize: 16,
        paddingTop: 15,
        fontWeight: "700",
        textAlign: "right",
    },
});
