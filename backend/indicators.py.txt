from typing import List, Dict, Optional, Tuple
import numpy as np

class IndicatorCalculator:
    """Calculate technical indicators from candlestick data."""
    
    def __init__(self, candles: List[Dict]):
        """Initialize with candle data."""
        self.candles = candles
        self.closes = np.array([float(c['close']) for c in candles])
        self.volumes = np.array([float(c['vol']) for c in candles])
    
    def calculate_rsi(self, period: int = 14) -> Optional[float]:
        """Calculate Relative Strength Index (RSI)."""
        try:
            if len(self.closes) < period + 1:
                return None
            
            deltas = np.diff(self.closes)
            seed =