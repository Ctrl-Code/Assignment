from utils.supabase_util import Supabase_Util
from flask import jsonify
from handlers.common.db_details import DB_Details
from constants import Constants

class Admin_Handler(Supabase_Util):
    def __init__(self):
        pass
    
    def set_organization(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))
            u_id = db_details.get('u_details', {}).get('u_id')

            o_name = data['orgName']
            
            # Check if the user is already an admin of any organization
            admin_check_response = self.supabase.table('ass_psp_members').select("m_role").eq("m_u_id", u_id).eq("m_role", Constants.ROLE_ADMIN).execute()
            
            if admin_check_response.data:
                return jsonify({
                    "message": "Organization already exists for this user (as admin).",
                }), 400
            
            # Check if the user is already a member (non-admin) of any organization
            member_check_response = self.supabase.table('ass_psp_members').select("m_role").eq("m_u_id", u_id).execute()
            if member_check_response.data:
                # If user is a member (and not an admin, as checked above), they don't have access to create a new organization.
                return jsonify({
                    "message": "You are already a member of an organization and do not have access to create a new one.",
                }), 403

            response = self.supabase.table('ass_psp_organizations').insert({
                "o_u_id": u_id,
                "o_name": o_name,
            }).execute()

            if response.data:
                organization_id = response.data[0]['o_id']
                
                member_response = self.supabase.table('ass_psp_members').insert({
                    "m_o_id": organization_id,
                    "m_u_id": u_id,
                    "m_role": Constants.ROLE_ADMIN
                }).execute()
                if member_response.data:
                    return jsonify({
                        "message": "Inserted organization and created admin member successfully",
                        "id": organization_id,
                    }), 200
                else:
                    # Optionally, you might want to delete the created organization if member creation fails
                    return jsonify({
                        "message": "Organization created, but admin member creation failed",
                    }), 400
            else:
                return jsonify({
                    "message": "Organization creation failed",
                }), 400
            
        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    # NOT USED
    def update_organisation_service(self, data):
        try:
            print(f"update_organisation_service, data: {data}")
            userId = data.get('userId')
            serviceId = data.get('serviceId')
            serviceStatusId = data.get('serviceStatusId')
            serviceName = data.get('serviceName')
            
            if not userId:
                return jsonify({
                    "message": "User ID (userId) is required",
                }), 400
            
            if not serviceId:
                return jsonify({
                    "message": "Service ID (serviceId) is required",
                }), 400
            
            if not serviceName:
                return jsonify({
                    "message": "Service Name (serviceName) is required",
                }), 400
            
            if not serviceStatusId:
                return jsonify({
                    "message": "Service Status ID (serviceStatusId) is required",
                }), 400
            
            # Check if the user is an admin of any organization and get their organization ID
            admin_org_response = self.supabase.table('ass_psp_members').select("m_o_id").eq("m_u_id", userId).eq("m_role", "admin").execute()
            
            if not admin_org_response.data:
                return jsonify({
                    "message": "User is not an admin of any organization or organization not found",
                }), 403
            
            org_id = admin_org_response.data[0]['m_o_id']

            # Update the service name
            response = self.supabase.table('ass_psp_services').update({
                "s_name": serviceName,
                "s_service_status_id": serviceStatusId,
            }).eq("s_id", serviceId).eq("s_o_id", org_id).execute()

            if response.data:
                return jsonify({
                    "message": "Service updated successfully",
                    "id": response.data[0]['s_id'],
                }), 200
            else:
                return jsonify({
                    "message": "Failed to update service",
                }), 400

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def get_team_members(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))
            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            m_role = db_details.get('m_details', {}).get('m_role')

            if not u_id or not o_id or not m_role:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403
            
            if m_role != Constants.ROLE_ADMIN:
                return jsonify({
                    "message": "User is not an admin of the organization",
                }), 403
            
            # get all members of the organization sharing the same organization id joined with users table to get email and name details
            members_response = self.supabase.table('ass_psp_members').select("id:m_id, role:m_role, details:ass_psp_users(email:u_email, firstName:u_first_name, lastName:u_last_name)").eq("m_o_id", o_id).eq("m_not_deleted", 1).execute()
            # to return data as a list of dictionaries with keys being id, fullName, email, role
            members_data = []
            for member in members_response.data:
                # remove NULL FROM FIRST NAME AND LAST NAME
                if member['details']['firstName'] is None:
                    member['details']['firstName'] = ""
                if member['details']['lastName'] is None:
                    member['details']['lastName'] = ""
                
                members_data.append({
                    "id": member['id'],
                    "fullName": f"{member['details']['firstName']} {member['details']['lastName']}".strip(),
                    "email": member['details']['email'],
                    "role": member['role'],
                })
            
            if members_data:
                return jsonify({
                    "message": "Team members fetched successfully",
                    "data": members_data,
                }), 200
            else:
                return jsonify({
                    "message": "No team members found",
                }), 404
            
        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def add_team_member(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))
            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            m_role = db_details.get('m_details', {}).get('m_role')
            
            email = data.get('email')
            role = data.get('role')
            
            if not u_id or not o_id or not m_role:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403
            
            if m_role != Constants.ROLE_ADMIN:
                return jsonify({
                    "message": "User is not an admin of the organization",
                }), 403
            
            if not email or not role:
                return jsonify({
                    "message": "Email and role are required",
                }), 400
            
            # check if the email is already in the database
            user_response = self.supabase.table('ass_psp_users').select("u_id").eq("u_email", email).eq("u_not_deleted", 1).execute()
            if user_response.data:
                user_id = user_response.data[0]['u_id']
            else:
                # create a new user
                user_response = self.supabase.table('ass_psp_users').insert({
                    "u_email": email,
                }).execute()
                user_id = user_response.data[0]['u_id']

                # create a new member
                member_response = self.supabase.table('ass_psp_members').insert({
                    "m_u_id": user_id,
                    "m_o_id": o_id,
                    "m_role": role,
                }).execute()
                if member_response.data:
                    return jsonify({
                        "message": "User added to the organization successfully",
                    }), 200
                else:
                    return jsonify({
                        "message": "Failed to add user to the organization",
                    }), 400
            
            # check if the user is already a member of the organization
            member_response = self.supabase.table('ass_psp_members').select("m_id").eq("m_u_id", user_id).eq("m_o_id", o_id).eq("m_not_deleted", 1).execute()
            if member_response.data:
                return jsonify({
                    "message": "User is already a member of the organization",
                }), 400
            else:
                # create a new member
                member_response = self.supabase.table('ass_psp_members').insert({
                    "m_u_id": user_id,
                    "m_o_id": o_id,
                    "m_role": role,
                }).execute()
                if member_response.data:
                    return jsonify({
                        "message": "User added to the organization successfully",
                    }), 200
                else:
                    return jsonify({
                        "message": "Failed to add user to the organization",
                    }), 400
            
        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def update_team_member(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))
            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            m_role = db_details.get('m_details', {}).get('m_role')

            new_role = data.get('role')
            member_id = data.get('memberId')
            
            if not u_id or not o_id or not m_role:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403
            
            if m_role != Constants.ROLE_ADMIN:
                return jsonify({
                    "message": "User is not an admin of the organization",
                }), 403
            
            if not new_role or not member_id:
                return jsonify({
                    "message": "New role and member ID are required",
                }), 400
            
            # check if the member exists
            member_response = self.supabase.table('ass_psp_members').select("m_id").eq("m_id", member_id).eq("m_not_deleted", 1).execute()
            print(f"member_response: {member_response}")
            if not member_response.data:
                return jsonify({
                    "message": "Member not found",
                }), 400
            
            # update the member's role
            member_response = self.supabase.table('ass_psp_members').update({
                "m_role": new_role,
            }).eq("m_id", member_id).eq("m_not_deleted", 1).execute()
            if member_response.data:
                return jsonify({
                    "message": "Member role updated successfully",
                }), 200
            else:
                return jsonify({
                    "message": "Failed to update member role",
                }), 400
        
        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500