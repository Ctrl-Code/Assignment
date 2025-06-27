from utils.supabase_util import Supabase_Util
from flask import jsonify
from handlers.common.db_details import DB_Details
from constants import Constants
from utils.time_conversions import Time_Conversions
import time

class Services_Handler(Supabase_Util):
    def __init__(self):
        pass

    def get_all_services(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')

            # Check if user_id or organization_id is missing
            if not u_id or not o_id:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403
            
            # Get all services for the organization
            services_response = self.supabase.table('ass_psp_services').select("id: s_id, serviceName: s_name, serviceStatus: s_service_status_id").eq("s_o_id", o_id).eq("s_not_deleted", 1).execute()

            if services_response.data:
                service_ids = [service['id'] for service in services_response.data]
                
                # Get all open maintenance incidents for these services
                maintenance_incidents_response = self.supabase.table('ass_psp_incidents').select("i_service_id").eq("i_status", Constants.INCIDENT_STATUS_OPEN).eq("i_title", Constants.TEXT_SCHEDULED_MAINTENANCE).eq("i_not_deleted", 1).in_("i_service_id", service_ids).execute()
                
                maintenance_service_ids = {incident['i_service_id'] for incident in maintenance_incidents_response.data}

                for service in services_response.data:
                    service['maintenance'] = service['id'] in maintenance_service_ids

                return jsonify({
                    "message": "Services fetched successfully",
                    "data": services_response.data,
                }), 200
            else:
                return jsonify({
                    "message": "No services found for this organization",
                    "data": [],
                }), 200

        except Exception as e:
            return jsonify({
                "message": "Internal server error A",
                "error": str(e)
            }), 500
    
    def get_all_service_statuses(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            
            # Check if user_id or organization_id is missing
            if not u_id or not o_id:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403
            
            # Get all active service statuses for the organization
            service_statuses = self.supabase.table('ass_psp_service_status').select("id: ss_id, name: ss_name").eq("ss_o_id", o_id).eq("ss_not_deleted", 1).execute()

            if service_statuses.data:
                return jsonify({
                    "message": "Service statuses fetched successfully",
                    "data": service_statuses.data,
                }), 200
            else:
                return jsonify({
                    "message": "No active service statuses found for this organization",
                    "data": [],
                }), 200 # Returning 200 with empty data if no statuses are found is generally acceptable

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def add_service_status(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            role = db_details.get('m_details', {}).get('m_role')
            serviceStatusName = data.get('serviceStatusName')
            
            if not u_id or not o_id:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403
            
            if role != Constants.ROLE_ADMIN:
                return jsonify({
                    "message": "User is not authorized to perform this action.",
                }), 403

            if not serviceStatusName:
                return jsonify({
                    "message": "Service Status Name (serviceStatusName) is required",
                }), 400

            # Insert the new service status
            response = self.supabase.table('ass_psp_service_status').insert({
                "ss_o_id": o_id,
                "ss_name": serviceStatusName,
            }).execute()

            if response.data:
                return jsonify({
                    "message": "Service status added successfully",
                    "data": response.data[0]['ss_id'],
                }), 200
            else:
                return jsonify({
                    "message": "Failed to add service status",
                }), 400

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def add_service(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            role = db_details.get('m_details', {}).get('m_role')
            
            serviceStatusId = data.get('serviceStatusId')
            serviceName = data.get('serviceName')
            
            if not u_id or not o_id:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 404
            
            if role != Constants.ROLE_ADMIN:
                return jsonify({
                    "message": "User is not authorized to perform this action.",
                }), 403

            if not serviceStatusId:
                return jsonify({
                    "message": "Service Status ID (serviceStatusId) is required",
                }), 400
            
            if not serviceName:
                return jsonify({
                    "message": "Service Name (serviceName) is required",
                }), 400

            # Insert the new service
            response = self.supabase.table('ass_psp_services').insert({
                "s_o_id": o_id,
                "s_name": serviceName,
                "s_service_status_id": serviceStatusId,
            }).execute()

            if response.data:
                return jsonify({
                    "message": "Service added successfully",
                    "data": response.data[0]['s_id'],
                }), 200
            else:
                return jsonify({
                    "message": "Failed to add service",
                }), 400

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def get_open_incidents(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            
            if not u_id or not o_id:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403

            service_id = data.get('serviceId')
            
            incidents_response = self.supabase.table('ass_psp_incidents').select("id: i_id, title: i_title, description: i_description, createdAt: i_created_at").eq("i_status", Constants.INCIDENT_STATUS_OPEN).eq("i_not_deleted", 1).neq("i_title", Constants.TEXT_SCHEDULED_MAINTENANCE).eq("i_service_id", service_id).execute()

            if incidents_response.data:
                for incident in incidents_response.data:
                    incident['createdAt'] = Time_Conversions().timestampz_to_epoch(incident['createdAt'])
                return jsonify({
                    "message": "Open incidents fetched successfully",
                    "data": incidents_response.data,
                }), 200
            else:
                return jsonify({
                    "message": "No open incidents found for this organization",
                    "data": [],
                }), 200

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def add_incident(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            
            service_id = data.get('serviceId')
            title = data.get('title')
            description = data.get('description')

            if not service_id:
                return jsonify({
                    "message": "Service ID (serviceId) is required",
                }), 400
            
            if not title:
                return jsonify({
                    "message": "Title (title) is required",
                }), 400
            
            if not description:
                return jsonify({
                    "message": "Description (description) is required",
                }), 400
            
            # check existing service_id is is_not_deleted
            service_response = self.supabase.table('ass_psp_services').select("s_id").eq("s_id", service_id).eq("s_not_deleted", 1).execute()
            if not service_response.data:
                return jsonify({
                    "message": "Service not found or deleted",
                }), 400
            
            if not u_id or not o_id:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403

            # Insert the new incident
            response = self.supabase.table('ass_psp_incidents').insert({
                "i_service_id": service_id,
                "i_title": title,
                "i_description": description,
            }).execute()

            if response.data:
                return jsonify({
                    "message": "Incident added successfully",
                    "data": response.data[0]['i_id'],
                }), 200
            else:
                return jsonify({
                    "message": "Failed to add incident",
                }), 400

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def update_service_status(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            
            service_id = data.get('serviceId')
            service_status_id = data.get('serviceStatusId')

            if not u_id or not o_id:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403
            
            if not service_id:
                return jsonify({
                    "message": "Service ID (serviceId) is required",
                }), 400
            
            if not service_status_id:
                return jsonify({
                    "message": "Service Status ID (serviceStatusId) is required",
                }), 400
            
            # check existing service_id is is_not_deleted
            service_response = self.supabase.table('ass_psp_services').select("s_id").eq("s_id", service_id).eq("s_not_deleted", 1).execute()
            if not service_response.data:
                return jsonify({
                    "message": "Service not found or deleted",
                }), 400
            
            # get existing service_status_id
            existing_service_status_id_response = self.supabase.table('ass_psp_services').select("s_service_status_id").eq("s_id", service_id).eq("s_not_deleted", 1).execute()
            if not existing_service_status_id_response.data:
                return jsonify({
                    "message": "Service status not found or deleted",
                }), 400
            existing_service_status_id = existing_service_status_id_response.data[0]['s_service_status_id']
            
            # get service_status_id list for organization
            service_status_ids_response = self.supabase.table('ass_psp_service_status').select("ss_id, ss_name").eq("ss_o_id", o_id).eq("ss_not_deleted", 1).execute()
            service_status_ids_list = {int(service_status['ss_id']): service_status['ss_name'] for service_status in service_status_ids_response.data}

            if service_status_id not in service_status_ids_list:
                return jsonify({
                    "message": "Service Status not found or deleted",
                }), 400

            # put the update in table ass_psp_service_status_updates
            response = self.supabase.table('ass_psp_service_status_updates').insert({
                "ssu_ss_id": service_status_id,
                "ssu_update": f"Status Changed from {service_status_ids_list[existing_service_status_id]} to {service_status_ids_list[service_status_id]}",
            }).execute()
            
            # update the service status
            response = self.supabase.table('ass_psp_services').update({
                "s_service_status_id": service_status_id,
            }).eq("s_id", service_id).execute()

            if response.data:
                return jsonify({
                    "message": "Service status updated successfully",
                }), 200
            else:
                return jsonify({
                    "message": "Failed to update service status",
                }), 400

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500

    def toggle_service_maintenance(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))
            
            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            
            service_id = data.get('serviceId')
            
            if not service_id:
                return jsonify({
                    "message": "Service ID (serviceId) is required",
                }), 400
            
            # get current open maintenance incident
            maintenance_incident_response = self.supabase.table('ass_psp_incidents').select("i_id").eq("i_service_id", service_id).eq("i_not_deleted", 1).eq("i_status", Constants.INCIDENT_STATUS_OPEN).execute()
            if maintenance_incident_response.data:
                maintenance_incident_id = maintenance_incident_response.data[0]['i_id'] # if exists, then update the maintenance
            else:
                maintenance_incident_id = None # if not exists, then add the maintenance
            
            if maintenance_incident_id:
                # update the maintenance
                response = self.supabase.table('ass_psp_incidents').update({
                    "i_status": Constants.INCIDENT_STATUS_RESOLVED,
                    "i_resolved_at": Time_Conversions().epoch_to_timestampz(int(time.time() * 1000)),
                }).eq("i_id", maintenance_incident_id).execute()
                
                if response.data:
                    return jsonify({
                        "message": "Service maintenance updated successfully",
                    }), 200
                else:
                    return jsonify({
                        "message": "Failed to update service maintenance",
                    }), 400
            else:
                # insert the new service maintenance
                response = self.supabase.table('ass_psp_incidents').insert({
                    "i_service_id": service_id,            
                    "i_title": Constants.TEXT_SCHEDULED_MAINTENANCE,
                }).execute()
                
                if response.data:
                    return jsonify({
                        "message": "Service maintenance added successfully",
                    }), 200
                else:
                    return jsonify({
                        "message": "Failed to add service maintenance",
                    }), 400
        
        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def resolve_incident(self, data):
        print(data)
        # return jsonify({
        #     "message": "Incident resolved successfully",
        # }), 200
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            
            incidentId = data.get("incidentId")
            
            if not u_id or not o_id:
                return jsonify({
                    "message": "User or Organization not found.",
                }), 403
            
            if not incidentId:
                return jsonify({
                    "message": "Incident ID (incidentId) is required",
                }), 400
            
            # check existing incident_id is is_not_deleted
            incident_response = self.supabase.table('ass_psp_incidents').select("i_id, i_status").eq("i_id", incidentId).eq("i_not_deleted", 1).execute()

            if not incident_response.data or incident_response.data[0]['i_status'] == Constants.INCIDENT_STATUS_RESOLVED:
                return jsonify({
                    "message": "Incident not found or deleted or already resolved",
                }), 400
            
            # put the update in table ass_psp_incident_updates
            response = self.supabase.table('ass_psp_incident_updates').insert({
                "iu_i_id": incidentId,
                "iu_type": Constants.INCIDENT_UPDATE_TYPE_INCIDENT_UPDATE,
                "iu_update": f"Incident Marked as Resolved",
            }).execute()
            
            # update the incident
            response = self.supabase.table('ass_psp_incidents').update({
                "i_status": Constants.INCIDENT_STATUS_RESOLVED,
                "i_resolved_at": Time_Conversions().epoch_to_timestampz(int(time.time() * 1000)),
            }).eq("i_id", incidentId).execute()

            if response.data:
                return jsonify({
                    "message": "Incident resolved successfully",
                }), 200
            else:
                return jsonify({
                    "message": "Failed to resolve incident",
                }), 400

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def update_incident(self, data):
        try:
            db_details = DB_Details().get_db_details(data.get('jwt'))

            u_id = db_details.get('u_details', {}).get('u_id')
            o_id = db_details.get('o_details', {}).get('o_id')
            
            incidentId = data.get("incidentId")
            incidentDescription = data.get("incidentDescription")

            if not incidentId:
                return jsonify({
                    "message": "Incident ID (incidentId) is required",
                }), 400
            
            if not incidentDescription:
                return jsonify({
                    "message": "Incident Description (incidentDescription) is required",
                }), 400
            
            current_incident_response = self.supabase.table('ass_psp_incidents').select("i_description, i_status").eq("i_id", incidentId).eq("i_not_deleted", 1).execute()
            if not current_incident_response.data:
                return jsonify({
                    "message": "Incident not found or deleted or already resolved",
                }), 400

            elif current_incident_response.data[0]['i_status'] == Constants.INCIDENT_STATUS_RESOLVED:
                return jsonify({
                    "message": "Incident is resolved, hence cannot be updated",
                }), 400
            
            old_incident_description = current_incident_response.data[0]['i_description']
            new_incident_description = incidentDescription
            iu_update_text = f"{old_incident_description} -> {new_incident_description}"
            
            # Insert the new incident updates
            response = self.supabase.table('ass_psp_incident_updates').insert({
                "iu_i_id": incidentId,
                "iu_type": Constants.INCIDENT_UPDATE_TYPE_INCIDENT_UPDATE,
                "iu_update": iu_update_text,
            }).execute()

            if response.data:
                return jsonify({
                    "message": "Incident update added successfully",
                }), 200
            else:
                return jsonify({
                    "message": "Failed to add incident update",
                }), 400

        except Exception as e:
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500

