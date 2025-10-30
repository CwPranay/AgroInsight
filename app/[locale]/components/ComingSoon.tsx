"use client"

import { Sparkles, Clock, Bell, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface ComingSoonProps {
  title: string
  description: string
  features?: string[]
  icon?: React.ReactNode
  estimatedDate?: string
}

export function ComingSoon({ 
  title, 
  description, 
  features = [],
  icon,
  estimatedDate 
}: ComingSoonProps) {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-4 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-xs sm:text-sm font-medium">Back to Home</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              {title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-50 max-w-2xl">
              {description}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Card */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-2xl border border-gray-200 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
                  {icon || <Sparkles size={48} className="text-white" />}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Clock size={16} className="text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon!
            </h2>
            
            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're working hard to bring you this amazing feature. Stay tuned for updates!
            </p>

            {/* Estimated Date */}
            {estimatedDate && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-full mb-8">
                <Clock size={20} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  Expected: {estimatedDate}
                </span>
              </div>
            )}

            {/* Features List */}
            {features.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
                  <Sparkles size={20} className="text-yellow-500" />
                  What to Expect
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notify Me Section */}
            <div className="mt-12 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Bell size={20} className="text-amber-600" />
                <h4 className="text-lg font-bold text-gray-900">Get Notified</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Want to be the first to know when this feature launches?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200">
                  Notify Me
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Have suggestions or feedback? <a href="mailto:support@agroinsight.com" className="text-blue-600 hover:text-blue-700 font-semibold">Contact us</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
