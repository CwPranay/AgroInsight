"use client"

import { useState, useMemo } from "react"
import { Search, X, ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { crops } from "@/mockData/crops"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/app/[locale]/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/[locale]/components/ui/popover"






export default function FilterBar() {
    const t = useTranslations("dashboard.filterBar")
    const [crop, setCrop] = useState("")
    const [state, setState] = useState("")
    const [cropSearch, setCropSearch] = useState("")
    const [stateSearch, setStateSearch] = useState("")
    const [cropOpen, setCropOpen] = useState(false)
    const [stateOpen, setStateOpen] = useState(false)




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
    const uniqueStates = [...new Set(filteredStates.map((item) => item.state))];
    const cropsToShow = useMemo(() => {
        if (!crop && !state) return [] // don’t show anything until user selects
        return crops.filter((item) => {
            const cropMatch = crop ? item.crop === crop : true
            const stateMatch = state ? item.state === state : true
            return cropMatch && stateMatch
        })
    }, [crop, state])

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

    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-lg border border-amber-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    if (e.key === 'Enter' || e.key === ' ') {
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
                                                    key={item.crop}
                                                    onSelect={() => handleCropSelect(item.crop)}
                                                    className="cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                        <span>{item.crop}</span>
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
                                    if (e.key === 'Enter' || e.key === ' ') {
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
                        {(crop || state) && (
                            <button
                                onClick={() => {
                                    clearCrop()
                                    clearState()
                                }}
                                className="text-sm text-gray-500 hover:text-amber-600 font-medium transition-colors ml-2"
                            >
                                {t("clearAll")}
                            </button>
                        )}
                    </div>
                </div>
            )}
            <div>
                <table className="w-full mt-6 table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Crop</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Market</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">State</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Price</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Trend</th>

                        </tr>
                        </thead>
                        <tbody>
                              {cropsToShow.map((item)=>(
                                <tr key={`${item.crop}-${item.market}`} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{item.crop}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{item.market}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{item.state}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{item.price}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{item.date}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-800">{item.trend}</td>
                                </tr>
                              ))}
                        </tbody>

                    


                </table>

            </div>
        </div>
    )
}
