from typing import Dict, Optional, List
from config import CONFIDENCE_THRESHOLDS

class SignalGenerator:
    """Generate trading signals based on technical indicators."""
    
    def __init__(self):
        self.alta_confidenza_threshold = CONFIDENCE_THRESHOLDS['ALTA_CONFIDENZA']
        self.buona_confidenza_threshold = CONFIDENCE_THRESHOLDS['BUONA_CONFIDENZA']
    
    def generate_signal(
        self,
        symbol: str,
        timeframe: str,
        price: float,
        rsi: Optional[float] = None,
        ema5: Optional[float] = None,
        ema10: Optional[float] = None,
        ema20: Optional[float] = None,
        macd_line: Optional[float] = None,
        signal_line: Optional[float] = None,