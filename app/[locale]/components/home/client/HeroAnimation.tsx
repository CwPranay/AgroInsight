"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export function HeroAnimation({ children }: { children: ReactNode }) {
  const childrenArray = Array.isArray(children) ? children : [children]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.2, duration: 0.8 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
