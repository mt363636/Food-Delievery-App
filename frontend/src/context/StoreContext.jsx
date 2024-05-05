import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {
    
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([]);
   
    const addToCart = async (itemId) => {
        // Check if the item is already in the cart
        if (cartItems[itemId]) {
            setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        } else {
            // If the item is not in the cart, add it with quantity 1
            setCartItems(prev => ({ ...prev, [itemId]: 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId },{headers:{token}});
        }
    };

    const removeFromCart = async (itemId) => {
        // Check if the item is in the cart and its quantity is more than 1
        if (cartItems[itemId] && cartItems[itemId] > 1) {
            setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        } else {
            // If the quantity is 1 or item not found, remove it from the cart
            const updatedCart = { ...cartItems };
            delete updatedCart[itemId];
            setCartItems(updatedCart);
        }
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId },{headers:{token}});
        }
    };

   const getTotalCartAmount = () => {
       let totalAmount = 0;
       for (const item in cartItems) 
       {
        if(cartItems[item] > 0){
            let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
        }
     
       }
       return totalAmount;
   }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    }

   const loadCartData = async (token) => {
       const response = await axios.post(url + "/api/cart/get",{},{headers:{token}});
       setCartItems(response.data.cartData);
   }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken

    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
