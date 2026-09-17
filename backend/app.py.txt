from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import logging
from datetime import datetime
import os

from config import SYMBOLS, TIMEFRAMES, UPDATE_INTERVAL
from kucoin_client import KuCoinClient
from indicators import IndicatorCalculator
from signals import SignalGenerator
from database import Database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Shared state
latest_data = {}
signal_generator = None
db = None
kucoin = None

async def background_task():
    """Background task that fetches data and generates signals."""
    global latest_data, signal_generator, db, kucoin
    
    while True:
        try:
            for symbol in SYMBOLS:
                for timeframe in TIMEFRAMES:
                    # Fetch candlesticks
                    candles = await kucoin.fetch_candlesticks(symbol, timeframe)
                    if not candles:
                        continue
                    
                    # Calculate indicators
                    calc = IndicatorCalculator(candles)
                    rsi = calc.calculate_rsi()
                    ema5, ema10, ema20 = calc.calculate_ema()
                    macd_line, signal_line, histogram = calc.calculate_macd()
                    upper_band, middle_band, lower_band = calc.calculate_bollinger_bands()
                    volume_sma = calc.calculate_volume_sma()
                    
                    # Generate signal
                    current_price = float(candles[-1]['close'])
                    signal = signal_generator.generate_signal(
                        symbol=symbol,
                        timeframe=timeframe,
                        price=current_price,
                        rsi=rsi,
                        ema5=ema5,
                        ema10=ema10,
                        ema20=ema20,
                        macd_line=macd_line,
                        signal_line=signal_line,
                        histogram=histogram,
                        upper_band=upper_band,
                        middle_band=middle_band,
                        lower_band=lower_band,
                        volume_sma=volume_sma,
                        current_volume=float(candles[-1]['vol'])
                    )
                    
                    # Store data
                    key = f"{symbol}_{timeframe}"
                    latest_data[key] = {
                        'symbol': symbol,
                        'timeframe': timeframe,
                        'price': current_price,
                        'signal': signal,
                        'timestamp': datetime.utcnow().isoformat(),
                        'rsi': rsi,
                        'ema5': ema5,
                        'ema10': ema10,
                        'ema20': ema20,
                        'macd_line': macd_line,
                        'signal_line': signal_line,
                        'histogram': histogram,
                        'upper_band': upper_band,
                        'middle_band': middle_band,
                        'lower_band': lower_band,
                        'volume_sma': volume_sma
                    }
                    
                    # Save to Supabase
                    await db.insert_signal(
                        symbol, 
                        timeframe, 
                        signal['type'], 
                        signal['confidence'],
                        signal.get('reasons', [])
                    )
                    await db.insert_price_history(symbol, timeframe, current_price)
            
            await asyncio.sleep(UPDATE_INTERVAL)
        
        except Exception as e:
            logger.error(f"Error in background task: {e}")
            await asyncio.sleep(5)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown."""
    global latest_data, signal_generator, db, kucoin
    
    # Startup
    db = Database()
    await db.initialize()
    kucoin = KuCoinClient()
    signal_generator = SignalGenerator()
    
    task = asyncio.create_task(background_task())
    logger.info("🚀 Trading bot started")
    
    yield
    
    # Shutdown
    task.cancel()
    logger.info("⛔ Trading bot stopped")

app = FastAPI(
    title="Trading Bot",
    description="Kucoin Trading Signals Bot",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Trading Bot API", "status": "running", "version": "2.0"}

@app.get("/api/data/{symbol}/{timeframe}")
async def get_data(symbol: str, timeframe: str):
    """Get latest data for a symbol and timeframe."""
    key = f"{symbol}_{timeframe}"
    if key not in latest_data:
        return {"error": "Data not found"}
    return latest_data[key]

@app.get("/api/all-data")
async def get_all_data():
    """Get all latest data."""
    return latest_data

@app.get("/api/signals/{symbol}")
async def get_signals(symbol: str, limit: int = 50):
    """Get signal history for a symbol."""
    signals = await db.get_signals(symbol, limit)
    return signals

@app.get("/api/price-history/{symbol}/{timeframe}")
async def get_price_history(symbol: str, timeframe: str, limit: int = 100):
    """Get price history for a symbol."""
    prices = await db.get_price_history(symbol, timeframe, limit)
    return prices

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)