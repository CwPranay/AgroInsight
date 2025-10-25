"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface ValueCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  index: number
}

export function ValueCard({ icon: Icon, title, description, color, index }: ValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="relative group"
    >
      {/* Card */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 h-full">
        {/* Gradient Background on Hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${color} mb-6 shadow-lg`}
        >
          <Icon className="text-white" size={32} />
        </motion.div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Decorative Element */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
      </div>
    </motion.div>
  )
}
