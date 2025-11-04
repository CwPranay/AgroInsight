"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Droplets, Sprout, Sun, Cloud, Leaf, MapPin, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
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
}

const mockTips: IrrigationTip[] = [
    {
        id: 1,
        crop: "Rice",
        season: "Kharif",
        state: "Maharashtra",
        district: "Pune",
        city: "Pune",
        title: "Maintain Standing Water",
        description: "Keep 2-3 inches of standing water during vegetative stage. Drain 7-10 days before harvest for better grain quality.",
        icon: "💦"
    },
    {
        id: 2,
        crop: "Wheat",
        season: "Rabi",
        state: "Punjab",
        district: "Ludhiana",
        city: "Ludhiana",
        title: "Critical Growth Stage Watering",
        description: "Irrigate at crown root initiation, tillering, jointing, flowering, and grain filling stages. Avoid waterlogging.",
        icon: "🌾"
    },
    {
        id: 3,
        crop: "Cotton",
        season: "Kharif",
        state: "Gujarat",
        district: "Ahmedabad",
        city: "Ahmedabad",
        title: "Drip Irrigation Recommended",
        description: "Use drip irrigation to save 40% water. Water deeply but less frequently to encourage deep root growth.",
        icon: "🌱"
    },
    {
        id: 4,
        crop: "Sugarcane",
        season: "Summer",
        state: "Maharashtra",
        district: "Kolhapur",
        city: "Kolhapur",
        title: "Frequent Light Irrigation",
        description: "Water every 7-10 days during summer. Increase frequency during tillering and grand growth phases.",
        icon: "💧"
    },
    {
        id: 5,
        crop: "Maize",
        season: "Kharif",
        state: "Karnataka",
        district: "Bangalore",
        city: "Bangalore",
        title: "Moisture at Tasseling",
        description: "Ensure adequate moisture during tasseling and silking stages. Water stress here reduces yield significantly.",
        icon: "🌽"
    },
    {
        id: 6,
        crop: "Potato",
        season: "Rabi",
        state: "Uttar Pradesh",
        district: "Agra",
        city: "Agra",
        title: "Consistent Soil Moisture",
        description: "Maintain consistent moisture throughout growth. Avoid water stress during tuber formation for uniform size.",
        icon: "🥔"
    },
    {
        id: 7,
        crop: "Tomato",
        season: "Winter",
        state: "Maharashtra",
        district: "Pune",
        city: "Pune",
        title: "Mulching & Drip System",
        description: "Use mulch to retain moisture. Drip irrigation at root zone prevents leaf diseases and saves water.",
        icon: "🍅"
    },
    {
        id: 8,
        crop: "Groundnut",
        season: "Kharif",
        state: "Gujarat",
        district: "Rajkot",
        city: "Rajkot",
        title: "Avoid Excess Water",
        description: "Groundnut is drought-tolerant. Avoid waterlogging which causes root rot. Water during pod formation.",
        icon: "🥜"
    },
    {
        id: 9,
        crop: "Soybean",
        season: "Kharif",
        state: "Madhya Pradesh",
        district: "Indore",
        city: "Indore",
        title: "Critical Flowering Stage",
        description: "Ensure adequate moisture during flowering and pod filling. Water stress reduces pod count and seed size.",
        icon: "🌱"
    },
    {
        id: 10,
        crop: "Onion",
        season: "Rabi",
        state: "Maharashtra",
        district: "Nashik",
        city: "Nashik",
        title: "Light Frequent Watering",
        description: "Shallow roots need frequent light irrigation. Stop watering 10-15 days before harvest for better storage.",
        icon: "🧅"
    },
    {
        id: 11,
        crop: "Cabbage",
        season: "Winter",
        state: "Karnataka",
        district: "Bangalore",
        city: "Bangalore",
        title: "Regular Moisture Supply",
        description: "Water regularly to prevent head splitting. Maintain consistent moisture for compact head formation.",
        icon: "🥬"
    },
    {
        id: 12,
        crop: "Mango",
        season: "Summer",
        state: "Maharashtra",
        district: "Ratnagiri",
        city: "Ratnagiri",
        title: "Deep Watering in Summer",
        description: "Water deeply once a week during summer. Reduce watering during flowering to prevent flower drop.",
        icon: "🥭"
    }
]

// Automatically determine current season based on month
const getCurrentSeason = (): string => {
    const month = new Date().getMonth() + 1 // 1-12

    // Indian agricultural seasons:
    // Kharif: June-October (Monsoon crops)
    // Rabi: November-March (Winter crops)
    // Summer/Zaid: April-May (Summer crops)

    if (month >= 6 && month <= 10) {
        return "Kharif"
    } else if (month >= 11 || month <= 3) {
        return "Rabi"
    } else if (month >= 4 && month <= 5) {
        return "Summer"
    } else {
        return "Winter"
    }
}

