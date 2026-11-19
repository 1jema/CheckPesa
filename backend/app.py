import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from utils.parser import get_parsed_statement

app = Flask(__name__)
app.config.from_object(Config)

# Configure CORS
CORS(app, resources={r"/*": {"origins": Config.CORS_ALLOWED_ORIGINS}})

@app.route('/process_pdf/', methods=['POST'])
def process_pdf():
    try:
        if 'statement' not in request.files or 'password' not in request.form:
            return jsonify({
                'status': 'error',
                'message': 'Both statement and password are required'
            }), 400

        parsed_file = request.files['statement']
        password = request.form['password']

        transactions_list = get_parsed_statement(parsed_file, password)

        return jsonify({
            'status': 'success',
            'message': 'PDF processed successfully',
            'results': transactions_list
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
