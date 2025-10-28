"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CloudRain, Droplets } from "lucide-react"

interface WeatherCardProps {
  title: string
  condition: string
  rainfallLabel: string
  humidityLabel: string
  forecastButton: string
}

export function WeatherCard({ title, condition, rainfallLabel, humidityLabel, forecastButton }: WeatherCardProps) {
  const router= useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 shadow-lg text-white"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        <CloudRain size={32} className="opacity-80" />
      </div>

      <div className="mb-8">
        <div className="text-6xl font-bold mb-2">28°C</div>
        <div className="text-xl opacity-90">{condition}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CloudRain size={20} />
            <span className="text-sm opacity-90">{rainfallLabel}</span>
          </div>
          <div className="text-2xl font-bold">45mm</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={20} />
            <span className="text-sm opacity-90">{humidityLabel}</span>
          </div>
          <div className="text-2xl font-bold">68%</div>
        </motion.div>
      </div>

      <button onClick={()=>router.push("/weatherDashboard?=weather-forecast")} className="w-full mt-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
        {forecastButton}
      </button>
    </motion.div>
  )
}
