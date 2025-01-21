import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [popupMessage, setPopupMessage] = useState(null); // State for popup message
  const [showPopup, setShowPopup] = useState(false); // State to control visibility
  const [popupType, setPopupType] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart updated:", cart);
  }, [cart]);

  const addToCart = (chemical) => {
    console.log("Adding to cart:", chemical); // Debug log

    // Ensure the chemical object has all necessary fields
    const requiredFields = [
      "name",
      "molecular_weight",
      "density",
      "melting_boiling_point",
      "hazards",
    ];
    const missingFields = requiredFields.filter((field) => !chemical[field]);

    if (missingFields.length > 0) {
      console.error("Cannot add to cart. Missing fields:", missingFields);
      return; // Exit early if the chemical is incomplete
    }

    // Only add to cart if not already present
    if (cart.find((item) => item.name === chemical.name)) {
      setPopupMessage(`${chemical.name} is already in the cart!`);
      setPopupType("info");
      setShowPopup(true); // Show popup
    } else {
      setCart((prevCart) => [...prevCart, chemical]);
      setPopupMessage(`${chemical.name} has been added to the cart!`);
      setPopupType("add");
      setShowPopup(true); // Show popup
    }
    setTimeout(() => {
      setShowPopup(false);
    }, 4000);
  };

  const removeFromCart = (name) => {
    setCart(cart.filter((item) => item.name !== name));
    setPopupMessage(`${name} has been removed from the cart`);
    setPopupType("remove");
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 4000);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}

      {/* Popup message */}
      {showPopup && (
        <div
          className="popup-message"
          style={{
            backgroundColor:
              popupType === "add"
                ? "#4caf50" // Green for adding to cart
                : popupType === "remove"
                ? "#f44336" // Red for removing from cart
                : "#2196f3", // Blue for "already in cart"
          }}
        >
          {popupMessage}
        </div>
      )}
    </CartContext.Provider>
  );
};
