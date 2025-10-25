import { useTranslations } from "next-intl"
import { CropPriceCard } from "./client/CropPriceCard"
import { WeatherCard } from "./client/WeatherCard"
import { PriceTrendChart } from "./client/PriceTrendChart"

const cropPrices = [
  { name: "Wheat", price: "₹2,150", change: "+5.2%", trend: "up" as const, unit: "per quintal" },
  { name: "Rice", price: "₹3,200", change: "-2.1%", trend: "down" as const, unit: "per quintal" },
  { name: "Cotton", price: "₹6,800", change: "+8.5%", trend: "up" as const, unit: "per quintal" },
]

export function LiveDataPreview() {
  const t = useTranslations("liveData")

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Crop Prices */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{t("cropPrices.title")}</h3>
              <span className="text-sm text-gray-500">{t("cropPrices.updated")}</span>
            </div>

            <div className="space-y-4">
              {cropPrices.map((crop, index) => (
                <CropPriceCard
                  key={index}
                  name={crop.name}
                  price={crop.price}
                  change={crop.change}
                  trend={crop.trend}
                  unit={t("cropPrices.perQuintal")}
                  index={index}
                />
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
              {t("cropPrices.viewAll")}
            </button>
          </div>

          {/* Weather Summary */}
          <WeatherCard
            title={t("weather.title")}
            condition={t("weather.condition")}
            rainfallLabel={t("weather.rainfall")}
            humidityLabel={t("weather.humidity")}
            forecastButton={t("weather.forecast")}
          />
        </div>

        {/* Mini Chart Preview */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t("trends.title")}</h3>
          <PriceTrendChart />
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
