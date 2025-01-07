#1 Import all required libraries
from flask import Flask, jsonify, send_from_directory, request
#Flask is used to create main class for app
#Jsonify is used to send responses to client, converts python dict to json
#request is an object that has all data sent from a client to a server
#SFD is used to send a file from a directory

from pymongo import MongoClient
#Pymongo library, Mongo Client connects to MongoDB

import logging
#logging to a file, records errors and when chemicals will be requested

from datetime import datetime
#USed to log time that client sends request
from flask_cors import CORS

from flask_mail import Mail, Message






#Creating the FLASK app
app = Flask(__name__, static_folder='static')
CORS(app)

#Creating log file
logging.basicConfig(filename= 'app.log', filemode='a', format='%(name)s - %(levelname)s - %(message)s')
#filename: name of the file
#filemode: 'a' messages are appended to the log file
#format is the style that file is made
logging.info('Flask app started')


#Connecting MongoDb/chemicals
client = MongoClient('mongodb://localhost:27017')
db = client['ochemDB']
collection = db['chemicals']


#Get Route
@app.route('/chemical/<query>', methods=['GET'])
def get_chemical(query): 
    chemical = collection.find_one(
        {"$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"formula": {"$regex": query, "$options": "i"}}
        ]},
        {"_id": 0}
    )

    if chemical:
        return jsonify(chemical)
    else:
        return jsonify({"error": "No Chemical Found"}), 404
    
# Add the following route for suggestions
@app.route('/chemical/suggestions/<query>', methods=['GET'])
def get_suggestions(query):
    try:
        chemicals = collection.find(
            {"name": {"$regex": query, "$options": "i"}},
            {"_id": 0, "name": 1}  # Only fetch the chemical names
        ).limit(7)  # Limit the suggestions to 5 results
        suggestions = list(chemicals)  # Convert cursor to list
        print("Suggestions sent to frontend:", suggestions)
        return jsonify(suggestions), 200
    except Exception as e:
        logging.error(f"Error fetching suggestions: {e}")
        return jsonify({"error": "Error fetching suggestions"}), 500

    

@app.route('/chemical/request', methods=['POST'])
def request_chemical():
     # Define a route that handles POST requests to /chemical/request.
    try:
        data = request.json
         # Get the JSON data from the request.

        if not data:
            return jsonify({"error": "Invalid input data"}), 400
            # If no data is provided, return a 400 error with a JSON error message.

        if 'type' not in data or 'chemical' not in data:
            return jsonify({"error": "Missing required fields"}), 400
        # If 'type' or 'chemical' fields are missing, return a 400 error with a JSON error message.
        
        chemical_data = data['chemical']
        if 'name' not in chemical_data:
            return jsonify({"error": "Incomplete chemical data"}), 400
        # If the 'name' field is missing in the 'chemical' data, return a 400 error with a JSON error message.

        data['timestamp'] = datetime.utcnow().isoformat()


        result = db['requests'].insert_one(data)
         # Insert the request data into the 'requests' collection in MongoDB.

        if result.inserted_id:
            logging.info(f"Request inserted with id: {result.inserted_id}")
            return jsonify({"success": True, "request_id":str(result.inserted_id)}), 201
        # If the insertion is successful, log the inserted ID and return a 201 status with a success message.

        else:
            logging.error("Failed to insert the request into the database")
            return jsonify({"error": "Failed to process request"}), 500
         # If the insertion fails, log an error message and return a 500 error with a JSON error message.

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred"}), 500
     # If an exception occurs, log the error and return a 500 error with a JSON error message.

#7 Error Handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404
# Define a handler for 404 errors, returning a JSON error message.

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal Server Error, please try again later"}), 500
    # Define a handler for 500 errors, returning a JSON error message.


@app.errorhandler(Exception)
def handle_exception(error):
    app.logger.error(f"Unhandled exception: {error}")
    return jsonify({"error": "A server error occurred"}), 500
    # Define a handler for unhandled exceptions, logging the error and returning a JSON error message.


#8 Static File Route
@app.route('/')    
def index():
    return send_from_directory(app.static_folder, 'index.html')
# Define a route to serve the index.html file from the static folder when the root URL is accessed.




    
#Running the app
if __name__ == '__main__':
    app.run(debug=True)
