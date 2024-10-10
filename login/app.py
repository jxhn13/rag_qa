from flask import Flask, request, jsonify
from login import login_user, signup_user, delete, forget_pass, reset
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Both username and password are required."})
    
    return login_user(username, password)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({"success": False, "message": "Username, password, and email are all required."})

    return signup_user(username, password, email)

@app.route('/delete_user', methods=['DELETE'])
def delete_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Both username and password are required."})

    return delete(username, password)

@app.route('/forget_password', methods=['PUT'])
def forget_password():
    data = request.json
    username = data.get('username')
    email = data.get('email')

    if not username or not email:
        return jsonify({"success": False, "message": "Both username and email are required."})
    
    return forget_pass(username, email)

@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    new_password = data.get('new_password')
    token = data.get('token')

    if not new_password or not token:
        return jsonify({"success": False, "message": "Both token and new password are required."})
    
    return reset(token, new_password)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
