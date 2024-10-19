from flask import Flask, request, jsonify

app = Flask(__name__)

# Route to handle GET request
@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Hello from Python backend!"})

# Route to handle POST request (e.g., receiving data from Node.js server)
@app.route('/data', methods=['POST'])
def receive_data():
    # Get JSON data from the request
    data = request.get_json()
    
    # Log or process the data
    print("Data received from Node.js:", data)

    # Respond with a confirmation message
    return jsonify({"message": "Data received", "data": data}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Exposing the API on port 5000

