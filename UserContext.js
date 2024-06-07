import { createContext, useState } from "react";

const UserType = createContext();

const UserContext = ({children}) => {
    const [userId, setUserId] = useState("")
    const [orders, setOrders] = useState("")
    return (
        <UserType.Provider value={{userId, setUserId, orders, setOrders}}>
            {children}
        </UserType.Provider>
    )
}

export {UserType, UserContext};