from flask import Blueprint, request, jsonify, send_file
from reportlab.lib.pagesizes import letter, landscape, A3
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from io import BytesIO


# Create a Flask Blueprint
table_routes = Blueprint("table_routes", __name__)

# Route to generate the table dynamically from cart data
@table_routes.route('/generate-table', methods=['POST', 'OPTIONS'])
def generate_table():
    try:

        if request.method == "OPTIONS":
            print("Handling OPTIONS request")
            return jsonify({"message": "Preflight request successful"}), 200

        cart_data = request.json

        # Extract the cart items from the JSON
        if not cart_data or 'cart' not in cart_data:
            print("No cart data provided")
            return jsonify({"error": ")No cart data provided"}), 400

        items = cart_data['cart']  # Extract the list of cart items
        print("Received Data:", cart_data)
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

        return jsonify(table), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Route to export the table as an Excel file
@table_routes.route('/export-table', methods=['POST'])
def export_table():
    try:
        table_data = request.json

        if not table_data or len(table_data) == 0:
            return jsonify({"error": "No table data provided"}), 400

        pdf_output = BytesIO()
        pdf = SimpleDocTemplate(pdf_output, pagesize=A3)
        elements = []

        styles = getSampleStyleSheet()
        
        # **Ensure the correct column order**
        column_order = ["Name", "Molecular Weight (g/mol)", "mmol", "Equivalents", 
                        "Melting/Boiling Point", "Density", "Hazards"]

        # **Rearrange data based on this order**
        data = [column_order]  # Add header row
        for row in table_data:
            formatted_row = [
                Paragraph(str(row.get("Name", "N/A")), styles["BodyText"]),
                Paragraph(str(row.get("Molecular Weight", "N/A")), styles["BodyText"]),
                Paragraph(str(row.get("mmol", "0")), styles["BodyText"]),
                Paragraph(str(row.get("Equivalents", "1")), styles["BodyText"]),
                Paragraph(str(row.get("Melting Point/Boiling Point", "N/A")), styles["BodyText"]),
                Paragraph(str(row.get("Density", "N/A")), styles["BodyText"]),
                Paragraph(str(row.get("Hazards", "None")), styles["BodyText"])
            ]
            data.append(formatted_row)

        # **Set consistent column widths**
        col_widths = [120, 120, 60, 90, 150, 90, 180]  # Adjust width for each column

        # **Create and style the table**
        table = Table(data, colWidths=col_widths)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.blue),  # Header background
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),  # Header text color
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Center-align text
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Bold headers
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),  # Padding for header
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),  # Alternating row colors
            ('GRID', (0, 0), (-1, -1), 1, colors.black),  # Grid lines
            ('FONTSIZE', (0, 0), (-1, -1), 10)  # Font size
        ]))

        elements.append(table)
        pdf.build(elements)
        pdf_output.seek(0)

        return send_file(pdf_output, download_name="chemical_table.pdf", as_attachment=True)
    
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")  # Debugging
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500