"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Droplets, Sprout, Sun, Cloud, Leaf, MapPin, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocation } from "@/app/[locale]/contexts/LocationContext"
import { Toast } from "./Toast"

interface IrrigationTip {
    id: number
    crop: string
    season: string
    state: string
    district: string
    city: string
    title: string
    description: string
    icon: string
    weatherBased?: boolean
}

const getCurrentSeason = (): string => {
    const month = new Date().getMonth() + 1
    if (month >= 6 && month <= 10) return "Kharif"
    if (month >= 11 || month <= 3) return "Rabi"
    if (month >= 4 && month <= 5) return "Summer"
    return "Winter"
}

const getSeasonIcon = (season: string) => {
    switch (season) {
        case "Kharif": return <Cloud className="w-4 h-4" />
        case "Rabi": return <Sprout className="w-4 h-4" />
        case "Summer": return <Sun className="w-4 h-4" />
        case "Winter": return <Droplets className="w-4 h-4" />
        default: return <Leaf className="w-4 h-4" />
    }
}

const getSeasonColor = (season: string) => {
    switch (season) {
        case "Kharif": return "from-blue-500 to-cyan-500"
        case "Rabi": return "from-green-500 to-emerald-500"
        case "Summer": return "from-orange-500 to-yellow-500"
        case "Winter": return "from-indigo-500 to-blue-500"
        default: return "from-gray-500 to-gray-600"
    }
}

