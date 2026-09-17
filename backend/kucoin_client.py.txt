import aiohttp
import asyncio
from typing import List, Dict, Optional
from datetime import datetime

class KuCoinClient:
    """Client for Kucoin public API (no authentication needed)."""
    
    def __init__(self):
        self.base_url = 'https://api.kucoin.com'
        self.session = None
    
    async def _get_session(self):
        """Create or return existing aiohttp session."""
        if self.session is None:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def fetch_candlesticks(self, symbol: str, timeframe: str) -> Optional[List[Dict]]:
        """
        Fetch candlestick data from Kucoin.
        
        Args:
            symbol: Crypto symbol (SOL, XRP, ETH, BTC)
            timeframe: Timeframe (15m, 1h, 4h)
        
        Returns:
            List of candles with OHLCV data
        """
        try:
            session = await self._get_session()
            
            # Map timeframe to Kucoin API format
            timeframe_map = {
                '15m': '15min',
                '1h': '1hour',