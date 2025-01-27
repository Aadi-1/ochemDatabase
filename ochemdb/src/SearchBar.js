import React, { useEffect, useState, useRef } from "react";
import "./SearchBar.css";
import { useCart } from "./CartContext";

function SearchBar({ onSearch }) {
  const { cart, addToCart } = useCart();
  const [query, SetQuery] = useState(""); // State for the input value
  const [suggestions, setSuggestions] = useState([]); // State for suggestions list
  const [selectedChemical, setSelectedChemical] = useState(""); // Track the selected chemical
  const [addedChemicals, setAddedChemicals] = useState(new Set()); // Track added chemicals
  const [preventFetch, setPreventFetch] = useState(false); // Flag to prevent fetching
  const suggestionsRef = useRef(null); // Ref to handle click outside

  // Fetch suggestions from the backend when query changes
  useEffect(() => {
    if (preventFetch) {
      console.log("Preventing fetch due to suggestion click");
      setPreventFetch(false); // Reset the flag for future queries
      return; // Exit early
    }

    console.log("Query changed, fetching suggestions:", query);
    if (query.length > 1) {
      fetch(`http://127.0.0.1:5000/chemical/suggestions/${query}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched data:", data);
          setSuggestions(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
        });
    } else {
      setSuggestions([]); // Clear suggestions for short queries
    }
  }, [query]);

  // Hide suggestions when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        console.log("Clicked outside, clearing suggestions");
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
      onSearch(selectedChemical); // Trigger search for selected chemical
    } else {
      onSearch(query); // Trigger search for typed query
    }
    setSuggestions([]); // Clear suggestions
  };

  const handleSuggestionClick = (chemical) => {
    console.log("Clicked suggestion, clearing suggestions:", chemical.name);
    setPreventFetch(true);
    setSelectedChemical(chemical.name);
    SetQuery(chemical.name);
    setSuggestions([]); // Clear suggestions
    console.log("Suggestions cleared after click");
    onSearch(chemical.name);
  };

  const handleAddToCart = async (chemical) => {
    try {
      console.log("Fetching details for chemical:", chemical.name);

      // Fetch full chemical details from the backend
      const response = await fetch(
        `http://127.0.0.1:5000/chemical/${encodeURIComponent(chemical.name)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chemical details");
      }

      const fullDetails = await response.json();
      console.log("Full chemical details fetched:", fullDetails);

      // Prepare the chemical with full properties
      const chemicalWithProperties = {
        name: fullDetails.name || "N/A",
        molecular_weight:
          fullDetails.molWeight || fullDetails.molecular_weight || "N/A", // Correct key
        density: fullDetails.Density || fullDetails.density || "N/A", // Correct key
        melting_boiling_point: `${fullDetails.meltingPoint || "N/A"} / ${
          fullDetails.boilingPoint || "N/A"
        }`, // Combine melting/boiling
        hazards: fullDetails.Safety || [], // Combine array of hazards
      };

      // Add the full details to the cart
      console.log("Passing to addToCart:", chemicalWithProperties);
      addToCart(chemicalWithProperties);
      setAddedChemicals((prev) => new Set(prev).add(chemical.name)); // Mark the chemical as added
    } catch (error) {
      console.error("Error adding chemical to cart:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Trigger search on Enter
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={selectedChemical || query} // Show selected chemical or query
        onChange={(e) => {
          SetQuery(e.target.value); // Update query when typing
          setSelectedChemical(""); // Clear selected chemical when typing
        }}
        onKeyDown={handleKeyDown} // Handle Enter key
        placeholder="Search for Chemical"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
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
