from flask import jsonify
import secrets
import time
import smtplib
from email.mime.text import MIMEText
import re
from email_validator import validate_email, EmailNotValidError


users = {}
user_mails = {}
reset_tokens = {}


def signup_user(username, password, email):
    if not validate_username(username):
        return jsonify({"success": False, "message": "Invalid username. Please follow the specifications."})
    
    if not validate_password(password):
        return jsonify({"success": False, "message": "Invalid password. Please follow the specifications."})

    if not validate_email_address(email):
        return jsonify({"success": False, "message": "Invalid email format."})
    
    if username in users:
        return jsonify({"success": False, "message": "User already exists. Please go to login."})
    
    users[username] = password
    user_mails[username] = email
    return jsonify({"success": True, "message": "User registered successfully."})


def validate_username(username):
    """
    Usernames must:
    - Be 3-20 characters long
    - Start with a letter (a-z, A-Z)
    - Contain only letters, numbers, periods
    """
    pattern = r'^[a-zA-Z][a-zA-Z0-9.]{2,19}$'
    if re.match(pattern, username):
        return True
    return False


def validate_password(password):
    """
    Passwords must:
    - Be at least 8 characters long
    - Contain at least one uppercase letter
    - Contain at least one lowercase letter
    - Contain at least one digit
    """
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'[0-9]', password):
        return False
    return True


def validate_email_address(email):
    try:
        validate_email(email)
        return True
    except EmailNotValidError as e:
        print(str(e))
        return False


def login_user(username, password):
    if username not in users:
        return jsonify({"success": False, "message": "User does not exist. Please sign up first."})
    
    if users[username] != password:
        return jsonify({"success": False, "message": "Incorrect password."})
    
    return jsonify({"success": True, "message": "Login successful."})


def delete(username, password):
    if username not in users:
        return jsonify({"success": False, "message": "User does not exist."})
    
    if users[username] != password:
        return jsonify({"success": False, "message": "Incorrect password."})
    
    del users[username]
    del user_mails[username]
    return jsonify({"success": True, "message": "User account deleted successfully."})


def forget_pass(username, email):
    if username not in users:
        return jsonify({"success": False, "message": "User does not exist."})
    
    if user_mails[username] != email:
        return jsonify({"success": False, "message": "Incorrect email."})
    
    token = secrets.token_urlsafe(32)
    
    reset_tokens[token] = {'username': username, 'expires': time.time() + 300}  
        
    if send_reset_email(email, token):
        return jsonify({"success": True, "message": "Password reset token has been sent to your email."})
    else:
        return jsonify({"success": False, "message": "Failed to send email. Contact developer to fix issue."})
    

def send_reset_email(email, token):
    sender_email = "tn8332742@gmail.com"
    sender_password = "trhl bcjw aezo fgom"
    receiver_email = email

    msg = MIMEText(f"Token to reset password: {token}")
    msg['Subject'] = "Password Reset Request"
    msg['From'] = sender_email
    msg['To'] = receiver_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
    return True


def reset(token, new_password):
    if not validate_password(new_password):
        return jsonify({"success": False, "message": "Invalid password. Please follow the specifications."})

    if token not in reset_tokens or time.time() > reset_tokens[token]['expires']:
        return jsonify({"success": False, "message": "Invalid or expired token."})
    
    username = reset_tokens[token]['username']
    users[username] = new_password
    del reset_tokens[token]  
    
    return jsonify({"success": True, "message": "Password has been reset successfully."})   