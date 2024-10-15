from flask import Flask
from flask_cors import CORS 
from chat import process_chat

app = Flask(__name__)
CORS(app)  

app.add_url_rule('/chat', view_func=process_chat, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True, port=5003)
