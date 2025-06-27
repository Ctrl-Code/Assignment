import pytz
from datetime import datetime

class Time_Conversions:
    def __init__(self):
        pass
        
    def timestampz_to_epoch(self, timestampz):
        """
        Convert a PostgreSQL timestamp with time zone (timestamptz) to epoch time.
        
        Args:
            timestampz (str): The timestamp in ISO 8601 format (e.g., "2025-06-26T07:04:27.882388").
        
        Returns:
            int: The epoch time in seconds.
        """
        # Parse the timestamp string into a datetime object
        dt = datetime.fromisoformat(timestampz)
        
        # Convert to UTC if it's not already
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=pytz.UTC)
        else:
            dt = dt.astimezone(pytz.UTC)
        
        # Return the epoch time
        return int(dt.timestamp() * 1000)
    
    def epoch_to_timestampz(self, epoch_time):
        """
        Convert epoch time to a PostgreSQL timestamp with time zone (timestamptz).
        
        Args:
            epoch_time (int): The epoch time in seconds.
        
        Returns:
            str: The timestamp in ISO 8601 format.
        """
        # Convert epoch time to a datetime object in UTC
        dt = datetime.fromtimestamp(epoch_time / 1000, tz=pytz.UTC)
        
        # Return the timestamp in ISO 8601 format
        return dt.isoformat()

if __name__ == "__main__":
    timestampz = "2025-06-26T07:04:27.882388"
    print(timestampz)
    epoch_time = Time_Conversions().timestampz_to_epoch(timestampz)
    print(epoch_time)
    converted_timestampz = Time_Conversions().epoch_to_timestampz(epoch_time)
    print(converted_timestampz)
    print(timestampz == converted_timestampz)
