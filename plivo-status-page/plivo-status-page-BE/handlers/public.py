from utils.supabase_util import Supabase_Util
from flask import jsonify
from constants import Constants
from utils.time_conversions import Time_Conversions

class Public_Handler(Supabase_Util):
    def __init__(self):
        pass
    
    def get_public_page_services(self, data):
        try:
            orgName = data.get('orgName')
            
            if not orgName:
                return jsonify({
                    "message": "Organization name (orgName) is required",
                }), 400
            
            # Get organization ID
            org_response = self.supabase.table('ass_psp_organizations').select("o_id").eq("o_name", orgName).eq("o_not_deleted", Constants.NOT_DELETED).execute()
            
            if not org_response.data:
                return jsonify({
                    "message": "Organization not found",
                }), 404
            
            org_id = org_response.data[0]['o_id']
            
            # Get services for the organization
            services_response = self.supabase.table('ass_psp_services').select("id: s_id, serviceName: s_name, serviceStatus: s_service_status_id, updatedAt: s_updated_at").eq("s_o_id", org_id).eq("s_not_deleted", Constants.NOT_DELETED).execute()
            
            if services_response.data:
                service_ids = [service['id'] for service in services_response.data]

                # Get all service statuses for the organization
                service_statuses_response = self.supabase.table('ass_psp_service_status').select("ss_id, ss_name").eq("ss_o_id", org_id).eq("ss_not_deleted", Constants.NOT_DELETED).execute()
                service_status_map = {status['ss_id']: status['ss_name'] for status in service_statuses_response.data}

                # Get all open maintenance incidents for these services
                maintenance_incidents_response = self.supabase.table('ass_psp_incidents').select("i_service_id").eq("i_status", Constants.INCIDENT_STATUS_OPEN).eq("i_title", Constants.TEXT_SCHEDULED_MAINTENANCE).eq("i_not_deleted", Constants.NOT_DELETED).in_("i_service_id", service_ids).execute()
                
                maintenance_service_ids = {incident['i_service_id'] for incident in maintenance_incidents_response.data}

                # Get all incidents (open and resolved) for these services
                all_incidents_response = self.supabase.table('ass_psp_incidents').select("id: i_id, title: i_title, createdAt: i_created_at, serviceId: i_service_id, status: i_status").eq("i_not_deleted", Constants.NOT_DELETED).in_("i_service_id", service_ids).execute()
                
                # Group incidents by service_id and count open/closed
                incidents_by_service = {}
                open_incidents_count = {}
                closed_incidents_count = {}

                for incident in all_incidents_response.data:
                    incident['createdAt'] = Time_Conversions().timestampz_to_epoch(incident['createdAt'])
                    service_id = incident.pop('serviceId') # remove serviceId key from incident dict
                    
                    if service_id not in incidents_by_service:
                        incidents_by_service[service_id] = []
                        open_incidents_count[service_id] = 0
                        closed_incidents_count[service_id] = 0

                    if incident['status'] == Constants.INCIDENT_STATUS_OPEN and incident['title'] != Constants.TEXT_SCHEDULED_MAINTENANCE:
                        incidents_by_service[service_id].append(incident)
                        open_incidents_count[service_id] += 1
                    elif incident['status'] == Constants.INCIDENT_STATUS_RESOLVED:
                        closed_incidents_count[service_id] += 1
                
                for service in services_response.data:
                    service['maintenance'] = service['id'] in maintenance_service_ids
                    service['open_incidents'] = open_incidents_count.get(service['id'], 0)
                    service['closed_incidents'] = closed_incidents_count.get(service['id'], 0)
                    service['serviceStatus'] = service_status_map.get(service['serviceStatus'], "Unknown") # Replace ID with name
                    del service['updatedAt']

                return jsonify({
                    "message": "Services fetched successfully",
                    "data": services_response.data,
                }), 200
            else:
                return jsonify({
                    "message": "No services found for this organization",
                }), 404
            
        except Exception as e:
            print(f"Error in get_public_page_services: {e}")
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def get_public_page_incidents(self, data):
        try:
            service_id = data.get('serviceId')
            if not service_id:
                return jsonify({
                    "message": "Service ID (serviceId) is required",
                }), 400
            
            # Get all incidents for the service
            incidents_response = self.supabase.table('ass_psp_incidents').select("id: i_id, title: i_title, description: i_description, createdAt: i_created_at, status: i_status, resolvedAt: i_resolved_at").eq("i_service_id", service_id).eq("i_not_deleted", Constants.NOT_DELETED).execute()
            
            open_incidents_list = []
            closed_incidents_list = []

            for incident in incidents_response.data:
                incident['createdAt'] = Time_Conversions().timestampz_to_epoch(incident['createdAt'])
                
                if incident['status'] == Constants.INCIDENT_STATUS_OPEN and incident['title'] != Constants.TEXT_SCHEDULED_MAINTENANCE:
                    incident.pop('status') # remove status key from incident dict
                    if 'resolvedAt' in incident: # Remove resolvedAt key for open incidents, only if it exists in the dictionary
                        incident.pop('resolvedAt') 
                    open_incidents_list.append(incident)
                elif incident['status'] == Constants.INCIDENT_STATUS_RESOLVED:
                    incident.pop('status') # remove status key from incident dict
                    if incident['resolvedAt']:
                        incident['resolvedAt'] = Time_Conversions().timestampz_to_epoch(incident['resolvedAt'])
                    closed_incidents_list.append(incident)

            return jsonify({
                "message": "Incidents fetched successfully",
                "data": {
                    "open_incidents": open_incidents_list,
                    "closed_incidents": closed_incidents_list
                }
            }), 200
            
        except Exception as e:
            print(f"Error in get_public_page_incidents: {e}")
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def get_public_page_incident_updates(self, data):
        try:
            incident_id = data.get('incidentId')
            if not incident_id:
                return jsonify({
                    "message": "Incident ID (incidentId) is required",
                }), 400
            
            # Get all incident and status updates for the incident
            incident_and_status_updates_response = self.supabase.table('ass_psp_incident_updates').select("id: iu_id, type: iu_type, update: iu_update, createdAt: iu_created_at").eq("iu_i_id", incident_id).eq("iu_not_deleted", Constants.NOT_DELETED).order('iu_created_at', desc=True).execute()

            incident_updates_list = []

            for update in incident_and_status_updates_response.data:
                update['createdAt'] = Time_Conversions().timestampz_to_epoch(update['createdAt'])
                incident_updates_list.append(update)
            
            return jsonify({
                "message": "Incident updates fetched successfully",
                "data": incident_updates_list,
            }), 200

        except Exception as e:
            print(f"Error in get_public_page_incident_updates: {e}")
            return jsonify({
                "message": "Internal server error",
                "error": str(e)
            }), 500
    
    def get_public_page_service_status_updates(self, data):
        try:
            service_id = data.get('serviceId')
            if not service_id:
                return jsonify({
                    "message": "Service ID (serviceId) is required",
                }), 400
            
            # Get the service status ID from the service
            service_response = self.supabase.table('ass_psp_services').select("s_service_status_id").eq("s_id", service_id).eq("s_not_deleted", Constants.NOT_DELETED).execute()
            if not service_response.data:
                return jsonify({
                    "message": "Service not found or deleted",
                }), 404
            
            service_status_id = service_response.data[0]['s_service_status_id']

            # Get all status updates for the service status
            status_updates_response = self.supabase.table('ass_psp_service_status_updates').select("id: ssu_id, update: ssu_update, createdAt: ssu_created_at").eq("ssu_ss_id", service_status_id).eq("ssu_not_deleted", Constants.NOT_DELETED).order('ssu_created_at', desc=True).execute()

            service_status_updates_list = []

            for update in status_updates_response.data:
                update['createdAt'] = Time_Conversions().timestampz_to_epoch(update['createdAt'])
                service_status_updates_list.append(update)

            return jsonify({
                "message": "Service status updates fetched successfully",
                "data": service_status_updates_list,
            }), 200

        except Exception as e:
            print(f"Error in get_public_page_service_status_updates: {e}")