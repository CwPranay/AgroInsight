"use client"
import mockMarkets from "@/mockData/markets.json"
import { useState } from "react";

interface CropsFilterProps {
    state: string | undefined

    district: string | undefined

}



export default function NearbyMarket({ state, district }: CropsFilterProps) {
    const [selectedState, setSelectedState] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("")
    if (!state && !district) {
        return (
            <div className="text-gray-500 italic text-sm">
                Select a state or district above to view nearby markets.
            </div>
        );
    }
    const filteredMarkets = mockMarkets.filter((market) => {
        const stateMatch = state ? market.state_name === state : true;
        const districtMatch = district ? market.district_name === district : true;
        return stateMatch && districtMatch;
    });

    return (
        <div >
            <h1>Nearby Markets</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredMarkets.map((market) => (
                    <div
                        key={market.market_id}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:border-green-400 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {market.market_name}
                            </h3>
                            <span className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                {market.district_name}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            📍 {market.state_name}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    )

}