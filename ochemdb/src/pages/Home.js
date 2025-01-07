import { useState } from "react";
import axios from "axios";
import SearchBar from "../SearchBar";
import logo from "../pictures/OChemDB.png";

export default function Home() {
  const [chemical, setChemical] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/chemical/${query}`
      );
      console.log("API Response:", response.data);
      console.log("Chemical object:", chemical);
      console.log("Density:", chemical?.density);
      console.log("Safety: ", chemical?.safety);
      setChemical(response.data);
      setError(null);
    } catch (err) {
      setError("Chemical not found");
      setChemical(null);
    }
  };

  return (
    <>
      <div className="searchbar">
        <h2 className="title">OChem Database</h2>
        <SearchBar onSearch={handleSearch} />
        {error && <p>{error}</p>}
        {chemical && (
          <div>
            <h2>{chemical.name}</h2>
            <p>Formula: {chemical.formula}</p>
            <p>Molecular Weight: {chemical.molWeight}</p>
            <p>Melting Point: {chemical.meltingPoint}</p>
            <p>Boiling Point: {chemical.boilingPoint}</p>
            <p>Density: {chemical.Density}</p>
            <p className="safety">
              Safety:{" "}
              {Array.isArray(chemical.Safety) && chemical.Safety.length > 0 ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: chemical.Safety.join("<br />"),
                  }}
                />
              ) : (
                "Not Available"
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
