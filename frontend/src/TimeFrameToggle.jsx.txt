import React from 'react'

function TimeframeToggle({ timeframes, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe}
          onClick={() => onSelect(timeframe)}
          className={`px-6 py-3 rounded-lg font-bold transition-all text-lg ${
            selected === timeframe
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {timeframe}
        </button>
      ))}
    </div>
  )
}

export default TimeframeToggle