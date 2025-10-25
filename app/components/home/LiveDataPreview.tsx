"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, CloudRain, Droplets } from "lucide-react"
import { useTranslations } from "next-intl"

const cropPrices = [
  { name: "Wheat", nameKey: "wheat", price: "₹2,150", change: "+5.2%", trend: "up", unit: "per quintal" },
  { name: "Rice", nameKey: "rice", price: "₹3,200", change: "-2.1%", trend: "down", unit: "per quintal" },
  { name: "Cotton", nameKey: "cotton", price: "₹6,800", change: "+8.5%", trend: "up", unit: "per quintal" },
]

export function LiveDataPreview() {
  const t = useTranslations("liveData")

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Crop Prices */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{t("cropPrices.title")}</h3>
              <span className="text-sm text-gray-500">{t("cropPrices.updated")}</span>
            </div>

            <div className="space-y-4">
              {cropPrices.map((crop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors duration-300 group"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{crop.name}</h4>
                    <p className="text-sm text-gray-500">{t("cropPrices.perQuintal")}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{crop.price}</div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      crop.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {crop.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {crop.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
              {t("cropPrices.viewAll")}
            </button>
          </motion.div>

          {/* Weather Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{t("weather.title")}</h3>
              <CloudRain size={32} className="opacity-80" />
            </div>

            <div className="mb-8">
              <div className="text-6xl font-bold mb-2">28°C</div>
              <div className="text-xl opacity-90">{t("weather.condition")}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CloudRain size={20} />
                  <span className="text-sm opacity-90">{t("weather.rainfall")}</span>
                </div>
                <div className="text-2xl font-bold">45mm</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Droplets size={20} />
                  <span className="text-sm opacity-90">{t("weather.humidity")}</span>
                </div>
                <div className="text-2xl font-bold">68%</div>
              </motion.div>
            </div>

            <button className="w-full mt-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
              {t("weather.forecast")}
            </button>
          </motion.div>
        </div>

        {/* Mini Chart Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t("trends.title")}</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {[65, 72, 68, 80, 75, 85, 90].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg hover:from-amber-600 hover:to-yellow-500 transition-colors cursor-pointer"
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
