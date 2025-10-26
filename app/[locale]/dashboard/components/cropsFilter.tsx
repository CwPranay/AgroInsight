"use client"

import { useState, useMemo } from "react"
import { Search, X, ChevronDown, TrendingUp, TrendingDown, Minus, Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { crops } from "@/mockData/crops"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/app/[locale]/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/[locale]/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/[locale]/components/ui/select"

export default function FilterBar() {
  const t = useTranslations("dashboard.filterBar")
  const [crop, setCrop] = useState("")
  const [state, setState] = useState("")
  const [cropSearch, setCropSearch] = useState("")
  const [stateSearch, setStateSearch] = useState("")
  const [cropOpen, setCropOpen] = useState(false)
  const [stateOpen, setStateOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [priceSort, setPriceSort] = useState<"none" | "high-to-low" | "low-to-high">("none")

  // Filter crops based on search
  const filteredCrops = useMemo(() => {
    if (!cropSearch) return []
    return crops.filter((item) =>
      item.crop.toLowerCase().includes(cropSearch.toLowerCase())
    )
  }, [cropSearch])

  // Filter states based on search
  const filteredStates = useMemo(() => {
    if (!stateSearch) return []
    return crops.filter((item) =>
      item.state.toLowerCase().includes(stateSearch.toLowerCase())
    )
  }, [stateSearch])

  const uniqueStates = [...new Set(filteredStates.map((item) => item.state))]
  const uniqueCrops = [...new Set(filteredCrops.map((item) => item.crop))]

  const cropsToShow = useMemo(() => {
    if (!crop && !state) return []
    let filtered = crops.filter((item) => {
      const cropMatch = crop ? item.crop === crop : true
      const stateMatch = state ? item.state === state : true
      return cropMatch && stateMatch
    })

    // Sort by price if selected
    if (priceSort !== "none") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = Number(a.price)
        const priceB = Number(b.price)
        return priceSort === "high-to-low" ? priceB - priceA : priceA - priceB
      })
    }

    return filtered
  }, [crop, state, priceSort])

  // Get highest price market
  const highestPriceMarket = useMemo(() => {
    if (cropsToShow.length === 0) return null
    return cropsToShow.reduce((highest, current) => {
      const currentPrice = Number(current.price)
      const highestPrice = Number(highest.price)
      return currentPrice > highestPrice ? current : highest
    })
  }, [cropsToShow])

  const handleCropSelect = (selectedCrop: string) => {
    setCrop(selectedCrop)
    setCropSearch("")
    setCropOpen(false)
  }

  const handleStateSelect = (selectedState: string) => {
    setState(selectedState)
    setStateSearch("")
    setStateOpen(false)
  }

  const clearCrop = () => {
    setCrop("")
    setCropSearch("")
  }

  const clearState = () => {
    setState("")
    setStateSearch("")
  }

  const getTrendIcon = (trend: string) => {
    if (trend.includes("↑") || trend.toLowerCase().includes("up")) {
      return <TrendingUp size={16} className="text-green-600" />
    } else if (trend.includes("↓") || trend.toLowerCase().includes("down")) {
      return <TrendingDown size={16} className="text-red-600" />
    }
    return <Minus size={16} className="text-gray-400" />
  }

  const getTrendColor = (trend: string) => {
    if (trend.includes("↑") || trend.toLowerCase().includes("up")) {
      return "text-green-600 bg-green-50"
    } else if (trend.includes("↓") || trend.toLowerCase().includes("down")) {
      return "text-red-600 bg-red-50"
    }
    return "text-gray-600 bg-gray-50"
  }

  return (
    <div className="w-full space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Crop Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {t("cropLabel")}
            </label>
            <Popover open={cropOpen} onOpenChange={setCropOpen}>
              <PopoverTrigger asChild>
                <div
                  role="button"
                  tabIndex={0}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 cursor-pointer ${crop
                    ? "border-amber-400 bg-amber-50/50"
                    : "border-gray-200 hover:border-amber-300"
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setCropOpen(!cropOpen)
                    }
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Search size={18} className="text-amber-500 flex-shrink-0" />
                    <span className={`truncate ${crop ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                      {crop || t("cropPlaceholder")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {crop && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          clearCrop()
                        }}
                        className="p-1 hover:bg-amber-100 rounded-full transition-colors cursor-pointer"
                      >
                        <X size={16} className="text-gray-500" />
                      </span>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform ${cropOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command className="rounded-lg border-0">
                  <CommandInput
                    placeholder={t("cropSearchPlaceholder")}
                    value={cropSearch}
                    onValueChange={setCropSearch}
                    className="border-0"
                  />
                  <CommandList>
                    {cropSearch && filteredCrops.length === 0 && (
                      <CommandEmpty>{t("noCropsFound")}</CommandEmpty>
                    )}
                    {cropSearch && filteredCrops.length > 0 && (
                      <>
                        {uniqueCrops.map((item) => (
                          <CommandItem
                            key={item}
                            onSelect={() => handleCropSelect(item)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>{item}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </>
                    )}
                    {!cropSearch && (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        {t("startTyping")}
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {crop && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-xs font-medium text-amber-700">{t("selected")}:</span>
                <span className="text-sm font-semibold text-amber-900">{crop}</span>
              </div>
            )}
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {t("stateLabel")}
            </label>
            <Popover open={stateOpen} onOpenChange={setStateOpen}>
              <PopoverTrigger asChild>
                <div
                  role="button"
                  tabIndex={0}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 cursor-pointer ${state
                    ? "border-amber-400 bg-amber-50/50"
                    : "border-gray-200 hover:border-amber-300"
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setStateOpen(!stateOpen)
                    }
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Search size={18} className="text-amber-500 flex-shrink-0" />
                    <span className={`truncate ${state ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                      {state || t("statePlaceholder")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {state && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          clearState()
                        }}
                        className="p-1 hover:bg-amber-100 rounded-full transition-colors cursor-pointer"
                      >
                        <X size={16} className="text-gray-500" />
                      </span>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform ${stateOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command className="rounded-lg border-0">
                  <CommandInput
                    placeholder={t("stateSearchPlaceholder")}
                    value={stateSearch}
                    onValueChange={setStateSearch}
                    className="border-0"
                  />
                  <CommandList>
                    {stateSearch && filteredStates.length === 0 && (
                      <CommandEmpty>{t("noStatesFound")}</CommandEmpty>
                    )}
                    {stateSearch && filteredStates.length > 0 && (
                      <>
                        {uniqueStates.map((item) => (
                          <CommandItem
                            key={item}
                            onSelect={() => handleStateSelect(item)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span>{item}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </>
                    )}
                    {!stateSearch && (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        {t("startTyping")}
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {state && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-xs font-medium text-blue-700">{t("selected")}:</span>
                <span className="text-sm font-semibold text-blue-900">{state}</span>
              </div>
            )}
          </div>

          {/* Price Sort Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Sort by Price
            </label>
            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <PopoverTrigger asChild>
                <div
                  role="button"
                  tabIndex={0}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 cursor-pointer ${priceSort !== "none"
                      ? "border-amber-400 bg-amber-50/50"
                      : "border-gray-200 hover:border-amber-300"
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSortOpen(!sortOpen)
                    }
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Search size={18} className="text-amber-500 flex-shrink-0" />
                    <span className={`truncate ${priceSort !== "none" ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                      {priceSort === "none" ? "No Sorting" : priceSort === "high-to-low" ? "Highest to Lowest" : "Lowest to Highest"}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="rounded-lg border-0 p-2 space-y-1">
                  {[
                    { value: "none", label: "No Sorting" },
                    { value: "high-to-low", label: "Highest to Lowest" },
                    { value: "low-to-high", label: "Lowest to Highest" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setPriceSort(option.value as "none" | "high-to-low" | "low-to-high")
                        setSortOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${priceSort === option.value
                          ? "bg-amber-50 text-amber-900 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {priceSort !== "none" && (
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-xs font-medium text-purple-700">Sorted:</span>
                <span className="text-sm font-semibold text-purple-900">
                  {priceSort === "high-to-low" ? "High → Low" : "Low → High"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(crop || state) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">{t("activeFilters")}:</span>
              {crop && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-full">
                  <span>{crop}</span>
                  <button
                    onClick={clearCrop}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {state && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-full">
                  <span>{state}</span>
                  <button
                    onClick={clearState}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {priceSort !== "none" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
                  <span>{priceSort === "high-to-low" ? "High → Low" : "Low → High"}</span>
                  <button
                    onClick={() => setPriceSort("none")}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {(crop || state || priceSort !== "none") && (
                <button
                  onClick={() => {
                    clearCrop()
                    clearState()
                    setPriceSort("none")
                  }}
                  className="text-sm text-gray-500 hover:text-amber-600 font-medium transition-colors ml-2"
                >
                  {t("clearAll")}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        {!crop && !state ? (
          // No filters selected
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Filter size={40} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Filters Selected</h3>
            <p className="text-gray-600 max-w-md">
              Please select a crop or state from the filters above to view market data.
            </p>
          </div>
        ) : cropsToShow.length === 0 ? (
          // No data found
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <X size={40} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Found</h3>
            <p className="text-gray-600 max-w-md">
              No market data available for the selected filters. Try different combinations.
            </p>
          </div>
        ) : (
          <>
            {/* Highest Price Market Card */}
            {highestPriceMarket && (
              <div className="mb-6 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl p-6 shadow-xl border-2 border-amber-300 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                        <TrendingUp size={16} className="text-white" />
                        <span className="text-xs font-bold text-white">HIGHEST PRICE</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{highestPriceMarket.crop}</h3>
                      <p className="text-amber-100 text-lg">{highestPriceMarket.market}, {highestPriceMarket.state}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-white mb-1">{highestPriceMarket.price}</div>
                      <div className="text-sm text-amber-100">per quintal</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-amber-100">Date</p>
                        <p className="text-sm font-semibold text-white">{highestPriceMarket.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-100">Trend</p>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                          {getTrendIcon(highestPriceMarket.trend)}
                          <span className="text-sm font-semibold text-white">{highestPriceMarket.trend}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <p className="text-xs text-amber-100">Best Market</p>
                      <p className="text-sm font-bold text-white">Top Price</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Crop</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Market</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {cropsToShow.map((item, index) => (
                    <tr
                      key={`${item.crop}-${item.market}-${index}`}
                      className="border-b border-gray-100 hover:bg-amber-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.crop}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{item.market}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{item.state}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.price} / quintal</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{item.date}</td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(item.trend)}`}>
                          {getTrendIcon(item.trend)}
                          <span>{item.trend}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {cropsToShow.map((item, index) => (
                <div
                  key={`${item.crop}-${item.market}-${index}`}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.crop}</h3>
                      <p className="text-sm text-gray-600">{item.market}</p>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                      <span>{item.trend}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">State</p>
                      <p className="text-sm font-medium text-gray-900">{item.state}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-sm font-bold text-amber-600">{item.price}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm text-gray-700">{item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Count */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{cropsToShow.length}</span> result{cropsToShow.length !== 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
