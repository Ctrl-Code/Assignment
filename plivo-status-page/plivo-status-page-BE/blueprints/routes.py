from flask import jsonify, Blueprint
from utils.validate_flask_request import validate_flask_request
from handlers.common.authentication import Authentication_Handler
from handlers.admin import Admin_Handler
from handlers.common.user import User_Handler
from handlers.services import Services_Handler
from handlers.public import Public_Handler

status_page_bp = Blueprint('status_page', __name__)

class Routes:
    def __init__(self):
        pass
    
    @status_page_bp.route('/login', methods=["POST"])
    @validate_flask_request(payload_jwt=False)
    def login(data, error):
        if error:
            return jsonify(error)
        return Authentication_Handler().login(data)
    
    @status_page_bp.route('/set-org', methods=["POST"])
    @validate_flask_request()
    def set_organization(data, error):
        if error:
            return jsonify(error)
        return Admin_Handler().set_organization(data)
    
    @status_page_bp.route('/get-user-details', methods=["POST"])
    @validate_flask_request()
    def get_user_details(data, error):
        if error:
            return jsonify(error)
        return User_Handler().get_user_details(data)

    @status_page_bp.route('/add-service-status', methods=["POST"])
    @validate_flask_request()
    def add_service_status(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().add_service_status(data)

    @status_page_bp.route('/add-service', methods=["POST"])
    @validate_flask_request()
    def add_service(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().add_service(data)

    @status_page_bp.route('/get-all-services', methods=["POST"])
    @validate_flask_request(payload_json=False)
    def get_all_services(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().get_all_services(data)

    @status_page_bp.route('/get-all-service-status', methods=["POST"])
    @validate_flask_request(payload_json=False)
    def list_service_statuses(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().get_all_service_statuses(data)
    
    # NOT USED AS FAR AS AWARE
    @status_page_bp.route('/update-service', methods=["POST"])
    @validate_flask_request()
    def update_service(data, error):
        if error:
            return jsonify(error)
        return Admin_Handler().update_organisation_service(data)

class Incident_Routes:
    @status_page_bp.route('/add-incident', methods=["POST"])
    @validate_flask_request()
    def add_incident(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().add_incident(data)
    
    @status_page_bp.route('/get-open-incidents', methods=["POST"])
    @validate_flask_request(payload_json=False)
    def get_open_incidents(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().get_open_incidents(data)
    
    @status_page_bp.route('/toggle-service-maintenance', methods=["POST"])
    @validate_flask_request()
    def toggle_service_maintenance(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().toggle_service_maintenance(data)
    
    @status_page_bp.route('/update-service-status', methods=["POST"])
    @validate_flask_request()
    def update_service_status(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().update_service_status(data)
    
    @status_page_bp.route('/update-incident', methods=["POST"])
    @validate_flask_request()
    def update_incident(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().update_incident(data)
    
    @status_page_bp.route('/resolve-incident', methods=["POST"])
    @validate_flask_request()
    def resolve_incident(data, error):
        if error:
            return jsonify(error)
        return Services_Handler().resolve_incident(data)

class Admin_Routes:
    @status_page_bp.route('/get-team-members', methods=["POST"])
    @validate_flask_request(payload_json=False)
    def get_team_members(data, error):
        if error:
            return jsonify(error)
        return Admin_Handler().get_team_members(data)
    
    @status_page_bp.route('/add-team-member', methods=["POST"])
    @validate_flask_request()
    def add_team_member(data, error):
        if error:
            return jsonify(error)
        return Admin_Handler().add_team_member(data)
    
    @status_page_bp.route('/update-team-member', methods=["POST"])
    @validate_flask_request()
    def update_team_member(data, error):
        if error:
            return jsonify(error)
        return Admin_Handler().update_team_member(data)

class Public_Routes:
    @status_page_bp.route('/get-public-page-services', methods=["POST"])
    @validate_flask_request(payload_json=False, payload_jwt=False)
    def get_public_page_services(data, error):
        if error:
            return jsonify(error)
        return Public_Handler().get_public_page_services(data)
    
    @status_page_bp.route('/get-public-page-incidents', methods=["POST"])
    @validate_flask_request(payload_jwt=False)
    def get_public_page_incidents(data, error):
        if error:
            return jsonify(error)
        return Public_Handler().get_public_page_incidents(data)
    
    @status_page_bp.route('/get-public-page-incident-updates', methods=["POST"])
    @validate_flask_request(payload_jwt=False)
    def get_public_page_incident_updates(data, error):
        if error:
            return jsonify(error)
        return Public_Handler().get_public_page_incident_updates(data)
    
    @status_page_bp.route('/get-public-page-service-status-updates', methods=["POST"])
    @validate_flask_request(payload_jwt=False)
    def get_public_page_service_status_updates(data, error):
        if error:
            return jsonify(error)
        return Public_Handler().get_public_page_service_status_updates(data)