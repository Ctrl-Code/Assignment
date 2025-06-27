from flask import request
from utils.jwt_util import JWTUtil
from config import Config
from utils.error_codes import ErrorCodes

def get_payload_from_jwt():
    jwt_status = dict()
    token = request.headers.get("Authorization", "").replace("Bearer ", "").strip()
    if not token:
        jwt_status["error"] = "No token provided"
        jwt_status["error_code"] = ErrorCodes.TOKEN_MISSING
        jwt_status["status_code"] = 401
        return jwt_status
    
    jwt_util = JWTUtil(Config.JWT_SECRET_KEY)
    validated_token = jwt_util.validate_jwt(token)
    
    if validated_token["error"]:
        jwt_status["error"] = validated_token["error"]
        jwt_status["error_code"] = ErrorCodes.TOKEN_INVALID
        jwt_status["status_code"] = 401

    if validated_token["is_expired"]:
        jwt_status["error"] = "Token expired"
        jwt_status["error_code"] = ErrorCodes.TOKEN_EXPIRED
        jwt_status["status_code"] = 401

    if validated_token["decoded"]:
        jwt_status["payload"] = validated_token["decoded"] 
        jwt_status["status_code"] = 200

    return jwt_status
