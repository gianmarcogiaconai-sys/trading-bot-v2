# Configuration for Trading Bot v2

SYMBOLS = ['SOL', 'XRP', 'ETH', 'BTC']
TIMEFRAMES = ['15m', '1h', '4h']

# API Configuration
KUCOIN_API_BASE = 'https://api.kucoin.com'

# Update interval in seconds (300 = 5 minutes)
UPDATE_INTERVAL = 300

# Signal confidence thresholds
CONFIDENCE_THRESHOLDS = {
    'ALTA_CONFIDENZA': 0.85,      # >85% confidence
    'BUONA_CONFIDENZA': 0.65      # >65% confidence
}

# Technical indicator periods
INDICATORS = {
    'RSI_PERIOD': 14,
    'EMA_FAST': 5,
    'EMA_MEDIUM': 10,
    'EMA_SLOW': 20,
    'MACD_FAST': 12,
    'MACD_SLOW':