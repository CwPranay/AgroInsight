"use client"
import mockMarkets from "@/mockData/markets.json"
import { MapPin, Navigation, Store, TrendingUp, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface CropsFilterProps {
    state: string | undefined
    district: string | undefined
}

interface Market {
    market_id: number
    market_name: string
    state_name: string
    district_name: string
    distance: number
    type: string
}

export default function NearbyMarket({ state, district }: CropsFilterProps) {
    const t = useTranslations("dashboard")
    const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)

    // Only filter markets if location is selected
    const filteredMarkets = (state || district) 
        ? mockMarkets
            .filter((market) => {
                const stateMatch = state ? market.state_name === state : true
                const districtMatch = district ? market.district_name === district : true
                return stateMatch && districtMatch
            })
            .sort((a, b) => a.distance - b.distance)
        : []

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Section Title - Modern Design */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Nearby Markets</h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {!state && !district 
                                ? "Select a location to view nearby markets"
                                : filteredMarkets.length === 0
                                ? `No markets found in ${district || state}`
                                : `${filteredMarkets.length} market${filteredMarkets.length !== 1 ? 's' : ''} in ${district || state}`
                            }
                        </p>
                    </div>
                </div>
                {(state || district) && filteredMarkets.length > 0 && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg">
                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                            {district || state}
                        </span>
                    </div>
                )}
            </div>

            {/* Empty State - No location selected */}
            {!state && !district && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 sm:p-12 text-center border-2 border-dashed border-green-300 dark:border-green-700">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin size={32} className="text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Select Location
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Choose a state or district above to view nearby agricultural markets
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State - No markets found */}
            {(state || district) && filteredMarkets.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Store size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            No Markets Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            No agricultural markets available for the selected location
                        </p>
                    </div>
                </div>
            )}

            {/* Markets Grid - Only show when markets exist */}
            {filteredMarkets.length > 0 && (
                <>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredMarkets.map((market, index) => (
                    <div
                        key={market.market_id}
                        onClick={() => setSelectedMarket(market)}
                        className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:shadow-xl transition-all duration-300 cursor-pointer relative"
                    >
                        {index === 0 && (
                            <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                                Nearest
                            </div>
                        )}

                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {market.market_name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    <MapPin size={14} className="flex-shrink-0" />
                                    <span className="truncate">{market.district_name}</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <span className="inline-flex items-center px-2 sm:px-2.5 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                                    {market.type}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="truncate">{market.state_name}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Navigation size={16} className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="font-semibold">{market.distance} km away</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Active
                                </span>
                                <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                    View Details
                                    <TrendingUp size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                        <span className="font-semibold">💡 Tip:</span> Markets are sorted by distance. Click on any market to view more details and current prices.
                    </p>
                </div>
                </>
            )}

            {selectedMarket && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedMarket(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        {/* Fixed Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 sm:p-6 rounded-t-2xl flex-shrink-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{selectedMarket.market_name}</h2>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <MapPin size={16} />
                                        <span className="text-sm">{selectedMarket.district_name}, {selectedMarket.state_name}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMarket(null)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <X size={24} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Store size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Market Type</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedMarket.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Distance</p>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{selectedMarket.distance} km</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Today's Mandi Prices</h3>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    {[
                                        { crop: 'Wheat', icon: '🌾', price: 2466, change: '4.4', up: true },
                                        { crop: 'Rice', icon: '🌾', price: 2651, change: '0.1', up: false },
                                        { crop: 'Onion', icon: '🧅', price: 2076, change: '5.0', up: true },
                                        { crop: 'Potato', icon: '🥔', price: 1574, change: '2.9', up: false },
                                        { crop: 'Tomato', icon: '🍅', price: 1971, change: '0.1', up: false },
                                        { crop: 'Cotton', icon: '🌱', price: 5813, change: '2.8', up: true },
                                        { crop: 'Soybean', icon: '🫘', price: 4159, change: '4.1', up: true },
                                        { crop: 'Maize', icon: '🌽', price: 1996, change: '4.8', up: true }
                                    ].map((item) => (
                                        <div key={item.crop} className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-lg">{item.icon}</span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.crop}</span>
                                                </div>
                                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                                    item.up
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                }`}>
                                                    {item.up ? '↑' : '↓'}{item.change}%
                                                </span>
                                            </div>
                                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">₹{item.price}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">/ quintal</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-xs text-blue-800 dark:text-blue-300">
                                        <span className="font-semibold">ℹ️ Note:</span> Prices are indicative and may vary. Please verify at the market before making transactions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
