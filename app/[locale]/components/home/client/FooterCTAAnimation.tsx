"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ReactNode } from "react"
import { useTranslations } from "next-intl"

export function FooterCTAAnimation({ children }: { children: ReactNode }) {
  const t = useTranslations("footerCTA")
  const childrenArray = Array.isArray(children) ? children : [children]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
        >
          {child}
        </motion.div>
      ))}

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/en/crop-prices"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 group"
        >
          {t("cta")}
          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </motion.div>
    </motion.div>
  )
}
