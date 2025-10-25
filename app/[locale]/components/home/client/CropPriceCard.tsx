"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CropPriceCardProps {
  name: string
  price: string
  change: string
  trend: "up" | "down"
  unit: string
  index: number
}

export function CropPriceCard({ name, price, change, trend, unit, index }: CropPriceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors duration-300 group"
    >
      <div>
        <h4 className="font-semibold text-gray-900 text-lg">{name}</h4>
        <p className="text-sm text-gray-500">{unit}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-900">{price}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend === "up" ? "text-green-600" : "text-red-600"
        }`}>
          {trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}
        </div>
      </div>
    </motion.div>
  )
}
