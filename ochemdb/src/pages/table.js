import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TablePage.css"; // Add styles for the table
import { useCart } from "../CartContext";

export default function TablePage() {
  const { cart } = useCart(); // Access cart data from context
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch table data from backend
  const generateTable = async () => {
    if (cart.length === 0) {
      alert("table.jsCart is empty! Please add items to the cart.");
      return;
    }
    console.log("Table Data:", tableData);
    console.log("Cart contents:", cart);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-table",
        { cart }
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error generating table:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    generateTable();
  }, []);

  // Handle changes to editable fields
  const handleFieldChange = (index, field, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][field] = value;
    setTableData(updatedTableData);
  };

  // Download table as Excel
  const downloadTable = async () => {
    if (tableData.length === 0) {
      alert("No table data to download!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/export-table",
        tableData,
        { responseType: "blob" } // Ensure file response type
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ChemicalTable.pdf"); // Set filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting table:", error);
      alert("Failed to download table.");
    }
  };

  return (
    <div className="table-page">
      {tableData.length > 0 && (
        <div>
          <table className="chemical-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Molecular Weight(g/mol)</th>
                <th>mmol</th>
                <th>Equivalents</th>
                <th>Melting/Boiling Point</th>
                <th>Density</th>
                <th>Hazards</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.Name}</td>
                  <td>{row["Molecular Weight"]}</td>
                  <td>
                    <input
                      type="number"
                      value={row.mmol}
                      onChange={(e) =>
                        handleFieldChange(index, "mmol", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.Equivalents}
                      onChange={(e) =>
                        handleFieldChange(index, "Equivalents", e.target.value)
                      }
                    />
                  </td>
                  <td>{row["Melting Point/Boiling Point"]}</td>
                  <td>{row.Density}</td>
                  <td>
                    {Array.isArray(row.Hazards)
                      ? row.Hazards.map((hazard, i) => (
                          <span key={i}>
                            {hazard}
                            <br />
                          </span>
                        ))
                      : row.Hazards}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={downloadTable} className="download-table-button">
            Download Table as PDF
          </button>
        </div>
      )}
    </div>
  );
}
