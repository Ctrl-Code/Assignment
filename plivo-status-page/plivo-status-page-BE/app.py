from flask import Flask
from flask_cors import CORS
from blueprints.service_up import service_up_bp
from blueprints.routes import status_page_bp

app = Flask(__name__)

# Since frontend is running on localhost:3000, we need to allow requests from it
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://ctrl-code-assignments.vercel.app"]}})

app.register_blueprint(service_up_bp, url_prefix ='/service-up')
app.register_blueprint(status_page_bp, url_prefix ='/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)