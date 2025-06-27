from flask import Blueprint, jsonify

service_up_bp = Blueprint('service_up', __name__)

@service_up_bp.route('/')
def service_up():
    return jsonify({"message": "Service is up and running!"})