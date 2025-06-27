from supabase import create_client, Client
from supabase.client import ClientOptions
from config import Config

class Supabase_Util:
    url: str = Config.SUPABASE_URL or ""
    key: str = Config.SUPABASE_KEY or ""
    supabase: Client = create_client(url, key, options=ClientOptions(postgrest_client_timeout=10))

