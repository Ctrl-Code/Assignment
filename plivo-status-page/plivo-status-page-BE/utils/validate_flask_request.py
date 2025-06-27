from functools import wraps
from flask import request
from utils.error_codes import ErrorCodes
from utils.authorization import get_payload_from_jwt

def validate_flask_request(payload_json = True, payload_jwt = True):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            error = {}
            
            if not request.is_json:
                error["error"] = "Request must be JSON"
                error["error_code"] = ErrorCodes.REQUEST_MUST_BE_JSON
                error["status_code"] = 415
                return func({}, error, *args, **kwargs)
            
            try:
                data = request.get_json()
            except Exception as e:
                error["error"] = f"Invalid JSON: {str(e)}"
                error["error_code"] = ErrorCodes.INVALID_JSON
                error["status_code"] = 400
                return func({}, error, *args, **kwargs)
            
            if not data and payload_json:
                error["error"] = "No data provided"
                error["error_code"] = ErrorCodes.NO_DATA_PROVIDED
                error["status_code"] = 400
                return func({},error, *args, **kwargs)
            
            if payload_jwt:
                jwt_data = get_payload_from_jwt()
                if jwt_data.get("error"):
                    error["error"] = jwt_data["error"]
                    error["error_code"] = jwt_data["error_code"]
                    error["status_code"] = jwt_data["status_code"]
                    return func({}, error, *args, **kwargs)
                
                if jwt_data.get("payload"):
                    data["jwt"] = jwt_data["payload"]
            
            print(f"Validated_data: {data}")
            return func(data, error, *args, **kwargs)
        return wrapper
    return decorator
