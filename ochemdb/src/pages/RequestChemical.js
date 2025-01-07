import React, { useState } from "react";
import axios from "axios";
import "./pages.css";
import { stripBasename } from "@remix-run/router";

function RequestChemical() {
  const [chemical, setChemical] = useState("");
  const [formula, setFormula] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://127.0.0.1:5000/chemical/request", {
        type: "add",
        chemical: {
          name: chemical,
          formula: formula,
        },
      })
      .then((response) => {
        console.log("Data Submitted Successfuly", response.data);
        setChemical("");
        setFormula("");
      })
      .catch((error) => {
        console.error("Error Submitting Data", error);
      });
  };

  return (
    <>
      <h1>Request A Chemical</h1>
      <p className="desc">
        If we did not have a chemical that you were looking for, please input
        the name or formula, and we will update it ASAP
      </p>
      <p className="desc">
        If you want it updated faster, send an email to {""}
        <a
          href="mailto:aadithrowacct@gmail.com?subject=Chemical%20Request"
          style={{ textDecoration: "none", color: "blue" }}
        >
          aadithrowacct@gmail.com
        </a>
      </p>

      <form onSubmit={handleSubmit} className="request">
        <input
          type="text"
          value={chemical}
          onChange={(e) => setChemical(e.target.value)}
          placeholder="Chemical Name"
        />
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Chemical Formula"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default RequestChemical;
