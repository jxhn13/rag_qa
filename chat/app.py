from flask import Flask
from rag_chat import process_chat

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    return process_chat()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
