"use client"

import { motion } from "framer-motion"
import { Database, Zap, Languages } from "lucide-react"
import { useTranslations } from "next-intl"

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} mb-6 shadow-lg`}
                  >
                    <Icon className="text-white" size={32} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {t(`${value.key}.title`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(`${value.key}.description`)}
                  </p>

                  {/* Decorative Element */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-20 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-3xl p-12 text-white shadow-2xl"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0, type: "spring", stiffness: 200 }}
            >
              <div className="text-5xl font-bold mb-2">10,000+</div>
              <div className="text-amber-100 text-lg">{t("stats.users")}</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-amber-100 text-lg">{t("stats.markets")}</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="text-5xl font-bold mb-2">99.9%</div>
              <div className="text-amber-100 text-lg">{t("stats.uptime")}</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-amber-100 text-lg">{t("stats.support")}</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
