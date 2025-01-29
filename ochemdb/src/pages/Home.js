import { useState } from "react";
import axios from "axios";
import SearchBar from "../SearchBar";
import "./Home.css"; // Import the updated CSS
import "./theme.css";
import { useCart } from "../CartContext";

export default function Home() {
  const [chemical, setChemical] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/chemical/${query}`
      );
      console.log("API Response:", response.data);
      setChemical(response.data);
      setError(null);
    } catch (err) {
      setError("Chemical not found");
      setChemical(null);
    }
  };

  return (
    <div className="home-container">
      {/* Search bar */}
      <div className="search-section">
        <h1 className="title">OChem Database</h1>
        <SearchBar onSearch={handleSearch} />
        {error && <p className="error">{error}</p>}
      </div>

      {/* Chemical details card */}
      {chemical && (
        <div className="chemical-card">
          {/* Title and Add-to-Cart Button */}
          <div className="card-header">
            <h2>{chemical.name}</h2>
            <button
              className="cart-card-button"
              onClick={() => {
                const formattedChemical = {
                  name: chemical.name || "N/A",
                  molecular_weight: chemical.molWeight || "N/A",
                  density: chemical.Density || "N/A",
                  melting_boiling_point: `${chemical.meltingPoint || "N/A"} / ${
                    chemical.boilingPoint || "N/A"
                  }`,
                  hazards: chemical.Safety || [],
                };

                console.log("Formatted chemical for cart:", formattedChemical);
                addToCart(formattedChemical);
              }}
              title="Add to Cart"
            >
              +
            </button>
          </div>

          {/* Image + Properties (Side by Side) */}
          <div className="card-content">
            {/* Chemical Image */}
            <div className="chemical-image-container">
              <img
                src={chemical.image_url}
                alt={chemical.name}
                className="chemical-image"
              />
            </div>

            {/* Chemical Properties */}
            <div className="chemical-info">
              <p className="info">
                <span>Formula:</span> {chemical.formula}
              </p>
              <p className="info">
                <span>Molecular Weight:</span> {chemical.molWeight} g/mol
              </p>
              <p className="info">
                <span>Melting Point:</span> {chemical.meltingPoint}
              </p>
              <p className="info">
                <span>Boiling Point:</span> {chemical.boilingPoint}
              </p>
              <p className="info">
                <span>Density:</span> {chemical.Density}
              </p>
            </div>
          </div>

          {/* Safety Information (Placed Below) */}
          <div className="safety-container">
            <div className="safety">
              <h3>Safety Information:</h3>
              {Array.isArray(chemical.Safety) && chemical.Safety.length > 0 ? (
                <ul>
                  {chemical.Safety.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>Not Available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
