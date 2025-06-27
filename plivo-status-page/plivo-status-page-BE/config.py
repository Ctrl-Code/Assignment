import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
# load_dotenv(dotenv_path=['.env.defaults', '.env.production'])

class Config:
    # Supabase Configuration
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    
    # Add any other global configuration settings here

