from utils.supabase_util import Supabase_Util
from flask import jsonify

class User_Handler(Supabase_Util):
    def __init__(self):
        pass
    
    def get_user_details(self, data):
        try:
            print(f"get_user_details, data: {data}")
            userId = data.get('userId')
            if not userId:
                return jsonify({
                    "message": "User ID is required",
                }), 400
            return_details = {}            
            user_details = self.supabase.table('ass_psp_users').select("id:u_id, email:u_email, firstName: u_first_name, lastName:u_last_name, picture: u_avatar_url").eq("u_id", userId).eq("u_not_deleted", 1).execute()
            
            # Query ass_psp_members table and join with ass_psp_organizations to get organization and role details
            member_and_org_details = self.supabase.table('ass_psp_members').select('role: m_role, ass_psp_organizations!inner(orgId: o_id, orgName: o_name)').eq('m_u_id', userId).execute()

            if user_details.data:
                return_details['user'] = user_details.data[0]

            if member_and_org_details.data:
                # Assuming a user belongs to at most one organization with a role relevant here
                org_info = member_and_org_details.data[0]['ass_psp_organizations']
                role_info = member_and_org_details.data[0]['role']
                
                # Combine into the desired 'org' dictionary
                return_details['org'] = {
                    'orgId': org_info['orgId'],
                    'orgName': org_info['orgName'],
                    'role': role_info
                }

            if not return_details:
                return jsonify({
                    "message": "User not found",
                }), 404
            return jsonify({
                "message": "User details fetched successfully",
                "data": return_details,
            }), 200
        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
