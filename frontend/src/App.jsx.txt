import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Dashboard from './Dashboard'
import './App.css'

function App() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/all-data')
        setData(response.data)
        setError(null)
      } catch (err) {
        setError('Errore nel caricamento dati dal server')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    // Fetch immediately
    fetchData()

    // Fetch every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md dark:bg-gray-800/50 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Trading Bot</h1>
                <p className="text-sm text-gray-200">Kucoin Signals</p>
              </div>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6 backdrop-blur-md">
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
              <p className="text-white text-lg">Caricamento dati...</p>
            </div>
          )}

          {!loading && <Dashboard data={data} />}
        </main>

        {/* Footer */}
        <footer className="bg-white/5 backdrop-blur-md text-gray-300 text-center py-6 mt-20">
          <p>🚀 Trading Bot v2.0 | Monitoraggio 24/7 su Kucoin</p>
        </footer>
      </div>
    </div>
  )
}

export default App)