import React, { useState } from "react";
import { useCart } from "./CartContext"; // Import cart context

export default function NavBar() {
  const { cart, removeFromCart } = useCart(); // Access cart data and remove functionality
  const [showCart, setShowCart] = useState(false); // State to toggle cart dropdown visibility

  const toggleCart = () => setShowCart((prev) => !prev); // Toggle cart visibility

  return (
    <nav className="nav">
      <a href="/" className="site-title">
        Ochem Database
      </a>
      <ul>
        <CustomLink href="/about">About</CustomLink>
        <CustomLink href="/instructions">Instructions</CustomLink>
        <CustomLink href="/request">Request A Chemical</CustomLink>
      </ul>
      {/* Cart Icon Section */}
      <div className="cart-icon-container">
        <div onClick={toggleCart} className="cart-icon">
          🛒
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </div>

        {/* Cart Dropdown */}
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
  );
}

// CustomLink Component
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
