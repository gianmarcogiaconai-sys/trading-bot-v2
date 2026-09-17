import React, { useState, useEffect } from 'react'
import axios from 'axios'

function SignalsPanel({ selectedCrypto }) {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/signals/${selectedCrypto}?limit=20`)
        setSignals(response.data)
      } catch (err) {
        console.error('Error fetching signals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSignals()
    const interval = setInterval(fetchSignals, 60000)
    return () => clearInterval(interval)
  }, [selectedCrypto])

  const getSignalEmoji = (type) => {
    switch(type) {
      case 'BUY': return '📈'
      case 'SELL': return '📉'
      case 'HOLD': return '⏸️'
      default: return '❓'
    }
  }

  const getSignalColor = (type) => {
    switch(type) {
      case 'BUY': return 'border-l-green-500 bg-green-50'
      case 'SELL': return 'border-l-red-500 bg-red-50'
      case 'HOLD': return 'border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="card">
      <h3 className="card-title">📊 Segnali Recenti - {selectedCrypto}</h3>

      {loading && <p className="text-gray-600 text-center py-4">Caricamento...</p>}

      {!loading && signals.length === 0 && (
        <p className="text-gray-600 text-center py-8 text-lg">
          Nessun segnale ancora per {selectedCrypto}
        </p>
      )}

      {!loading && signals.length > 0 && (
        <div className="space-y-3">
          {signals.slice(0, 15).map((signal, idx) => (
            <div 
              key={idx} 
              className={`border-l-4 p-4 rounded-lg transition-all hover:shadow-md ${getSignalColor(signal.signal_type)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{getSignalEmoji(signal.signal_type)}</span>
                  <div>
                    <p className="font-bold text-lg">
                      {signal.signal_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {signal.timeframe}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="bg-white rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-600">Confidenza</p>
                    <p className="font-bold text-blue-600">
                      {(signal.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(signal.created_at).toLocaleString('it-IT')}
              </p>

              {signal.reasons && signal.reasons.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Motivi:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {signal.reasons.map((reason, i) => (
                      <li key={i}>• {reason}</li>
                    ))}
                  </ul>
                </div>
                    </div>)}