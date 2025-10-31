"use client"

import { useTranslations } from "next-intl"
import { Target, Eye, TrendingUp, CloudSun, BarChart3, Globe, Users, Mail, Phone, MapPin, Leaf } from "lucide-react"

export default function AboutPage() {
  const t = useTranslations("about")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Leaf size={40} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-amber-50 max-w-3xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Target size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("mission.title")}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t("mission.description")}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <Eye size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("vision.title")}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t("vision.description")}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t("features.title")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Real-Time Prices */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("features.realTime.title")}</h3>
              <p className="text-gray-600 text-sm">{t("features.realTime.description")}</p>
            </div>

            {/* Weather */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <CloudSun size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("features.weather.title")}</h3>
              <p className="text-gray-600 text-sm">{t("features.weather.description")}</p>
            </div>

            {/* Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("features.trends.title")}</h3>
              <p className="text-gray-600 text-sm">{t("features.trends.description")}</p>
            </div>

            {/* Multilingual */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Globe size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("features.multilingual.title")}</h3>
              <p className="text-gray-600 text-sm">{t("features.multilingual.description")}</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 sm:p-12 border border-blue-200 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6">
              <Users size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("team.title")}</h2>
            <p className="text-lg text-gray-600">
              {t("team.description")}
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("contact.title")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("contact.description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Email */}
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                <Mail size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t("contact.email")}</h3>
              <a href="mailto:support@agroinsight.com" className="text-blue-600 hover:text-blue-700 text-sm">
                support@agroinsight.com
              </a>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                <Phone size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t("contact.phone")}</h3>
              <a href="tel:+911234567890" className="text-green-600 hover:text-green-700 text-sm">
                +91 123 456 7890
              </a>
            </div>

            {/* Address */}
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-3">
                <MapPin size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t("contact.address")}</h3>
              <p className="text-gray-600 text-sm">
                Mumbai, Maharashtra<br />India
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
