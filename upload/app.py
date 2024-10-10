from flask import Flask
from flask_cors import CORS
from upload import handle_upload

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload():
    return handle_upload()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
