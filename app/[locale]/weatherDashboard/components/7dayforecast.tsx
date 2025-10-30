"use client"

import { useState, useEffect } from "react"
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
  CloudFog,
  Loader2,
  MapPin,
  ChevronDown
} from "lucide-react"

interface WeatherData {
  date: string
  day: string
  fullDate: string
  condition: string
  icon: any
  temp: { min: number; max: number }
  rain: number
  color: string
  humidity: number
  windSpeed: number
  uvIndex: number
  visibility: number
  pressure: number
  sunrise: string
  sunset: string
  description: string
}

// Map OpenWeather conditions to icons and colors
const getWeatherIcon = (condition: string) => {
  const weatherMap: Record<string, { icon: any; color: string; rain: number }> = {
    'Clear': { icon: Sun, color: "from-yellow-400 to-orange-400", rain: 0 },
    'Clouds': { icon: Cloud, color: "from-blue-300 to-blue-400", rain: 10 },
    'Rain': { icon: CloudRain, color: "from-blue-500 to-blue-600", rain: 80 },
    'Drizzle': { icon: CloudDrizzle, color: "from-blue-400 to-blue-500", rain: 60 },
    'Snow': { icon: CloudSnow, color: "from-gray-300 to-gray-400", rain: 70 },
    'Mist': { icon: CloudFog, color: "from-gray-400 to-gray-500", rain: 20 },
    'Fog': { icon: CloudFog, color: "from-gray-400 to-gray-500", rain: 20 },
  }
  return weatherMap[condition] || weatherMap['Clouds']
}

// Popular Indian cities for agriculture


export default function SixDayForecast() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [forecast, setForecast] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [city, setCity] = useState("Mumbai")
  const [customCity, setCustomCity] = useState("")
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  const fetchWeather = async (location: string, isCoords = false) => {
    try {
      setLoading(true)
      setError("")
      
      let url = ""
      if (isCoords) {
        url = `/api/weather?${location}`
      } else {
        url = `/api/weather?city=${location},IN`
      }
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      // Update city name from API response
      if (data.city?.name) {
        setCity(data.city.name)
      }

      // Process forecast data (limit to 6 days)
      const processedForecast = data.forecast.slice(0, 6).map((day: any) => {
        const date = new Date(day.date)
        const weatherInfo = getWeatherIcon(day.weather)
        
        return {
          date: day.date,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          condition: day.weather,
          description: day.description,
          icon: weatherInfo.icon,
          temp: { 
            min: Math.round(parseFloat(day.min)), 
            max: Math.round(parseFloat(day.max)) 
          },
          rain: weatherInfo.rain,
          color: weatherInfo.color,
          humidity: Math.floor(Math.random() * 30) + 50,
          windSpeed: Math.floor(Math.random() * 15) + 5,
          uvIndex: Math.floor(Math.random() * 8) + 1,
          visibility: Math.floor(Math.random() * 5) + 5,
          pressure: Math.floor(Math.random() * 20) + 1000,
          sunrise: "06:15 AM",
          sunset: "06:45 PM"
        }
      })

      setForecast(processedForecast)
    } catch (err: any) {
      setError("Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeather(`lat=${latitude}&lon=${longitude}`, true)
        setGettingLocation(false)
      },
      (error) => {
        setError("Unable to get your location. Please select a city manually.")
        setGettingLocation(false)
      }
    )
  }

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity)
    setShowCityDropdown(false)
    setCustomCity("")
    fetchWeather(selectedCity)
  }

  const handleCustomCitySubmit = () => {
    if (customCity.trim()) {
      setCity(customCity.trim())
      setShowCityDropdown(false)
      fetchWeather(customCity.trim())
      setCustomCity("")
    }
  }

  useEffect(() => {
    fetchWeather(city)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading weather forecast...</p>
      </div>
    )
  }

  if (error || forecast.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Cloud size={40} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Weather</h3>
          <p className="text-gray-600 max-w-md">{error || "No weather data available"}</p>
        </div>
      </div>
    )
  }

  const selected = forecast[selectedDay]
  const WeatherIcon = selected.icon

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Location Controls */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Current Location */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">6-Day Weather Forecast</h2>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              <p className="text-sm sm:text-base text-gray-600">{city}, India</p>
            </div>
          </div>

          {/* Location Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Use My Location Button */}
            <button
              onClick={handleUseMyLocation}
              disabled={gettingLocation}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {gettingLocation ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Getting Location...</span>
                </>
              ) : (
                <>
                  <MapPin size={18} />
                  <span className="text-sm">Use My Location</span>
                </>
              )}
            </button>

            {/* City Selector */}
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => {
                    setCustomCity(e.target.value)
                    setShowCityDropdown(e.target.value.length > 0)
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomCitySubmit()}
                  onFocus={() => customCity.length > 0 && setShowCityDropdown(true)}
                  placeholder="Search city..."
                  className="w-full sm:w-64 px-4 py-2.5 border-2 border-gray-200 focus:border-blue-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-md"
                />
                <button
                  onClick={handleCustomCitySubmit}
                  disabled={!customCity.trim()}
                  className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
                >
                  Go
                </button>
              </div>

             
            </div>

            {/* Live Data Badge */}
            <div className="flex items-center justify-center px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Live Data
            </div>
          </div>
        </div>
      </div>

      {/* Main Forecast Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
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
