from utils.supabase_util import Supabase_Util

class DB_Details(Supabase_Util):
    def __init__(self):
        pass
    
    def get_db_details(self, jwt_dict):
        try:
            user_details = {}
            organization_details = {}
            member_details = {}

            u_id = jwt_dict.get('u_id')
            o_id = jwt_dict.get('o_id')
            m_id = jwt_dict.get('m_id')

            if u_id:
                user_response = self.supabase.table('ass_psp_users').select('*').eq("u_id", u_id).eq("u_not_deleted", 1).execute()
                if user_response.data:
                    user_details = user_response.data[0]

            if o_id:
                organization_response = self.supabase.table('ass_psp_organizations').select('*').eq("o_id", o_id).eq("o_not_deleted", 1).execute()
                if organization_response.data:
                    organization_details = organization_response.data[0]
            
            if m_id:
                member_response = self.supabase.table('ass_psp_members').select('*').eq("m_id", m_id).eq("m_not_deleted", 1).execute()
                if member_response.data:
                    member_details = member_response.data[0]

            return {
                "u_details": user_details,
                "o_details": organization_details,
                "m_details": member_details
            }
        except Exception as e:
            return {
                "error": str(e)
            }
