import { useTranslations } from "next-intl"
import { Sprout } from "lucide-react"
import { HeroAnimation } from "./client/HeroAnimation"
import { HeroCTAButtons } from "./client/HeroCTAButtons"

export function HeroSection() {
  const t = useTranslations("hero")

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <HeroAnimation>
          {/* Icon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 font-medium text-sm">
            <Sprout size={18} />
            <span>{t("badge")}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            {t("headline")}
          </h1>

          {/* Subtext */}
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("subtext")}
          </p>

          {/* CTA Buttons */}
          <HeroCTAButtons 
            primaryText={t("ctaPrimary")}
            secondaryText={t("ctaSecondary")}
          />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">10K+</div>
              <div className="text-sm text-gray-600 mt-1">{t("stats.farmers")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">500+</div>
              <div className="text-sm text-gray-600 mt-1">{t("stats.markets")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">{t("stats.updates")}</div>
            </div>
          </div>
        </HeroAnimation>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
