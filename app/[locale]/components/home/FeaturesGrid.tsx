import { useTranslations } from "next-intl"
import { BarChart3, CloudSun, Leaf, Sprout } from "lucide-react"
import { FeatureCard } from "./client/FeatureCard"

const features = [
  {
    icon: BarChart3,
    key: "cropPrices",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: CloudSun,
    key: "weather",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Leaf,
    key: "soilHealth",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sprout,
    key: "markets",
    color: "from-purple-500 to-pink-500",
  },
]

export function FeaturesGrid() {
  const t = useTranslations("features")

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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={t(`${feature.key}.title`)}
              description={t(`${feature.key}.description`)}
              color={feature.color}
              learnMore={t("learnMore")}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
