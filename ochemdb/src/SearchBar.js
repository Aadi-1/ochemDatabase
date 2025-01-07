import React, { useEffect, useState, useRef } from "react";
import "./SearchBar.css";
import { useCart } from "./CartContext";

function SearchBar({ onSearch }) {
  const { cart, addToCart } = useCart();
  const [query, SetQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedChemical, setSelectedChemical] = useState("");
  const [addedChemicals, setAddedChemicals] = useState(new Set()); // Track added chemicals
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (query.length > 1) {
      fetch(`http://127.0.0.1:5000/chemical/suggestions/${query}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSuggestions(data);
          } else {
            setSuggestions([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching Suggestions:", error);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]); // Hide suggestions
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (selectedChemical) {
      onSearch(selectedChemical);
    } else {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (chemical) => {
    setSelectedChemical(chemical.name);
    SetQuery(chemical.name);
    onSearch(chemical.name);
    setSuggestions([]);
  };

  const handleAddToCart = (chemical) => {
    if (!addedChemicals.has(chemical.name)) {
      addToCart(chemical); // Add chemical to cart
      setAddedChemicals((prev) => new Set(prev).add(chemical.name)); // Mark as added
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={selectedChemical || query}
        onChange={(e) => {
          SetQuery(e.target.value);
          setSelectedChemical("");
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search for Chemical"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((chemical, index) => (
            <li key={index}>
              <span onClick={() => handleSuggestionClick(chemical)}>
                {chemical.name}
              </span>
              {addedChemicals.has(chemical.name) ? (
                <span className="checkmark">✔</span> // Show checkmark if already added
              ) : (
                <button
                  onClick={() => handleAddToCart(chemical)} // Add to cart
                  className="add-to-cart-button"
                >
                  Add to Cart
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
