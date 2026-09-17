import React from 'react'

function CryptoSelector({ cryptos, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      {cryptos.map((crypto) => (
        <button
          key={crypto}
          onClick={() => onSelect(crypto)}
          className={`px-6 py-3 rounded-lg font-bold transition-all text-lg ${
            selected === crypto
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {crypto}
        </button>
      ))}
    </div>
  )
}

export default CryptoSelector