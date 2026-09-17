from supabase import create_client, Client
from datetime import datetime
from typing import List, Optional
import os

class Database:
    """Supabase database handler for trading bot."""
    
    def __init__(self):
        self.supabase: Optional[Client] = None
    
    async def initialize(self):
        """Initialize Supabase connection."""
        try:
            url = os.getenv('SUPABASE_URL', 'https://your-project.supabase.co')
            key = os.getenv('SUPABASE_KEY', 'your-anon-key')
            
            self.supabase = create_client(url, key)
            print("✅ Supabase initialized")
        except Exception as e:
            print(f"Error initializing Supabase: {e}")
            raise
    
    async def insert_signal(self, symbol: str, timeframe: str, signal_type: str, confidence: float, reasons: List[str] = None):
        """Insert a signal into the database."""
        try:
            data = {
                'symbol': symbol,
                'timeframe': timeframe,
                'signal_type': signal_type,
                'confidence': confidence,
                'reasons': reasons or [],
                'created_at': datetime.utcnow().isoformat()
            }
            
            response = self.supabase.table('signals').insert(data).execute()
            return response
        except Exception as e:
            print(f"Error inserting signal: {e}")
            return None
    
    async def insert_price_history(self, symbol: str, timeframe: str, price: float):
        """Insert price into history."""
        try:
            data = {
                'symbol': symbol,
                'timeframe': timeframe,
                'price': price,
                'created_at':