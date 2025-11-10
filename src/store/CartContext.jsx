/* © NextCardBD - Developed by Mahin Ltd (Tanvir) */

import React, { createContext, useContext, useState, useEffect } from 'react';

// ===========================================
// 1. DEFINE CONTEXT AND HOOK FIRST (FIX for SyntaxError)
// ===========================================
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};
// ===========================================

// --- Shipping Constants ---
const SHIPPING_COSTS = {
  inside_dhaka: 70,
  dhaka_subarea: 110,
  outside_dhaka: 130,
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('nexcartbd-cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Failed to parse cart data from localStorage', error);
      return [];
    }
  });

  const [shippingOption, setShippingOption] = useState('inside_dhaka');
  const [shippingCost, setShippingCost] = useState(SHIPPING_COSTS.inside_dhaka);

  useEffect(() => {
    localStorage.setItem('nexcartbd-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => item.productId !== productId);
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // This call now works because removeFromCart is defined above
      removeFromCart(productId); 
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      );
    }
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const idKey = product.productId;
      const existingItem = prevItems.find((item) => item.productId === idKey);
      
      const mongoId = product._id?.$oid || product._id || product.productId; 

      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === idKey
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        if (!product.slug || !product.title_en || !mongoId) {
          console.error("Product missing critical fields (slug or ID) and cannot be added.");
          alert("Error: Product details are incomplete.");
          return prevItems;
        }

        return [
          ...prevItems, 
          { 
            ...product, 
            quantity: 1,
            // Save required IDs for API call
            mongoId: mongoId, 
            productId: idKey, 
            title_en: product.title_en,
            title_bn: product.title_bn || product.title_en,
            images: product.images || [],
          }
        ];
      }
    });
  };
  
  // ... (clearCart, setShipping, and calculations remain the same)
  
  const clearCart = () => {
    setCartItems([]);
  };

  const setShipping = (option) => {
    setShippingOption(option);
    setShippingCost(SHIPPING_COSTS[option] || SHIPPING_COSTS.inside_dhaka);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  
  const cartSubtotal = cartItems.reduce((total, item) => {
    const price = item.salePrice || item.price;
    return total + price * item.quantity;
  }, 0);

  const grandTotal = cartSubtotal + shippingCost;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    shippingCost,
    shippingOption,
    grandTotal,
    setShipping,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};