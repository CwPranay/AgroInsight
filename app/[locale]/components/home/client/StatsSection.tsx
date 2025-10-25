"use client"

import { motion } from "framer-motion"

interface StatsSectionProps {
  usersLabel: string
  marketsLabel: string
  uptimeLabel: string
  supportLabel: string
}

export function StatsSection({ usersLabel, marketsLabel, uptimeLabel, supportLabel }: StatsSectionProps) {
  const stats = [
    { value: "10,000+", label: usersLabel },
    { value: "500+", label: marketsLabel },
    { value: "99.9%", label: uptimeLabel },
    { value: "24/7", label: supportLabel },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-20 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-3xl p-12 text-white shadow-2xl"
    >
      <div className="grid md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
          >
            <div className="text-5xl font-bold mb-2">{stat.value}</div>
            <div className="text-amber-100 text-lg">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
