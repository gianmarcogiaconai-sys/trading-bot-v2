from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Signal(BaseModel):
    type: str  # 'BUY', 'SELL', 'HOLD'
    confidence: float  # 0.0 to 1.0
    timestamp: datetime
    symbol: str
    timeframe: str
    reasons: Optional[List[str]] = []

class PriceData(BaseModel):
    symbol: str
    timeframe: str
    price: float
    timestamp: datetime
    rsi: Optional[float] = None
    ema5: Optional[float] = None
    ema10: Optional[float] = None
    ema20: Optional[float] = None
    macd_line: Optional[float] = None
    signal_line: Optional[float] = None
    histogram: Optional[float] = None
    upper_band: Optional[float] = None
    middle_band: Optional[float] = None
    lower_band: Optional[float] = None
    volume_sma: Optional[float] = None

class Candle(BaseModel):
    open: float
    close: float
    high: float
    low: float
    vol: float
    time: int

class IndicatorResult(BaseModel):
    rsi: