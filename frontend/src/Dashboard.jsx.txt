import React, { useState } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import CryptoSelector from './CryptoSelector'
import TimeframeToggle from './TimeframeToggle'
import SignalsPanel from './SignalsPanel'
import { TrendingUp, TrendingDown, Pause } from 'lucide-react'

function Dashboard({ data }) {
  const [selectedCrypto, setSelectedCrypto] = useState('SOL')
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m')

  const cryptos = ['SOL', 'XRP', 'ETH', 'BTC']
  const timeframes = ['15m', '1h', '4h']

  const currentKey = `${selectedCrypto}_${selectedTimeframe}`
  const currentData = data[currentKey] || {}

  const getSignalColor = (type) => {
    switch(type) {
      case 'BUY': return 'text-green-600'
      case 'SELL': return 'text-red-600'
      case 'HOLD': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getSignalBg = (type) => {
    switch(type) {
      case 'BUY': return 'bg-green-50 border-green-500'
      case 'SELL': return 'bg-red-50 border-red-500'
      case 'HOLD': return 'bg-yellow-50 border-yellow-500'
      default: return 'bg-gray-50 border-gray-500'
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.85) return 'bg-green-600'
    if (confidence >= 0.65) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <div className="space-y-6">
      
      {/* Selettori */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">📊 Seleziona Crypto</h3>
            <CryptoSelector
              cryptos={cryptos}
              selected={selectedCrypto}
              onSelect={setSelectedCrypto}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">⏱️ Seleziona Timeframe</h3>
            <TimeframeToggle
              timeframes={timeframes}
              selected={selectedTimeframe}
              onSelect={setSelectedTimeframe}
            />
          </div>
        </div>
      </div>

      {/* Signal Card Principale */}
      {currentData.signal && (
        <div className={`card border-2 ${getSignalBg(currentData.signal.type)}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Segnale */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">SEGNALE</p>
              <div className={`text-5xl font-bold ${getSignalColor(currentData.signal.type)}`}>
                {currentData.signal.type === 'BUY' && '📈'}
                {currentData.signal.type === 'SELL' && '📉'}
                {currentData.signal.type === 'HOLD' && '⏸️'}
              </div>
              <p className={`text-2xl font-bold mt-2 ${getSignalColor(currentData.signal.type)}`}>
                {currentData.signal.type}
              </p>
            </div>

            {/* Prezzo e Confidenza */}
            <div>
              <p className="text-gray-600 text-sm mb-2">PREZZO ATTUALE</p>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                ${currentData.price?.toFixed(2)}
              </p>
              
              <p className="text-gray-600 text-sm mb-2">CONFIDENZA</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${getConfidenceColor(currentData.signal.confidence)}`}
                    style={{width: `${(currentData.signal.confidence * 100)}%`}}
                  />
                </div>
                <span className="font-bold">{(currentData.signal.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Livello Confidenza */}
            <div>
              <p className="text-gray-600 text-sm mb-2">LIVELLO</p>
              <div className="space-y-2">
                {currentData.signal.confidence >= 0.85 ? (
                  <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                    🔥 ALTA CONFIDENZA
                  </span>
                ) : currentData.signal.confidence >= 0.65 ? (
                  <span className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                    ⚡ BUONA CONFIDENZA
                  </span>
                ) : (
                  <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                    ❄️ BASSA CONFIDENZA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Motivi */}
          {currentData.signal.reasons && currentData.signal.reasons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="font-bold mb-2">💡 Motivi:</p>
              <ul className="list-disc pl-5 space-y-1">
                {currentData.signal.reasons.map((reason, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Indicatori Tecnici */}
      {currentData.rsi !== undefined && (
        <div className="card">
          <h3 className="card-title">📈 Indicatori Tecnici</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="indicator">
              <span className="indicator-label">RSI</span>
              <span className="indicator-value">{currentData.rsi?.toFixed(2)}</span>
              <span className="text-xs text-gray-500">
                {currentData.rsi < 30 ? '📉 Oversold' : currentData.rsi > 70 ? '📈 Overbought' : '⏸️ Neutral'}
              </span>
            </div>

            <div className="indicator">
              <span className="indicator-label">EMA 5</span>
              <span className="indicator-value">${currentData.ema5?.toFixed(2)}</span>
            </div>

            <div className="indicator">
              <span className="indicator-label">EMA 10</span>
              <span className="indicator-value">${currentData.ema10?.toFixed(2)}</span>
            </div>

            <div className="indicator">
              <span className="indicator-label">EMA 20</span>
              <span className="indicator-value">${currentData.ema20?.toFixed(2)}</span>
            </div>

            <div className="indicator">
              <span className="indicator-label">MACD</span>
              <span className="indicator-value">{currentData.macd_line?.toFixed(4)}</span>
            </div>

            <div className="indicator">
              <span className="indicator-label">BB Upper</span>
              <span className="indicator-value">${currentData.upper_band?.toFixed(2)}</span>
            </div>

            <div className="indicator">
              <span className="indicator-label">BB Lower</span>
              <span className="indicator-value">${currentData.lower_band?.toFixed(2)}</span>
            </div>

            <div className="indicator">
              <span className="indicator-label">Vol SMA</span>
              <span className="indicator-value">{currentData.volume_sma?.toFixed(0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Segnali Recenti */}
      <SignalsPanel selectedCrypto={selectedCrypto} />
    </div>
  )
}

export default Dashboard