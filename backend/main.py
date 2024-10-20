import jwt
import os
import json
from flask import Flask, request, jsonify, make_response, redirect, url_for
from flask_cors import CORS
from datetime import datetime, timedelta
from dotenv import load_dotenv
from database_interaction import attempt_login, add_user, add_token, get_user_from_token, update_selected_challenge, update_user_preferences
# from ai import *
# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Use environment variables for secrets
JWT_SECRET = os.getenv('JWT_SECRET')

# Function to generate a JWT for a given user ID
def generate_jwt(user_id):
    # Define the payload for the JWT, including the user ID and expiration time (2 days)
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=2)  # Token expires in 2 days
    }
    # Encode the payload to generate a JWT using the secret key and HS256 algorithm
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    return token

# Function to verify and decode a JWT
def verify_jwt(token):
    try:
        # Decode the token using the secret key and validate it with the HS256 algorithm
        print(f"Fetched: {fetched_hash}, Hash: {hash_pass(password)}")
        decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return decoded  # Return the decoded payload if verification is successful
    except jwt.ExpiredSignatureError:
        return None  # Return None if the token has expired
    except jwt.InvalidTokenError:
        return None  # Return None if the token is invalid

# Route to handle user login
@app.route('/login', methods=['POST'])
def login():
    # Extract username and password from the JSON body of the POST request
    username = request.json.get('username')
    password = request.json.get('password')
    print(f"Got {username} and {password}")    
    # Example validation (replace with actual logic to check user credentials)
    if attempt_login(username, password):
        print(f"[FLASK] Login from {username}")
        user_id = 1  # Replace with actual user ID
        # Generate a JWT for the authenticated user
        token = generate_jwt(user_id)
        add_token(username, token)        
        # Redirect the user to the /personalize route
        return redirect('/personalize')
    else:
        print(f"failed login from {username}")
        # Return a 401 Unauthorized response if the credentials are invalid
        return jsonify({"message": "Invalid credentials"}), 401

# Route to verify the JWT from the user's cookie and return a message
@app.route('/', methods=['GET'])
def index():
    print("Hit index()")
    # Retrieve the 'user_token' from cookies
    user_token = request.cookies.get('user_token')
    # Check if the token exists and is valid
    if user_token and verify_jwt(user_token):
        return jsonify({"message": "Welcome back! You are still logged in."})  # Valid token, user is logged in
    return jsonify({"message": "Hello from Python backend!"})  # No valid token, greet the user

@app.route('/', methods=['POST'])
def make_login():
    # Extract username and password from the JSON body of the POST request
    username = request.json.get('username')
    password = request.json.get('password')
    print(f"Got {username} and {password}")    
    # Example validation (replace with actual logic to check user credentials)
    if add_user(username, password):
        # Create a response to send back to the client
        response = make_response(jsonify({"message": "New user added!"}))
        return response  # Return the response to the client
    else:
        print(f"failed to add user {username}")
        # Return a 401 Unauthorized response if the credentials are invalid
        return jsonify({"message": "Failed to create user"}), 401

@app.route('/preferences', methods=['POST'])
def record_preferences():
    data = request.get_json()
    token = data.get('sessionToken')
    
    # Get username from the token
    username = get_user_from_token(token)
    if not username:
        return jsonify({"message": "Invalid session token"}), 401

    # Extract the selectedInterests object
    selected_interests = data.get('selectedInterests')

    # Convert the selectedInterests to a JSON string to store directly
    preferences_str = json.dumps(selected_interests)

    print(f"[FLASK] {username} preferences: {preferences_str}")

    # Save preferences to the database
    if update_user_preferences(username, preferences_str):
        return jsonify({"message": "Preferences recorded successfully!"}), 200
    else:
        return jsonify({"message": "Failed to record preferences"}), 500



@app.route('/confirmchallenge', methods=['POST'])
def confirmchallenge():
    data = request.get_json()
    session_token = data.get('sessionToken')
    selected_challenge = data.get('selectedChallenge')
    username = get_user_from_token(session_token)
    
    print(f"[FLASK] User {username} accepted {selected_challenge}")
    
    update_selected_challenge(username, selected_challenge)

    response = make_response(jsonify({"message": "Challenge recorded"}))

    return response

@app.route('/get_user', methods=['GET'])
def return_username():
    print("got here 6678")
    session_token = request.headers.get('sessionToken')
    username = get_user_from_token(session_token)
    
    print(f"[FLASK] Sending username {username} from get request")

    response = make_response(jsonify({"username": username}))
    return response

    print

@app.route('/user/<username>/challenge/<int:chal_id>', methods=['POST'])
def update_complete_challenge(username, chal_id):
    session_token = request.headers.get('sessionToken')
    scan_user = get_user_from_token(session_token)

    if(scan_user == 'business'):
        print(f"User {username} verified by {scan_user}")
    else:
        print(f"User {username} not verified by {scan_user}")

    response = make_response(jsonify({"message": "lord may there be peace on earth"}))
    return response

@app.route('/suggestion', methods=['GET'])
def ai_suggestion():
    print("user wants a ai suggestion")

# Start the Flask application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
