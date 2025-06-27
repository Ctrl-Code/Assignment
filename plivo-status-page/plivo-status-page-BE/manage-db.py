from utils.supabase_util import Supabase_Util
from pprint import pprint

class Manage_DB(Supabase_Util):
    def __init__(self):
        pass
    
    def list_entries_from_table(self, table_name, select="*", key = None, value = None):
        if key and value:
            response = self.supabase.table(table_name).select(select).eq(key, value).execute()
        else:
            response = self.supabase.table(table_name).select(select).execute()
        pprint(response.data)
    
    def add_entry_to_table(self, table_name, insert_dict):
        response = self.supabase.table(table_name).insert(insert_dict).execute()
        pprint(response.data)
    
    def DELETE_entry_from_table(self, table_name, id, value):
        response = self.supabase.table(table_name).delete().eq(id, value).execute()
        pprint(response.data)
    
    def UPDATE_entry_in_table(self, table_name, update_dict, key = None, value = None):
        if key and value:
            response = self.supabase.table(table_name).update(update_dict).eq(key, value).execute()
        else:
            response = self.supabase.table(table_name).update(update_dict).execute()
        pprint(response.data)

if __name__ == "__main__":
    print("Listing all entries from tables")
    print("ass_psp_users")
    Manage_DB().list_entries_from_table("ass_psp_users", select="u_id, u_email", key="u_not_deleted", value=1)
    print("--------------------------------")
    print("ass_psp_organizations")
    Manage_DB().list_entries_from_table("ass_psp_organizations", select="o_id, o_name, o_u_id", key="o_not_deleted", value=1)
    print("--------------------------------")
    print("ass_psp_members")
    Manage_DB().list_entries_from_table("ass_psp_members", select="m_id, m_o_id, m_u_id, m_role", key="m_not_deleted", value=1)
    print("--------------------------------")
    print("ass_psp_services")
    Manage_DB().list_entries_from_table("ass_psp_services", select="s_id, s_o_id, s_name, s_service_status_id", key="s_not_deleted", value=1)
    print("--------------------------------")
    print("ass_psp_service_status")
    Manage_DB().list_entries_from_table("ass_psp_service_status", select="ss_id, ss_o_id, ss_name", key="ss_not_deleted", value=1)
    print("--------------------------------")
    print("ass_psp_incidents")
    Manage_DB().list_entries_from_table("ass_psp_incidents", select="*")
    print("--------------------------------")
    print("ass_psp_incident_updates")
    Manage_DB().list_entries_from_table("ass_psp_incident_updates", select="iu_id, iu_i_id, iu_type, iu_update", key="iu_not_deleted", value=1)
    print("--------------------------------")
    print("ass_psp_service_status_updates")
    Manage_DB().list_entries_from_table("ass_psp_service_status_updates", select="ssu_id, ssu_ss_id, ssu_update")
    print("--------------------------------")

    # print("Updating entry in table")
    # Manage_DB().UPDATE_entry_in_table("ass_psp_members", {"m_role": 2}, "m_id",2)
    # print("--------------------------------")

    # Manage_DB().DELETE_entry_from_table("ass_psp_service_status_updates", "ssu_id", 1) # 

    # Manage_DB().DELETE_entry_from_table("ass_psp_users", "u_id", 3)
    # Manage_DB().DELETE_entry_from_table("ass_psp_organizations", "o_id", 2)
    # Manage_DB().DELETE_entry_from_table("ass_psp_members", "m_id", 1)
    # Manage_DB().DELETE_entry_from_table("ass_psp_services", "s_id", 1)
    # Manage_DB().DELETE_entry_from_table("ass_psp_service_status", "ss_id", 1)
