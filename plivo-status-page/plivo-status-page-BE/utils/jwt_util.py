import jwt
import time
from datetime import datetime, timedelta

class JWTUtil:
    def __init__(self, secret_key, expiry=3600):
        self.secret_key = secret_key
        self.algorithm = "HS256"
        self.EXPIRY = expiry
    
    def encode_payload(self, payload: dict) -> str:
        # Add expiration time to the payload
        payload['exp'] = int(time.time()) + self.EXPIRY
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def validate_jwt(self, token: str) -> dict:
        try:
            return {
                "is_expired": False,
                "decoded": jwt.decode(token, self.secret_key, algorithms=[self.algorithm]),
                "error": ""
            }
        except jwt.ExpiredSignatureError:
            return {
                "is_expired": True,
                "decoded": {},
                "error": "Token expired!"
            }
        except jwt.InvalidTokenError:
            return {
                "is_expired": False,
                "decoded": {},
                "error": "Invalid token!"
            }
        except Exception as e:
            return {
                "is_expired": False,
                "decoded": {},
                "error": str(e)
            }

    def decode_jwt(self, token: str) -> dict:
        # Validate the token first
        validation_result = self.validate_jwt(token)
        
        # If the token is not expired, return the validation result
        if not validation_result["is_expired"]:
            del validation_result["is_expired"]
            return validation_result
        
        # If the token is expired, try to regenerate it
        try:
            # Decode the expired token to extract the payload
            decoded_payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm], options={"verify_exp": False})
            
            # Remove the expired 'exp' field
            if 'exp' in decoded_payload:
                del decoded_payload['exp']
            
            # Regenerate the token with a new expiration time
            new_token = self.encode_payload(decoded_payload)
            
            # Validate and decode the new token
            new_validation_result = self.validate_jwt(new_token)
            del new_validation_result["is_expired"]
            
            # Add the regenerated token to the result
            new_validation_result["regenerated_token"] = new_token
            
            return new_validation_result
        
        except Exception as e:
            return {
                "decoded": {},
                "error": f"Decoding failed: {str(e)}",
                "regenerated_token": ""
            } 