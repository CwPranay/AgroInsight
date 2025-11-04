"use client"

import { useTranslations } from "next-intl"
import { IrrigationTips } from "./components/IrrigationTips"

export default function IrrigationTipsPage() {
  const t = useTranslations("irrigationTips")
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">💧</span>
              <span className="text-xs sm:text-sm font-medium">{t("hero.badge")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-50 max-w-2xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <IrrigationTips />
      </main>
    </div>
  )
}
