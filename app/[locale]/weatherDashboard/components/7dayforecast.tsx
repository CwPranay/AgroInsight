"use client"

import { useState } from "react"
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudDrizzle, 
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ThermometerSun,
  CloudFog
} from "lucide-react"

// Mock weather data - replace with real API later
const generateMockForecast = () => {
  const today = new Date()
  const weatherConditions = [
    { condition: "Sunny", icon: Sun, temp: { min: 22, max: 35 }, rain: 0, color: "from-yellow-400 to-orange-400" },
    { condition: "Partly Cloudy", icon: Cloud, temp: { min: 20, max: 32 }, rain: 10, color: "from-blue-300 to-blue-400" },
    { condition: "Cloudy", icon: CloudFog, temp: { min: 18, max: 28 }, rain: 20, color: "from-gray-400 to-gray-500" },
    { condition: "Light Rain", icon: CloudDrizzle, temp: { min: 19, max: 26 }, rain: 60, color: "from-blue-400 to-blue-500" },
    { condition: "Rain", icon: CloudRain, temp: { min: 17, max: 24 }, rain: 80, color: "from-blue-500 to-blue-600" },
  ]

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
    
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...weather,
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      uvIndex: Math.floor(Math.random() * 8) + 1, // 1-8
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
      pressure: Math.floor(Math.random() * 20) + 1000, // 1000-1020 hPa
      sunrise: "06:15 AM",
      sunset: "06:45 PM"
    }
  })
}

export default function SevenDayForecast() {
  const [selectedDay, setSelectedDay] = useState(0)
  const forecast = generateMockForecast()
  const selected = forecast[selectedDay]
  const WeatherIcon = selected.icon

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">7-Day Weather Forecast</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Plan your farming activities ahead</p>
        </div>
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-xs sm:text-sm font-semibold shadow-md w-fit">
          Updated Now
        </div>
      </div>

      {/* Main Forecast Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {forecast.map((day, index) => {
          const DayIcon = day.icon
          const isSelected = selectedDay === index
          const isToday = index === 0

          return (
            <button
              key={day.date}
              onClick={() => setSelectedDay(index)}
              className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                isSelected
                  ? "bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-xl scale-105"
                  : "bg-white hover:bg-amber-50 text-gray-900 shadow-md hover:shadow-lg"
              }`}
            >
              {isToday && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                  Today
                </div>
              )}
              
              <div className="text-center space-y-1.5 sm:space-y-2">
                <div className={`text-xs sm:text-sm font-semibold ${isSelected ? "text-white" : "text-gray-600"}`}>
                  {day.day}
                </div>
                <div className={`text-[10px] sm:text-xs ${isSelected ? "text-amber-100" : "text-gray-500"}`}>
                  {day.fullDate}
                </div>
                
                <div className="flex justify-center my-2 sm:my-3">
                  <DayIcon 
                    size={window.innerWidth < 640 ? 24 : 32}
                    className={isSelected ? "text-white" : "text-amber-500"}
                  />
                </div>
                
                <div className="space-y-0.5 sm:space-y-1">
                  <div className={`text-xl sm:text-2xl font-bold ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {day.temp.max}°
                  </div>
                  <div className={`text-xs sm:text-sm ${isSelected ? "text-amber-100" : "text-gray-500"}`}>
                    {day.temp.min}°
                  </div>
                </div>
                
                <div className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs ${isSelected ? "text-amber-100" : "text-blue-500"}`}>
                  <Droplets size={10} className="sm:w-3 sm:h-3" />
                  <span>{day.rain}%</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detailed View */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Main Weather Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {selected.day}, {selected.fullDate}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">{selected.condition}</p>
              </div>
              <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${selected.color} flex-shrink-0`}>
                <WeatherIcon size={window.innerWidth < 640 ? 36 : 48} className="text-white" />
              </div>
            </div>

            <div className="flex items-end gap-3 sm:gap-4">
              <div>
                <div className="text-4xl sm:text-6xl font-bold text-gray-900">
                  {selected.temp.max}°
                </div>
                <div className="text-gray-500 text-sm sm:text-lg">
                  Feels like {selected.temp.max + 2}°
                </div>
              </div>
              <div className="pb-1 sm:pb-2">
                <div className="text-xl sm:text-2xl text-gray-600">
                  {selected.temp.min}°
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Min</div>
              </div>
            </div>

            {/* Rain Probability */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplets className="text-blue-500" size={18} />
                  <span className="text-sm sm:text-base font-semibold text-gray-900">Precipitation</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-blue-600">{selected.rain}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${selected.rain}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Additional Details */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Weather Details</h4>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {/* Humidity */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Droplets className="text-blue-500" size={16} />
                  <span className="text-xs sm:text-sm text-gray-600">Humidity</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{selected.humidity}%</div>
              </div>

              {/* Wind Speed */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Wind className="text-green-500" size={16} />
                  <span className="text-xs sm:text-sm text-gray-600">Wind Speed</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{selected.windSpeed} km/h</div>
              </div>

              {/* UV Index */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <ThermometerSun className="text-orange-500" size={16} />
                  <span className="text-xs sm:text-sm text-gray-600">UV Index</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{selected.uvIndex}</div>
              </div>

              {/* Visibility */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Eye className="text-purple-500" size={16} />
                  <span className="text-xs sm:text-sm text-gray-600">Visibility</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{selected.visibility} km</div>
              </div>

              {/* Pressure */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <Gauge className="text-gray-500" size={16} />
                  <span className="text-xs sm:text-sm text-gray-600">Pressure</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{selected.pressure} hPa</div>
              </div>

              {/* Sun Times */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-200">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <Sunrise className="text-yellow-500" size={16} />
                  <span className="text-xs sm:text-sm text-gray-600">Sunrise</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900">{selected.sunrise}</div>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
                  <Sunset className="text-orange-500" size={16} />
                  <span className="text-xs sm:text-sm text-gray-600">Sunset</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900">{selected.sunset}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Farming Recommendations */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🌾</span>
            Farming Recommendations
          </h4>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {selected.rain > 60 ? (
              <>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                  <div className="text-sm sm:text-base font-semibold text-blue-900 mb-1">⚠️ High Rain Expected</div>
                  <p className="text-xs sm:text-sm text-blue-700">Postpone irrigation and spraying activities</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                  <div className="text-sm sm:text-base font-semibold text-green-900 mb-1">✓ Good for Storage</div>
                  <p className="text-xs sm:text-sm text-green-700">Ensure proper drainage in fields</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
                  <div className="text-sm sm:text-base font-semibold text-amber-900 mb-1">💡 Tip</div>
                  <p className="text-xs sm:text-sm text-amber-700">Cover harvested crops to prevent damage</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                  <div className="text-sm sm:text-base font-semibold text-green-900 mb-1">✓ Good for Planting</div>
                  <p className="text-xs sm:text-sm text-green-700">Ideal conditions for sowing seeds</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                  <div className="text-sm sm:text-base font-semibold text-blue-900 mb-1">💧 Irrigation Needed</div>
                  <p className="text-xs sm:text-sm text-blue-700">Plan watering schedule for crops</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
                  <div className="text-sm sm:text-base font-semibold text-amber-900 mb-1">☀️ Sun Protection</div>
                  <p className="text-xs sm:text-sm text-amber-700">High UV - protect sensitive crops</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
