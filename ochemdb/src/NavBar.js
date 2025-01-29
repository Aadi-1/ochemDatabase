import React, { useState } from "react";
import { useCart } from "./CartContext"; // Import cart context

export default function NavBar() {
  const { cart, removeFromCart } = useCart(); // Access cart data and remove functionality
  const [showCart, setShowCart] = useState(false); // State to toggle cart dropdown visibility
  const [showModal, setShowModal] = useState(false);

  const toggleCart = () => setShowCart((prev) => !prev); // Toggle cart visibility

  const closeModal = () => setShowModal(false);

  const handleTableClick = (event) => {
    if (cart.length === 0) {
      event.preventDefault(); // Prevent navigation
      setShowModal(true); // Show modal instead
    }
  };

  const generateTable = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }), // Send the cart data to the backend
      });

      if (!response.ok) {
        throw new Error("Failed to generate the table.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "chemicals_table.xlsx"; // File name for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating table:", error);
      alert("Failed to generate the table. Please try again.");
    }
  };

  return (
    <>
      <nav className="nav">
        <a href="/" className="site-title">
          Ochem Database
        </a>
        <ul>
          <CustomLink href="/about">About</CustomLink>
          <CustomLink href="/instructions">Instructions</CustomLink>
          <CustomLink href="/request">Request A Chemical</CustomLink>
          <li>
            <a
              href="/table"
              onClick={handleTableClick}
              className="generate-table-btn"
            >
              Generate Table
            </a>
          </li>
        </ul>

        <div className="cart-icon-container">
          <div onClick={toggleCart} className="cart-icon">
            🛒
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </div>

          {showCart && (
            <div className="cart-popup">
              <h4>Cart</h4>
              {cart.length > 0 ? (
                <ul>
                  {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                      <span>{item.name}</span>
                      <button onClick={() => removeFromCart(item.name)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cart is Empty</h2>
            <p>Please add a chemical to the cart to generate a table.</p>
            <button onClick={closeModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CustomLink({ href, children, ...props }) {
  const path = window.location.pathname;
  return (
    <li className={path === href ? "active" : ""}>
      <a href={href} {...props}>
        {children}
      </a>
    </li>
  );
}
