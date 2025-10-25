import { useTranslations } from "next-intl"
import { Database, Zap, Languages } from "lucide-react"
import { ValueCard } from "./client/ValueCard"
import { StatsSection } from "./client/StatsSection"

const values = [
  {
    icon: Database,
    key: "dataInsights",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    key: "realTime",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Languages,
    key: "multilingual",
    color: "from-green-500 to-emerald-500",
  },
]

export function ValueSection() {
  const t = useTranslations("value")

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <ValueCard
              key={index}
              icon={value.icon}
              title={t(`${value.key}.title`)}
              description={t(`${value.key}.description`)}
              color={value.color}
              index={index}
            />
          ))}
        </div>

        {/* Stats Section */}
        <StatsSection
          usersLabel={t("stats.users")}
          marketsLabel={t("stats.markets")}
          uptimeLabel={t("stats.uptime")}
          supportLabel={t("stats.support")}
        />
      </div>
    </section>
  )
}