// Extract unique values for filters
const states = ["All", ...Array.from(new Set(mockTips.map(tip => tip.state))).sort()]
const getDistrictsForState = (state: string) => {
    if (state === "All") return ["All"]
    return ["All", ...Array.from(new Set(mockTips.filter(tip => tip.state === state).map(tip => tip.district))).sort()]
}
const getCitiesForDistrict = (state: string, district: string) => {
    if (state === "All" || district === "All") return ["All"]
    return ["All", ...Array.from(new Set(mockTips.filter(tip => tip.state === state && tip.district === district).map(tip => tip.city))).sort()]
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
    const currentSeason = getCurrentSeason()
    const translatedSeason = t(`seasons.${currentSeason}`)
    const [selectedState, setSelectedState] = useState("All")
    const [selectedDistrict, setSelectedDistrict] = useState("All")
    const [selectedCity, setSelectedCity] = useState("All")
    const [gettingLocation, setGettingLocation] = useState(false)
    const [userLocation, setUserLocation] = useState<{ state: string; district: string; city: string } | null>(null)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

    // Get available districts and cities based on selections
    const availableDistricts = getDistrictsForState(selectedState)
    const availableCities = getCitiesForDistrict(selectedState, selectedDistrict)

    // Filter tips based on location and current season
    const filteredTips = mockTips.filter(tip => {
        const seasonMatch = tip.season === currentSeason
        const stateMatch = selectedState === "All" || tip.state === selectedState
        const districtMatch = selectedDistrict === "All" || tip.district === selectedDistrict
        const cityMatch = selectedCity === "All" || tip.city === selectedCity
        return seasonMatch && stateMatch && districtMatch && cityMatch
    })

    // Handle state change - reset district and city
    const handleStateChange = (state: string) => {
        setSelectedState(state)
        setSelectedDistrict("All")
        setSelectedCity("All")
    }

    // Handle district change - reset city
    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district)
        setSelectedCity("All")
    }

    // Show toast notification
    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 5000) // Auto-hide after 5 seconds
    }

    // Get user location and reverse geocode to get state/district/city
    const handleUseMyLocation = async () => {
        if (!navigator.geolocation) {
            showToast(t("toast.geolocationNotSupported"), "error")
            return
        }

        setGettingLocation(true)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords

                try {
                    // Use Nominatim (OpenStreetMap) reverse geocoding API
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                        {
                            headers: {
                                'User-Agent': 'AgroInsight/1.0'
                            }
                        }
                    )

                    if (!response.ok) throw new Error('Geocoding failed')

                    const data = await response.json()
                    const address = data.address

                    // Extract location details
                    const state = address.state || address.region || "Maharashtra"
                    const district = address.county || address.state_district || address.city || "Pune"
                    const city = address.city || address.town || address.village || address.suburb || "Pune"

                    const location = {
                        state: state,
                        district: district,
                        city: city
                    }

                    console.log('Detected location:', location)

                    setUserLocation(location)

                    // Try to match with available states in our data
                    const matchedState = states.find(s =>
                        s.toLowerCase().includes(state.toLowerCase()) ||
                        state.toLowerCase().includes(s.toLowerCase())
                    )

                    if (matchedState && matchedState !== "All") {
                        setSelectedState(matchedState)

                        // Try to match district
                        const districtsForState = getDistrictsForState(matchedState)
                        const matchedDistrict = districtsForState.find(d =>
                            d.toLowerCase().includes(district.toLowerCase()) ||
                            district.toLowerCase().includes(d.toLowerCase())
                        )

                        if (matchedDistrict && matchedDistrict !== "All") {
                            setSelectedDistrict(matchedDistrict)

                            // Try to match city
                            const citiesForDistrict = getCitiesForDistrict(matchedState, matchedDistrict)
                            const matchedCity = citiesForDistrict.find(c =>
                                c.toLowerCase().includes(city.toLowerCase()) ||
                                city.toLowerCase().includes(c.toLowerCase())
                            )

                            if (matchedCity && matchedCity !== "All") {
                                setSelectedCity(matchedCity)
                            }
                        }
                    } else {
                        // If no match found, show the detected location but don't filter
                        showToast(`${t("location.yourLocation")}: ${city}, ${district}, ${state}. ${t("toast.noTipsForLocation")} ${translatedSeason} ${t("filters.season")}.`, "info")
                    }

                    setGettingLocation(false)
                    showToast(t("toast.locationSuccess"), "success")
                } catch (error) {
                    console.error('Reverse geocoding error:', error)
                    showToast(t("toast.locationError"), "error")
                    setGettingLocation(false)
                }
            },
            (error) => {
                console.error('Geolocation error:', error)
                let errorMessage = ""

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = t("toast.permissionDenied")
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = t("toast.positionUnavailable")
                        break
                    case error.TIMEOUT:
                        errorMessage = t("toast.timeout")
                        break
                    default:
                        errorMessage = t("toast.genericError")
                }

                showToast(errorMessage, "error")
                setGettingLocation(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
    }

    // Clear all filters
    const clearFilters = () => {
        setSelectedState("All")
        setSelectedDistrict("All")
        setSelectedCity("All")
        setUserLocation(null)
    }

    const hasActiveFilters = selectedState !== "All" || selectedDistrict !== "All" || selectedCity !== "All"

    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="space-y-8">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3">
                        <span>Smart Irrigation Tips</span>
                        <span className="text-4xl">💧</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                        {hasActiveFilters
                            ? "Location-based irrigation insights for the current season."
                            : "Select your location to get personalized irrigation tips for the current season."
                        }
                    </p>

                    {/* Current Season Badge - Only show after location is selected */}
                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getSeasonColor(currentSeason)} text-white rounded-full shadow-lg`}
                        >
                            {getSeasonIcon(currentSeason)}
                            <span className="font-semibold">Current Season: {currentSeason}</span>
                        </motion.div>
                    )}
                </div>

                {/* Filter Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
                    {/* Use My Location Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                {t("location.quickAccess")}
                            </span>
                        </div>
                        <button
                            onClick={handleUseMyLocation}
                            disabled={gettingLocation}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {gettingLocation ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{t("location.gettingLocation")}</span>
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-4 h-4" />
                                    <span>{t("location.useMyLocation")}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Location Display */}
                    {userLocation && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                    {t("location.yourLocation")}: {userLocation.city}, {userLocation.district}, {userLocation.state}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Filter Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* State Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                {t("filters.state")}
                            </label>
                            <select
                                value={selectedState}
                                onChange={(e) => handleStateChange(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all cursor-pointer"
                            >
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* District Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                {t("filters.district")}
                            </label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => handleDistrictChange(e.target.value)}
                                disabled={selectedState === "All"}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {availableDistricts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* City Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                {t("filters.city")}
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                disabled={selectedState === "All" || selectedDistrict === "All"}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {availableCities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Filter Summary */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            {hasActiveFilters ? (
                                <>
                                    <span className="font-semibold text-green-600 dark:text-green-400">{filteredTips.length}</span> {t("filters.tipsAvailable")} <span className="font-semibold">{translatedSeason}</span> {t("filters.season")}
                                    <span className="ml-2 text-xs text-gray-500">
                                        ({t("filters.locationFiltered")})
                                    </span>
                                </>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                    👆 {t("filters.selectLocation")}
                                </span>
                            )}
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold transition-colors"
                            >
                                {t("filters.clearFilters")}
                            </button>
                        )}
                    </div>
                </div>

                {/* Tips Grid - Only show when location is selected */}
                {hasActiveFilters ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${currentSeason}-${selectedState}-${selectedDistrict}-${selectedCity}`}
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredTips.map((tip, index) => (
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
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 cursor-pointer"
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-4xl">{tip.icon}</div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {tip.crop}
                                                </h3>
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${getSeasonColor(tip.season)} text-white text-xs font-semibold rounded-full mt-1`}>
                                                    {getSeasonIcon(tip.season)}
                                                    <span>{tip.season}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Badge */}
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <MapPin className="w-3 h-3" />
                                        <span>{tip.city}, {tip.district}</span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="space-y-3">
                                        <h4 className="text-base font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                            <Droplets className="w-4 h-4" />
                                            {tip.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {tip.description}
                                        </p>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                Active tip
                                            </span>
                                            <span>💡 Best practice</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    /* Welcome State - Before location selection */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 text-center border-2 border-dashed border-green-300 dark:border-green-700"
                    >
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="text-6xl mb-4">📍</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {t("welcome.title")}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                {t("welcome.description")}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4 mt-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                                    <div className="text-3xl mb-3">🗺️</div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {t("welcome.useLocationTitle")}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {t("welcome.useLocationDesc")}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                                    <div className="text-3xl mb-3">📝</div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {t("welcome.selectManualTitle")}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {t("welcome.selectManualDesc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Empty State - After location selection but no tips found */}
                {hasActiveFilters && filteredTips.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-4">🌾</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {t("empty.title")} {translatedSeason} {t("filters.season")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t("empty.description")}
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors"
                        >
                            {t("empty.clearButton")}
                        </button>
                    </motion.div>
                )}
            </div>
        </>
    )
}
