from flask import Blueprint, jsonify, request, send_file
import pandas as pd
from io import BytesIO

# Create a Flask Blueprint
table_routes = Blueprint("table_routes", __name__)

# Route to generate the table dynamically from cart data
@table_routes.route('/generate-table', methods=['POST', 'OPTIONS'])
def generate_table():
    try:
        print("Request method:", request.method)
        if request.method == "OPTIONS":
            print("Handling OPTIONS request")
            return jsonify({"message": "Preflight request successful"}), 200

        cart_data = request.json
        print("Received cart data:", cart_data)

        # Extract the cart items from the JSON
        if not cart_data or 'cart' not in cart_data:
            print("No cart data provided")
            return jsonify({"error": "No cart data provided"}), 400

        items = cart_data['cart']  # Extract the list of cart items

        # Prepare the table with the required columns
        table = []
        for item in items:
            print("Processing item:", item)
            table.append({
                "Name": item.get("name", "N/A"),
                "Molecular Weight": item.get("molecular_weight", "N/A"),
                "mmol": 0,  # Default value (can be modified by the user)
                "Equivalents": 1,  # Default value (can be modified by the user)
                "Melting Point/Boiling Point": item.get("melting_boiling_point", "N/A"),
                "Density": item.get("density", "N/A"),
                "Hazards": item.get("hazards", "None")
            })

        print("Received cart data:", request.json)
        print("Generated table:", table)
        return jsonify(table), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Route to export the table as an Excel file
@table_routes.route('/export-table', methods=['POST'])
def export_table():
    try:
        # Receive table data from frontend
        table_data = request.json

        # Check if data exists
        if not table_data:
            return jsonify({"error": "No table data provided"}), 400

        # Convert the data to a Pandas DataFrame
        df = pd.DataFrame(table_data)

        # Create an Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Table')
            writer.save()

        # Reset the file pointer to the beginning
        output.seek(0)

        # Send the Excel file to the user as a downlo
        return send_file(output, download_name="table.xlsx", as_attachment=True)

    except Exception as e:
        return jsonify({"error": f"An error occurred while exporting: {str(e)}"}), 500
