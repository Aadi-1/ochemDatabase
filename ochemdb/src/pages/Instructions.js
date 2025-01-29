import React from "react";
import "./pages.css";

function Instructions() {
  return (
    <div className="instructions-container">
      <h1> Instructions: How to Use the OChem Database</h1>

      <section>
        <h2>🔍 Searching for Chemicals</h2>
        <p>
          Type the <strong>chemical name</strong> or <strong>formula</strong> in
          the search bar. If a chemical is missing, check spelling or request
          it.
        </p>
      </section>

      <section>
        <h2>📋 Viewing Chemical Details</h2>
        <p>
          Once selected, the chemical's properties will be displayed, including:
        </p>
        <p>
          <strong>Formula</strong>
        </p>
        <p>
          <strong>Molecular Weight</strong>
        </p>
        <p>
          <strong>Melting & Boiling Points</strong>
        </p>
        <p>
          <strong>Density</strong>
        </p>
        <p>
          <strong>Hazards & Safety Information</strong>
        </p>
      </section>

      <section>
        <h2>🛒 Adding Chemicals to Cart</h2>
        <p>
          To add a chemical to your cart, click the ➕ button next to the
          chemical name <strong>OR</strong> click Add to Cart in the search bar.
          The chemical will be stored in your cart, visible at the top-right
          corner (🛒). Click the cart icon to view or remove items.
        </p>
      </section>

      <section>
        <h2>📊 Generating a Table</h2>
        <p>
          Click <strong>"Generate Table"</strong> in the navigation bar. A table
          will automatically generate if your cart contains chemicals.
        </p>
      </section>

      <section>
        <h2>📥 Downloading the Table</h2>
        <p>
          To download your table as a PDF, click{" "}
          <strong>"Download Table as PDF"</strong>. The file will download as{" "}
          <strong>ChemicalTable.pdf</strong>. Open the file to view a formatted
          table.
        </p>
      </section>

      <section>
        <h2>📢 Requesting a Chemical</h2>
        <p>
          If a chemical is missing, go to the{" "}
          <strong>"Request A Chemical"</strong> page. Fill in the chemical name
          and additional details, then click <strong>"Submit Request"</strong>{" "}
          to send it to the database team.
        </p>
      </section>

      <section>
        <h2>🎯 Need Help?</h2>
        <p>
          If you encounter issues, ensure your{" "}
          <strong>cart is not empty</strong> before generating a table. Check
          for <strong>correct spelling</strong> when searching. If that doesn't
          help send an email to{" "}
          <a
            href="mailto:aadithrowacct@gmail.com?subject=Chemical%20Request"
            style={{ textDecoration: "none", color: "blue" }}
          >
            aadithrowacct@gmail.com
          </a>
        </p>
        <p>
          <strong>Enjoy using OChem Database! 🚀</strong>
        </p>
      </section>
    </div>
  );
}

export default Instructions;
