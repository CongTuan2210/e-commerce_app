import { create } from "zustand";

import { Product } from "./interface";

interface CartState {
    cart: Array<Product & { quantity: number }>;
    addToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
    decrementQuantity: (product: Product) => void;
    incrementQuantity: (product: Product) => void;
    cleanCart: () => void;
    totalPrice: () => void;
}

const useCartStore = create<CartState>()((set, get) => ({
    cart: [],
    addToCart: (product: Product) => set((state) => {
        const hasProduct = state.cart.find((p) => p.id === product.id);
        if (hasProduct) {
            return {
                cart: state.cart.map((p) => {
                    if (p.id === product.id) {
                        return {
                            ...p,
                            quantity: p.quantity + 1,
                        }
                    }
                    return p
                }),
            }
        } else {
            return {
                cart: [...state.cart, { ...product, quantity: 1 }],
            }
        }
    }),
    decrementQuantity: (product: Product) => set((state) => {
        const hasProduct = state.cart.find((p) => p.id === product.id)
        if (hasProduct) {
            if (hasProduct.quantity === 1) {
                return {
                    cart: state.cart.filter((p) => p.id !== product.id)
                }
            } else {
                return {
                    cart: state.cart.map((p) => {
                        if (p.id === product.id) {
                            return {
                                ...p,
                                quantity: p.quantity - 1,
                            }
                        }
                        return p
                    }),
                }
            }
        } else {
            return {
                cart: state.cart
            }
        }
    }),
    incrementQuantity: (product: Product) => set((state) => {
        const itemPresent = state.cart.find((p) => p.id === product.id);
        if (itemPresent) {
            return {
                cart: state.cart.map((p) => {
                    if (p.id === product.id) {
                        return {
                            ...p,
                            quantity: p.quantity + 1,
                        };
                    }
                    return p;
                }),
            };
        } else {
            return { cart: state.cart };
        }
    }),

    removeFromCart: (product: Product) => set((state) => {
        return {
            cart: state.cart.filter((p) => p.id !== product.id)
        }
    }),
    totalPrice: () => get().cart?.map((p) => p.price * p.quantity).reduce((curr, prev) => curr + prev, 0),
    cleanCart: () => set((state) => {
        return {
            cart: [],
        }
    })
}))

export default useCartStore