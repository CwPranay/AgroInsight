"use client"

import { motion } from "framer-motion"

export function PriceTrendChart() {
  return (
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
  )
}
