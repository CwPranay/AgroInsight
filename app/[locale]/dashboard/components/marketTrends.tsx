"use client"

import { cropTrends } from '@/mockData/trend'
import { useMemo, useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Activity, Calendar, DollarSign } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MarketTrendsProps {
  data: typeof cropTrends
}

export default function MarketTrends({ data }: MarketTrendsProps) {
  const t = useTranslations("dashboard.marketTrends")
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Select data to display: filtered data or first crop if no filter
  const displayData = useMemo(() => {
    if (data.length > 0) {
      return data[0] // Show first matching crop
    }
    // Show first crop when no filter is applied (consistent for SSR)
    return cropTrends[0]
  }, [data])

  // Calculate price statistics
  const priceStats = useMemo(() => {
    if (!displayData?.trend) return null

    const prices = displayData.trend.map(item => item.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const priceChange = lastPrice - firstPrice
    const priceChangePercent = ((priceChange / firstPrice) * 100).toFixed(2)

    return {
      minPrice,
      maxPrice,
      avgPrice,
      priceChange,
      priceChangePercent,
      isPositive: priceChange >= 0
    }
  }, [displayData])

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {new Date(payload[0].payload.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className="text-lg font-bold text-amber-600">
            ₹{payload[0].value}
          </p>
          <p className="text-xs text-gray-500">{t("perQuintal")}</p>
        </div>
      )
    }
    return null
  }

  if (!displayData || !isClient) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Activity size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t("noData")}</h3>
          <p className="text-gray-600 max-w-md">{t("noDataMessage")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{displayData.crop}</h3>
            <p className="text-gray-600">
              {displayData.market}, {displayData.state}
            </p>
          </div>
          {data.length === 0 && (
            <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
              <span className="text-xs font-medium text-blue-700">{t("sampleData")}</span>
            </div>
          )}
        </div>

        {/* Price Statistics Cards */}
        {priceStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Current Price Change */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                {priceStats.isPositive ? (
                  <TrendingUp size={18} className="text-green-600" />
                ) : (
                  <TrendingDown size={18} className="text-red-600" />
                )}
                <span className="text-xs font-medium text-gray-600">{t("priceChange")}</span>
              </div>
              <p className={`text-2xl font-bold ${priceStats.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {priceStats.isPositive ? '+' : ''}{priceStats.priceChangePercent}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ₹{Math.abs(priceStats.priceChange)} {t("change")}
              </p>
            </div>

            {/* Average Price */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-blue-600" />
                <span className="text-xs font-medium text-gray-600">{t("avgPrice")}</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">₹{priceStats.avgPrice}</p>
              <p className="text-xs text-gray-500 mt-1">{t("perQuintal")}</p>
            </div>

            {/* Highest Price */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-green-600" />
                <span className="text-xs font-medium text-gray-600">{t("highest")}</span>
              </div>
              <p className="text-2xl font-bold text-green-600">₹{priceStats.maxPrice}</p>
              <p className="text-xs text-gray-500 mt-1">{t("peak")}</p>
            </div>

            {/* Lowest Price */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={18} className="text-purple-600" />
                <span className="text-xs font-medium text-gray-600">{t("lowest")}</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">₹{priceStats.minPrice}</p>
              <p className="text-xs text-gray-500 mt-1">{t("bottom")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">{t("priceHistory")}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>{t("last7Days")}</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={displayData.trend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#f59e0b' }}
              fill="url(#colorPrice)"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Chart Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-gray-600">{t("marketPrice")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-gray-600">{displayData.trend.length} {t("dataPoints")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">{t("note")}:</span> {t("noteMessage")}
        </p>
      </div>
    </div>
  )
}