export function IrrigationTips() {
    const t = useTranslations("irrigationTips")
    const { location: savedLocation, setLocation: saveLocation } = useLocation()
    const currentSeason = getCurrentSeason()
    const translatedSeason = t(`seasons.${currentSeason}`)
    const locale = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || 'en') : 'en'
    
    const [tips, setTips] = useState<IrrigationTip[]>([])
    const [loading, setLoading] = useState(false)
    const [customCity, setCustomCity] = useState("")
    const [gettingLocation, setGettingLocation] = useState(false)
    const [userLocation, setUserLocation] = useState<{ state: string; district: string; city: string; lat: number; lon: number } | null>(null)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 5000)
    }

    const getTranslatedToast = (key: string, fallback: string) => {
        try {
            return t(`toast.${key}`)
        } catch {
            return fallback
        }
    }

    const fetchIrrigationTips = async (lat: number, lon: number, city: string, district: string, state: string) => {
        try {
            setLoading(true)
            const response = await fetch(
                `/api/irrigation-tips?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}&state=${encodeURIComponent(state)}&season=${currentSeason}&locale=${locale}`
            )
            
            if (!response.ok) throw new Error('Failed to fetch tips')
            
            const data = await response.json()
            setTips(data.tips || [])
            
            if (data.tips.length === 0) {
                showToast(`No irrigation tips available for ${city} in ${currentSeason} season`, "info")
            }
        } catch (error) {
            console.error('Error fetching irrigation tips:', error)
            showToast("Failed to fetch irrigation tips. Please try again.", "error")
            setTips([])
        } finally {
            setLoading(false)
        }
    }

    const handleUseMyLocation = async () => {
        if (!navigator.geolocation) {
            showToast(getTranslatedToast("geolocationNotSupported", "Geolocation not supported"), "error")
            return
        }

        setGettingLocation(true)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                        { headers: { 'User-Agent': 'AgroInsight/1.0' } }
                    )

                    if (!response.ok) throw new Error('Geocoding failed')

                    const data = await response.json()
                    const address = data.address

                    const state = address.state || address.region || "Unknown"
                    const district = address.county || address.state_district || address.city || "Unknown"
                    const city = address.city || address.town || address.village || address.suburb || "Unknown"

                    const location = { state, district, city, lat: latitude, lon: longitude }
                    setUserLocation(location)

                    saveLocation({
                        latitude,
                        longitude,
                        city,
                        district,
                        state
                    })

                    await fetchIrrigationTips(latitude, longitude, city, district, state)
                    showToast(getTranslatedToast("locationSuccess", "Location detected successfully"), "success")
                } catch (error) {
                    console.error('Reverse geocoding error:', error)
                    showToast(getTranslatedToast("locationError", "Failed to get location details"), "error")
                } finally {
                    setGettingLocation(false)
                }
            },
            (error) => {
                console.error('Geolocation error:', error)
                showToast(getTranslatedToast("genericError", "Failed to get your location"), "error")
                setGettingLocation(false)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }

    const handleCustomCitySubmit = async () => {
        if (!customCity.trim()) return

        const searchCity = customCity.trim()
        setGettingLocation(true)

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchCity)},India&addressdetails=1&limit=1`,
                { headers: { 'User-Agent': 'AgroInsight/1.0' } }
            )

            if (!response.ok) throw new Error('City search failed')

            const data = await response.json()

            if (data.length === 0) {
                showToast(`City "${searchCity}" not found. Please try another city.`, "error")
                setGettingLocation(false)
                return
            }

            const result = data[0]
            const address = result.address

            const state = address.state || address.region || "Unknown"
            const district = address.county || address.state_district || address.city || "Unknown"
            const city = address.city || address.town || address.village || searchCity

            const lat = parseFloat(result.lat)
            const lon = parseFloat(result.lon)

            const location = { state, district, city, lat, lon }
            setUserLocation(location)

            saveLocation({
                latitude: lat,
                longitude: lon,
                city,
                district,
                state
            })

            await fetchIrrigationTips(lat, lon, city, district, state)
            showToast(`Found location: ${city}, ${state}`, "success")
            setCustomCity("")
        } catch (error) {
            console.error('City search error:', error)
            showToast("Failed to search city. Please try again.", "error")
        } finally {
            setGettingLocation(false)
        }
    }

    const clearFilters = () => {
        setUserLocation(null)
        setTips([])
    }

    useEffect(() => {
        if (savedLocation && savedLocation.latitude && savedLocation.longitude && tips.length === 0) {
            const { latitude, longitude, city, district, state } = savedLocation
            setUserLocation({
                city: city || "Unknown",
                district: district || "Unknown",
                state: state || "Unknown",
                lat: latitude,
                lon: longitude
            })
            fetchIrrigationTips(
                latitude,
                longitude,
                city || "Unknown",
                district || "Unknown",
                state || "Unknown"
            )
        }
    }, [])

    const hasActiveFilters = userLocation !== null

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="space-y-8">
                <div className="text-center max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                        <span>Smart Irrigation Tips</span>
                        <span className="text-3xl sm:text-4xl">💧</span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
                        {hasActiveFilters
                            ? t("subtitle.filtered")
                            : t("subtitle.default")}
                    </p>

                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r ${getSeasonColor(currentSeason)} text-white rounded-full shadow-lg text-sm sm:text-base`}
                        >
                            {getSeasonIcon(currentSeason)}
                            <span className="font-semibold">{t("currentSeason")}: {translatedSeason}</span>
                        </motion.div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {t("location.quickAccess")}
                            </span>
                        </div>
                        <button
                            onClick={handleUseMyLocation}
                            disabled={gettingLocation || loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {gettingLocation || loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{gettingLocation ? t("location.gettingLocation") : t("loadingTips")}</span>
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-4 h-4" />
                                    <span>{t("location.useMyLocation")}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {userLocation && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                            <div className="flex items-start sm:items-center gap-2 text-green-700 dark:text-green-400">
                                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                                <span className="text-xs sm:text-sm font-semibold break-words">
                                    {t("location.yourLocation")}: {userLocation.city}, {userLocation.district}, {userLocation.state}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {t("searchCity")}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={customCity}
                                onChange={(e) => setCustomCity(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCustomCitySubmit()}
                                placeholder={t("searchPlaceholder")}
                                className="flex-1 px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-400 dark:focus:border-green-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all"
                            />
                            <button
                                onClick={handleCustomCitySubmit}
                                disabled={!customCity.trim() || gettingLocation || loading}
                                className="px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors shadow-md whitespace-nowrap"
                            >
                                {t("searchButton")}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            💡 {t("searchHint")}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            {hasActiveFilters ? (
                                <div className="space-y-1">
                                    <div>
                                        <span className="font-semibold text-green-600 dark:text-green-400">{tips.length}</span> {t("tipsCount")} <span className="font-semibold">{translatedSeason}</span> {t("filters.season")}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        ({t("basedOnWeather")})
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                    👆 {t("selectLocationPrompt")}
                                </span>
                            )}
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold transition-colors whitespace-nowrap"
                            >
                                {t("clearLocation")}
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="text-green-500 animate-spin mb-4" />
                        <p className="text-lg text-gray-600">{t("loadingTips")}</p>
                    </div>
                ) : hasActiveFilters && tips.length > 0 ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${currentSeason}-${userLocation?.city}`}
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                        >
                            {tips.map((tip, index) => (
                                <motion.div
                                    key={tip.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    whileHover={{
                                        y: -8,
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                    }}
                                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="text-3xl sm:text-4xl flex-shrink-0">{tip.icon}</div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                                    {tip.crop}
                                                </h3>
                                                <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r ${getSeasonColor(tip.season)} text-white text-xs font-semibold rounded-full mt-1`}>
                                                    {getSeasonIcon(tip.season)}
                                                    <span>{tip.season}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{tip.city}, {tip.district}</span>
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        <h4 className="text-sm sm:text-base font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                            <Droplets className="w-4 h-4 flex-shrink-0" />
                                            <span className="line-clamp-2">{tip.title}</span>
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {tip.description}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                {t("weatherBased")}
                                            </span>
                                            <span>🌤️ {t("liveData")}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                ) : hasActiveFilters && tips.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-4">🌾</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {t("noTips.title")} {translatedSeason} {t("filters.season")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t("noTips.description")}
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors"
                        >
                            {t("clearLocation")}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 text-center"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4">💧</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                {t("emptyState.title")}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t("emptyState.description")}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    )
}
