"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, X, ChevronDown, TrendingUp, Filter, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/app/[locale]/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/[locale]/components/ui/popover"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/app/[locale]/components/ui/pagination"

const ITEMS_PER_PAGE = 5

interface CropsFilterProps {
  crop: string | undefined
  setCrop: (crop: string) => void
  state: string | undefined
  setState: (state: string) => void
}

interface Commodity {
  commodity_id: number
  commodity_name: string
}

interface Geography {
  census_state_id: number
  census_state_name: string
  census_district_id: number
  census_district_name: string
}

interface Market {
  market_id: number
  market_name: string
}

interface PriceData {
  date: string
  modal_price: number
  min_price: number
  max_price: number
  market_name: string
  district_name: string
  state_name: string
  commodity_name: string
}

export default function CropsFilter({ crop, setCrop, state, setState }: CropsFilterProps) {
  const t = useTranslations("dashboard.filterBar")
  const [currentPage, setCurrentPage] = useState(1)

  const [cropSearch, setCropSearch] = useState("")
  const [stateSearch, setStateSearch] = useState("")
  const [districtSearch, setDistrictSearch] = useState("")
  const [cropOpen, setCropOpen] = useState(false)
  const [stateOpen, setStateOpen] = useState(false)
  const [districtOpen, setDistrictOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [priceSort, setPriceSort] = useState<"none" | "high-to-low" | "low-to-high">("none")

  const [district, setDistrict] = useState("")
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [geographies, setGeographies] = useState<Geography[]>([])
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Load commodities and geographies on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🚀 Starting to load data...")

        const commoditiesRes = await fetch("/api/agmarknet/commodities")
        console.log("📦 Commodities response status:", commoditiesRes.status)

        const commoditiesData = await commoditiesRes.json()
        console.log("✅ Commodities data:", commoditiesData)

        if (commoditiesData.warning) {
          console.warn("⚠️", commoditiesData.warning)
        }

        const geographiesRes = await fetch("/api/agmarknet/geographies")
        console.log("🗺️ Geographies response status:", geographiesRes.status)

        const geographiesData = await geographiesRes.json()
        console.log("✅ Geographies data:", geographiesData)

        if (geographiesData.warning) {
          console.warn("⚠️", geographiesData.warning)
        }

        const comms = commoditiesData.data || []
        const geos = geographiesData.data || []

        console.log("📊 Setting commodities:", comms.length)
        console.log("🗺️ Setting geographies:", geos.length)

        if (comms.length === 0) {
          setError("No commodities available. Please check API configuration.")
        }

        if (geos.length === 0) {
          setError("No geographies available. Please check API configuration.")
        }

        setCommodities(comms)
        setGeographies(geos)
      } catch (err: any) {
        console.error("❌ Error loading data:", err)
        setError(`Failed to load data: ${err.message}`)
      }
    }

    loadData()
  }, [])

  // Load price data when filters change
  useEffect(() => {
    const loadPriceData = async () => {
      // Need at least crop to fetch data
      if (!crop) {
        setPriceData([])
        return
      }

      setLoading(true)
      setError("")

      try {
        console.log("🔍 Searching for crop:", crop)
        console.log("📊 Total commodities:", commodities.length)
        console.log("🗺️ Total geographies:", geographies.length)

        const commodityObj = commodities.find(
          c => c.commodity_name.toLowerCase() === crop.toLowerCase()
        )

        console.log("✅ Found commodity:", commodityObj)

        if (!commodityObj) {
          console.error("❌ Commodity not found:", crop)
          setError(`Commodity "${crop}" not found in database`)
          setPriceData([])
          setLoading(false)
          return
        }

        // Get all matching geographies based on selected filters
        let matchingGeographies = geographies.filter(g => g.census_district_name) // Only district-level entries
        console.log("📍 Total district-level geographies:", matchingGeographies.length)

        // Apply filters progressively
        if (state && district) {
          // Both state and district selected - most specific
          matchingGeographies = matchingGeographies.filter(
            g => g.census_state_name.toLowerCase() === state.toLowerCase() &&
              g.census_district_name?.toLowerCase() === district.toLowerCase()
          )
          console.log(`📍 After state + district filter (${state}, ${district}):`, matchingGeographies.length)
        } else if (state) {
          // Only state selected - show all districts in that state
          matchingGeographies = matchingGeographies.filter(
            g => g.census_state_name.toLowerCase() === state.toLowerCase()
          )
          console.log(`📍 After state filter (${state}):`, matchingGeographies.length)
        } else {
          // Only crop selected - show all states/districts (limit to avoid too many API calls)
          console.log(`📍 No state/district filter - using all geographies`)
        }

        if (matchingGeographies.length === 0) {
          console.warn("⚠️ No matching geographies found")
          setError("No matching locations found for the selected filters")
          setPriceData([])
          setLoading(false)
          return
        }

        // Limit to first 20 geographies to avoid too many API calls
        const limitedGeographies = matchingGeographies.slice(0, 20)
        console.log("🎯 Fetching markets for", limitedGeographies.length, "geographies")

        // Get markets for each geography
        const allMarketsPromises = limitedGeographies.map(async (geo) => {
          try {
            console.log(`🏪 Fetching markets for ${geo.census_district_name}, ${geo.census_state_name}`)
            const marketsRes = await fetch("/api/agmarknet/markets", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                commodity_id: commodityObj.commodity_id,
                state_id: geo.census_state_id,
                district_id: geo.census_district_id
              })
            })
            const marketsData = await marketsRes.json()
            console.log(`✅ Markets found for ${geo.census_district_name}:`, marketsData.data?.length || 0)

            if (marketsData.warning) {
              console.warn("⚠️ Using mock market data for", geo.census_district_name)
            }

            return (marketsData.data || []).map((m: Market) => ({
              ...m,
              state_name: geo.census_state_name,
              district_name: geo.census_district_name,
              state_id: geo.census_state_id,
              district_id: geo.census_district_id
            }))
          } catch (err) {
            console.error("❌ Error fetching markets for", geo.census_district_name, ":", err)
            return []
          }
        })

        const allMarketsArrays = await Promise.all(allMarketsPromises)
        const allMarkets = allMarketsArrays.flat()
        console.log("🏪 Total markets found:", allMarkets.length)

        if (allMarkets.length === 0) {
          console.warn("⚠️ No markets found for this commodity and location")
          setError("No markets found for the selected crop and location")
          setPriceData([])
          setLoading(false)
          return
        }

        // Get prices for all markets (limit to first 50 to avoid too many requests)
        const today = new Date()
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 7)

        const limitedMarkets = allMarkets.slice(0, 50)
        console.log("💰 Fetching prices for", limitedMarkets.length, "markets")

        const pricesPromises = limitedMarkets.map(async (market: any) => {
          try {
            const res = await fetch("/api/agmarknet/prices", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                commodity_id: commodityObj.commodity_id,
                state_id: market.state_id,
                district_id: market.district_id,
                market_id: market.market_id,
                from_date: sevenDaysAgo.toISOString().split('T')[0],
                to_date: today.toISOString().split('T')[0]
              })
            })
            const data = await res.json()
            const priceData = data.data?.[0]
            if (priceData) {
              return {
                ...priceData,
                market_name: market.market_name,
                district_name: market.district_name,
                state_name: market.state_name,
                commodity_name: crop
              }
            }
            return null
          } catch (err) {
            console.error("Error fetching price:", err)
            return null
          }
        })

        const allPrices = await Promise.all(pricesPromises)
        const validPrices = allPrices.filter(p => p && p.modal_price)
        console.log("✅ Valid prices found:", validPrices.length)

        if (validPrices.length === 0) {
          setError("No price data available for the selected filters in the last 7 days")
        }

        setPriceData(validPrices)
      } catch (err) {
        console.error("Error loading price data:", err)
        setError("Failed to load price data")
      } finally {
        setLoading(false)
      }
    }

    loadPriceData()
  }, [crop, state, district, commodities, geographies])

  // Filter crops based on search
  const filteredCrops = useMemo(() => {
    if (!cropSearch) return []
    return commodities.filter((item) =>
      item.commodity_name.toLowerCase().includes(cropSearch.toLowerCase())
    )
  }, [cropSearch, commodities])

  // Get unique states
  const allStates = useMemo(() => {
    const stateSet = new Set<string>()
    geographies.forEach(g => {
      if (g.census_state_name) {
        stateSet.add(g.census_state_name)
      }
    })
    return Array.from(stateSet).sort()
  }, [geographies])

  // Filter states based on search
  const filteredStates = useMemo(() => {
    if (!stateSearch) return []
    return allStates.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()))
  }, [stateSearch, allStates])

  // Get districts for selected state
  const stateDistricts = useMemo(() => {
    if (!state) return []
    const districtSet = new Set<string>()
    geographies.forEach(g => {
      if (g.census_state_name === state && g.census_district_name) {
        districtSet.add(g.census_district_name)
      }
    })
    return Array.from(districtSet).sort()
  }, [state, geographies])

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (!districtSearch || !state) return []
    return stateDistricts.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase()))
  }, [districtSearch, stateDistricts])

  const cropsToShow = useMemo(() => {
    if (!crop || !state || !district) return []
    let filtered = [...priceData]

    // Sort by price if selected
    if (priceSort !== "none") {
      filtered = filtered.sort((a, b) => {
        const priceA = Number(a.modal_price)
        const priceB = Number(b.modal_price)
        return priceSort === "high-to-low" ? priceB - priceA : priceA - priceB
      })
    }

    return filtered
  }, [priceData, priceSort])

  // Pagination calculations
  const totalPages = Math.ceil(cropsToShow.length / ITEMS_PER_PAGE)
  const paginatedCrops = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return cropsToShow.slice(startIndex, endIndex)
  }, [cropsToShow, currentPage])

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [crop, state, district, priceSort])

  // Get highest price market
  const highestPriceMarket = useMemo(() => {
    if (cropsToShow.length === 0) return null
    return cropsToShow.reduce((highest, current) => {
      const currentPrice = Number(current.modal_price)
      const highestPrice = Number(highest.modal_price)
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
    setDistrict("") // Reset district when state changes
  }

  const handleDistrictSelect = (selectedDistrict: string) => {
    setDistrict(selectedDistrict)
    setDistrictSearch("")
    setDistrictOpen(false)
  }

  const clearCrop = () => {
    setCrop("")
    setCropSearch("")
  }

  const clearState = () => {
    setState("")
    setStateSearch("")
    setDistrict("")
    setDistrictSearch("")
  }

  const clearDistrict = () => {
    setDistrict("")
    setDistrictSearch("")
  }

  return (
    <div className="w-full space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-200/50">
        {error && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Filter size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">{t("notice")}</p>
                <p className="text-sm text-amber-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                        {filteredCrops.map((item) => (
                          <CommandItem
                            key={item.commodity_id}
                            onSelect={() => handleCropSelect(item.commodity_name)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>{item.commodity_name}</span>
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
                        {filteredStates.map((item: string) => (
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

          {/* District Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {t("districtLabel")}
            </label>
            <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
              <PopoverTrigger asChild>
                <div
                  role="button"
                  tabIndex={0}
                  className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200 cursor-pointer ${district
                    ? "border-amber-400 bg-amber-50/50"
                    : "border-gray-200 hover:border-amber-300"
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${!state ? "opacity-50 cursor-not-allowed" : ""}`}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && state) {
                      setDistrictOpen(!districtOpen)
                    }
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Search size={18} className="text-amber-500 flex-shrink-0" />
                    <span className={`truncate ${district ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                      {district || t("districtPlaceholder")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {district && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          clearDistrict()
                        }}
                        className="p-1 hover:bg-amber-100 rounded-full transition-colors cursor-pointer"
                      >
                        <X size={16} className="text-gray-500" />
                      </span>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform ${districtOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command className="rounded-lg border-0">
                  <CommandInput
                    placeholder={t("districtSearchPlaceholder")}
                    value={districtSearch}
                    onValueChange={setDistrictSearch}
                    className="border-0"
                    disabled={!state}
                  />
                  <CommandList>
                    {!state && (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        {t("selectStateFirst")}
                      </div>
                    )}
                    {state && districtSearch && filteredDistricts.length === 0 && (
                      <CommandEmpty>{t("noDistrictsFound")}</CommandEmpty>
                    )}
                    {state && districtSearch && filteredDistricts.length > 0 && (
                      <>
                        {filteredDistricts.map((item: string) => (
                          <CommandItem
                            key={item}
                            onSelect={() => handleDistrictSelect(item)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                              <span>{item}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </>
                    )}
                    {state && !districtSearch && (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        {t("startTyping")}
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {district && (
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-xs font-medium text-purple-700">{t("selected")}:</span>
                <span className="text-sm font-semibold text-purple-900">{district}</span>
              </div>
            )}
          </div>

          {/* Price Sort Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {t("sortLabel")}
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
                      {priceSort === "none" ? t("sortOptions.none") : priceSort === "high-to-low" ? t("sortOptions.highToLow") : t("sortOptions.lowToHigh")}
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
                    { value: "none", label: t("sortOptions.none") },
                    { value: "high-to-low", label: t("sortOptions.highToLow") },
                    { value: "low-to-high", label: t("sortOptions.lowToHigh") },
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
                <span className="text-xs font-medium text-purple-700">{t("sorted")}:</span>
                <span className="text-sm font-semibold text-purple-900">
                  {priceSort === "high-to-low" ? t("sortedHighLow") : t("sortedLowHigh")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {crop && (
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
              {district && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
                  <span>{district}</span>
                  <button
                    onClick={clearDistrict}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {priceSort !== "none" && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-full">
                  <span>{priceSort === "high-to-low" ? t("sortedHighLow") : t("sortedLowHigh")}</span>
                  <button
                    onClick={() => setPriceSort("none")}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {(crop || state || district || priceSort !== "none") && (
                <button
                  onClick={() => {
                    clearCrop()
                    clearState()
                    clearDistrict()
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 size={40} className="text-amber-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t("loading")}</h3>
            <p className="text-gray-600 max-w-md">{t("loadingMessage")}</p>
          </div>
        ) : !crop ? (
          // No crop selected
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Filter size={40} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t("noFiltersTitle")}</h3>
            <p className="text-gray-600 max-w-md">
              {t("selectCropMessage")}
            </p>
          </div>
        ) : cropsToShow.length === 0 ? (
          // No data found - show contextual message
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Filter size={40} className="text-amber-500" />
            </div>

            {/* Contextual messages based on what's selected */}
            {crop && !state && !district ? (
              // Only crop selected
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("nextStepTitle")}</h3>
                <p className="text-gray-600 max-w-2xl mb-6">
                  {t("pleaseSelectState")}
                </p>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 max-w-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-green-700">{t("cropLabel")}</p>
                      <p className="text-sm font-semibold text-green-900">{crop}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">→</div>
                    <p className="text-sm font-semibold text-amber-900">{t("selectStateNext")}</p>
                  </div>
                </div>
              </>
            ) : crop && state && !district ? (
              // Crop and state selected
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("almostThere")}</h3>
                <p className="text-gray-600 max-w-2xl mb-6">
                  {t("pleaseSelectDistrict")}
                </p>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 max-w-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-green-700">{t("cropLabel")}</p>
                        <p className="text-sm font-semibold text-green-900">{crop}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-green-700">{t("stateLabel")}</p>
                        <p className="text-sm font-semibold text-green-900">{state}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">→</div>
                      <p className="text-sm font-semibold text-amber-900">{t("selectDistrictNext")}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // All selected but no data
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("noDataTitle")}</h3>
                <p className="text-gray-600 max-w-2xl mb-6">
                  {t("noDataMessage")}
                </p>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200 max-w-lg">
                  <p className="text-sm font-semibold text-amber-900 mb-3">{t("currentSelection")}:</p>
                  <div className="space-y-2 text-left">
                    {crop && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-amber-700 min-w-20">{t("cropLabel")}:</span>
                        <span className="text-sm font-semibold text-amber-900">{crop}</span>
                      </div>
                    )}
                    {state && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-amber-700 min-w-20">{t("stateLabel")}:</span>
                        <span className="text-sm font-semibold text-amber-900">{state}</span>
                      </div>
                    )}
                    {district && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-amber-700 min-w-20">{t("districtLabel")}:</span>
                        <span className="text-sm font-semibold text-amber-900">{district}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-amber-700 mt-4">{t("tryDifferentFilters")}</p>
                </div>
              </>
            )}
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
                        <span className="text-xs font-bold text-white">{t("highestPrice")}</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-1">{highestPriceMarket.commodity_name}</h3>
                      <p className="text-amber-100 text-lg">{highestPriceMarket.market_name}, {highestPriceMarket.district_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-white mb-1">₹{highestPriceMarket.modal_price}</div>
                      <div className="text-sm text-amber-100">{t("perQuintal")}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-amber-100">{t("date")}</p>
                        <p className="text-sm font-semibold text-white">{new Date(highestPriceMarket.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-100">{t("priceRange")}</p>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                          <span className="text-sm font-semibold text-white">₹{highestPriceMarket.min_price} - ₹{highestPriceMarket.max_price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <p className="text-xs text-amber-100">{t("bestMarket")}</p>
                      <p className="text-sm font-bold text-white">{t("topPrice")}</p>
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t("tableHeaders.market")}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t("tableHeaders.district")}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t("tableHeaders.modalPrice")}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t("tableHeaders.minPrice")}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t("tableHeaders.maxPrice")}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">{t("tableHeaders.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCrops.map((item, index) => (
                    <tr
                      key={`${item.market_name}-${index}`}
                      className="border-b border-gray-100 hover:bg-amber-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.market_name}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{item.district_name}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-amber-600">₹{item.modal_price}</td>
                      <td className="px-4 py-4 text-sm text-green-600">₹{item.min_price}</td>
                      <td className="px-4 py-4 text-sm text-red-600">₹{item.max_price}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paginatedCrops.map((item, index) => (
                <div
                  key={`${item.market_name}-${index}`}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.market_name}</h3>
                      <p className="text-sm text-gray-600">{item.district_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t("tableHeaders.modalPrice")}</p>
                      <p className="text-sm font-bold text-amber-600">₹{item.modal_price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t("tableHeaders.date")}</p>
                      <p className="text-sm text-gray-700">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t("tableHeaders.minPrice")}</p>
                      <p className="text-sm font-medium text-green-600">₹{item.min_price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t("tableHeaders.maxPrice")}</p>
                      <p className="text-sm font-medium text-red-600">₹{item.max_price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                {t("showing")} <span className="font-semibold text-gray-900">{paginatedCrops.length}</span> {t("of")} <span className="font-semibold text-gray-900">{cropsToShow.length}</span> {cropsToShow.length !== 1 ? t("results") : t("result")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
