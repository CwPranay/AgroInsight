"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface HeroCTAButtonsProps {
  primaryText: string
  secondaryText: string
}

export function HeroCTAButtons({ primaryText, secondaryText }: HeroCTAButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
      <Link
        href="/en/crop-prices"
        className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        {primaryText}
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </Link>
      <Link
        href="/en/weather"
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300"
      >
        {secondaryText}
      </Link>
    </div>
  )
}
