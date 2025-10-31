"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { MapPin, Loader2, Droplets, Leaf, TestTube, Mountain, AlertCircle } from "lucide-react"
import { 
  SoilData, 
  getPhCategory, 
  getPhColor, 
  getOrganicCarbonLevel, 
  getOrganicCarbonColor,
  getSoilTypeIcon,
  getSoilTypeColor
} from "../utils/soilHelpers"

export function SoilInsights() {
  const t = useTranslations("soilInsights")
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [error, setError] = useState("")
  const [soilData, setSoilData] = useState<SoilData | null>(null)
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 })

  const fetchSoilData = async (lat: number, lng: number) => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch(`/api/soil?lat=${lat}&lng=${lng}`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }
      
      setSoilData(data)
      setCoordinates({ lat, lng })
    } catch (err: any) {
      setError(t("errors.fetchFailed"))
    } finally {
      setLoading(false)
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError(t("errors.geolocationNotSupported"))
      return
    }

    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchSoilData(latitude, longitude)
        setGettingLocation(false)
      },
      (error) => {
        setError(t("errors.locationFailed"))
        setGettingLocation(false)
      }
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={48} className="text-green-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">{t("loading")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-900 mb-2">{t("errors.title")}</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={handleUseMyLocation}
          className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
        >
          {t("tryAgain")}
        </button>
      </div>
    )
  }

  if (!soilData) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-200 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mountain size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("welcome.title")}</h3>
          <p className="text-gray-600 mb-8">{t("welcome.description")}</p>
          
          <button
            onClick={handleUseMyLocation}
            disabled={gettingLocation}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gettingLocation ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{t("welcome.gettingLocation")}</span>
              </>
            ) : (
              <>
                <MapPin size={20} />
                <span>{t("welcome.useLocation")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  const phCategory = getPhCategory(soilData.pH)
  const phColor = getPhColor(soilData.pH)
  const ocLevel = getOrganicCarbonLevel(soilData.organicCarbon)
  const ocColor = getOrganicCarbonColor(soilData.organicCarbon)
  const soilIcon = getSoilTypeIcon(soilData.soilType)
  const soilColor = getSoilTypeColor(soilData.soilType)

  return (
    <div className="space-y-6">
      {/* Location Info */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={20} />
          <span className="font-semibold">{t("location")}</span>
        </div>
        <span className="text-sm">
          {coordinates.lat.toFixed(4)}°, {coordinates.lng.toFixed(4)}°
        </span>
      </div>

      {/* Data Source Badge */}
      {soilData.dataSource && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm">
          <span className="text-blue-700">
            {soilData.cached && '💾 '}
            {soilData.dataSource === 'open-meteo' && '🌍 Live Data from Open-Meteo'}
            {soilData.dataSource === 'agromonitoring' && '🛰️ Live Data from AgroMonitoring'}
            {soilData.dataSource === 'fallback' && '📊 Sample Data'}
          </span>
          {soilData.cached && <span className="text-blue-600 text-xs">Cached</span>}
        </div>
      )}

      {/* Soil Moisture & Temperature (if available) */}
      {(soilData.soilMoisture !== null && soilData.soilMoisture !== undefined || 
        soilData.soilTemperature !== null && soilData.soilTemperature !== undefined) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {soilData.soilMoisture !== null && soilData.soilMoisture !== undefined && (
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Droplets size={24} />
                <span className="text-sm opacity-90">{t("properties.soilMoisture")}</span>
              </div>
              <div className="text-3xl font-bold">{(soilData.soilMoisture * 100).toFixed(0)}%</div>
              <div className="text-xs opacity-75 mt-1">
                {soilData.soilMoisture > 0.3 ? t("moisture.high") : soilData.soilMoisture < 0.15 ? t("moisture.low") : t("moisture.moderate")}
              </div>
            </div>
          )}
          
          {soilData.soilTemperature !== null && soilData.soilTemperature !== undefined && (
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <TestTube size={24} />
                <span className="text-sm opacity-90">{t("properties.soilTemp")}</span>
              </div>
              <div className="text-3xl font-bold">{soilData.soilTemperature}°C</div>
              <div className="text-xs opacity-75 mt-1">
                {soilData.surfaceTemperature && `Surface: ${soilData.surfaceTemperature}°C`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Soil Properties Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Soil Type */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${soilColor} rounded-xl flex items-center justify-center text-2xl`}>
              {soilIcon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("properties.soilType")}</p>
              <p className="text-xl font-bold text-gray-900">{soilData.soilType}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>{t("properties.sand")}:</span>
              <span className="font-semibold">{soilData.sand}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t("properties.silt")}:</span>
              <span className="font-semibold">{soilData.silt}%</span>
            </div>
            <div className="flex justify-between">
              <span>{t("properties.clay")}:</span>
              <span className="font-semibold">{soilData.clay}%</span>
            </div>
          </div>
        </div>

        {/* pH Level */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${phColor} rounded-xl flex items-center justify-center`}>
              <TestTube size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("properties.pH")}</p>
              <p className="text-xl font-bold text-gray-900">{soilData.pH}</p>
            </div>
          </div>
          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${phColor} text-white text-sm font-semibold rounded-full`}>
            {t(`phLevels.${phCategory}`)}
          </div>
        </div>

        {/* Organic Carbon */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${ocColor} rounded-xl flex items-center justify-center`}>
              <Leaf size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("properties.organicCarbon")}</p>
              <p className="text-xl font-bold text-gray-900">{soilData.organicCarbon}%</p>
            </div>
          </div>
          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${ocColor} text-white text-sm font-semibold rounded-full`}>
            {t(`organicLevels.${ocLevel}`)}
          </div>
        </div>
      </div>

      {/* Insight Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Droplets size={20} className="text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{t("summary.title")}</h4>
            <p className="text-gray-700">{t(`summary.${soilData.summaryKey}`)}</p>
          </div>
        </div>
      </div>

      {/* Recommended Crops */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          {t("recommendations.title")}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {soilData.recommendedCrops.map((crop, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-center"
            >
              <p className="font-semibold text-gray-900">{crop}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">{t("recommendations.note")}</p>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleUseMyLocation}
        disabled={gettingLocation}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50"
      >
        {gettingLocation ? t("welcome.gettingLocation") : t("refresh")}
      </button>
    </div>
  )
}
