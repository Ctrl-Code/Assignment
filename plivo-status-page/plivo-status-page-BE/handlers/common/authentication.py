from utils.supabase_util import Supabase_Util
from flask import jsonify
from utils.jwt_util import JWTUtil
from config import Config

class Authentication_Handler(Supabase_Util):
    def __init__(self):
        self.jwt_util = JWTUtil(Config.JWT_SECRET_KEY)
    
    def login(self, data):
        try:
            print(f"login, data: {data}")
            u_email = data['email']
            u_verified = data['verified']
            u_avatar_url = data['picture']
            u_ext_id = data['external_id']
            u_first_name = data['first_name']
            u_last_name = data['last_name']
            
            response = self.supabase.table('ass_psp_users').select("u_email, u_id").eq("u_email", u_email).execute()
            
            user_id = None
            message = ""
            login_flow = False
            status_code = 200

            if response.data:
                user_id = response.data[0]['u_id']
                message = "User already exists"
                login_flow = True
            else:
                response = self.supabase.table('ass_psp_users').insert({
                        "u_email": u_email,
                        "u_verified": u_verified,
                        "u_avatar_url": u_avatar_url,
                        "u_ext_id": u_ext_id,
                        "u_first_name": u_first_name,
                        "u_last_name": u_last_name,
                        "u_verified": u_verified,
                    }).execute()
                if response.data:
                    user_id = response.data[0]['u_id']
                    message = "User created successfully"
                    login_flow = False
                else:
                    return jsonify({
                        "message": "User creation failed",
                    }), 400
            
            # Generate JWT token if user_id is available
            if user_id:
                # Fetch organization ID and member role
                member_response = self.supabase.table('ass_psp_members').select(
                    "m_id, ass_psp_organizations!inner(o_id)"
                ).eq("m_u_id", user_id).eq("m_not_deleted", 1).execute()

                organization_id = None
                member_id = None

                if member_response.data and len(member_response.data) > 0:
                    member_data = member_response.data[0]
                    member_id = member_data.get('m_id')
                    if 'ass_psp_organizations' in member_data and member_data['ass_psp_organizations']:
                        # If it's a dict (single related object), access directly. If it's a list, take the first element.
                        if isinstance(member_data['ass_psp_organizations'], list):
                            if member_data['ass_psp_organizations']: # Ensure list is not empty
                                organization_id = member_data['ass_psp_organizations'][0].get('o_id')
                        else: # Assume it's a dictionary if not a list
                            organization_id = member_data['ass_psp_organizations'].get('o_id')
                
                payload = {"u_id": user_id}
                payload["o_id"] = organization_id if organization_id else ""
                payload["m_id"] = member_id if member_id else ""

                token = self.jwt_util.encode_payload(payload)

                return jsonify({
                    "message": message,
                    "id": user_id,
                    "login": login_flow,
                    "token": token,
                    "organization_id": organization_id, # Optional: return in response for immediate client use
                    "member_id": member_id          # Optional: return in response for immediate client use
                }), status_code
            else:
                # This case should ideally not be reached if user_id is always set before this block
                return jsonify({
                    "message": "An unexpected error occurred during user processing.",
                }), 500
        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
