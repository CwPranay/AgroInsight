"use client"

import * as React from "react"
import Link from "next/link"
import {
  Leaf,
  CloudSun,
  BarChart3,
  Home,
  Menu,
  X,
  ChevronDown,
  Languages,
} from "lucide-react"

const menuConfig = [
  { id: "home", label: "Home", href: "/", icon: Home, type: "link" as const },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    type: "dropdown" as const,
    items: [
      { href: "/crop-prices", title: "Crop Prices", description: "Live and historical market rates" },
      { href: "/market-trends", title: "Market Trends", description: "Analyze crop demand & prices" },
      { href: "/nearby-markets", title: "Nearby Markets", description: "View local mandi data" },
    ],
  },
  {
    id: "weather",
    label: "Weather & Soil",
    icon: CloudSun,
    type: "dropdown" as const,
    items: [
      { href: "/weather", title: "Forecast", description: "Check 7-day rainfall & temperature" },
      { href: "/soil-insights", title: "Soil Insights", description: "Analyze soil quality" },
      { href: "/irrigation-tips", title: "Irrigation Tips", description: "Smart watering suggestions" },
    ],
  },
  { id: "about", label: "About", href: "/about", icon: Leaf, type: "link" as const },
]

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
]

function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
  const [currentLang, setCurrentLang] = React.useState("en")
  const [isOpen, setIsOpen] = React.useState(false)

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 mb-3">
          <Languages size={18} className="text-amber-500" />
          <span className="font-medium">Language / भाषा</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setCurrentLang(lang.code)}
              className={`px-4 py-3 text-sm font-medium border rounded-lg transition-colors ${
                currentLang === lang.code
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "border-amber-200 text-gray-700 hover:bg-amber-50/80"
              }`}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 rounded-lg transition-all hover:bg-amber-50/80 border border-amber-200/60"
      >
        <Languages size={16} className="text-amber-500" />
        <span className="font-medium hidden sm:inline">{currentLang.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-amber-200/50 py-2 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setCurrentLang(lang.code)
                  setIsOpen(false)
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors hover:bg-amber-50/80 ${
                  currentLang === lang.code ? "text-amber-600 bg-amber-50/50" : "text-gray-700"
                }`}
              >
                <span className="font-medium w-8">{lang.code.toUpperCase()}</span>
                <span className="flex-1 text-left">{lang.native}</span>
                {currentLang === lang.code && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function AgroInsightNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-sm">
              <Leaf className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              AgroInsight
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {menuConfig.map((item) => {
              const Icon = item.icon
              const isOpen = openDropdown === item.id

              if (item.type === "link") {
                return (
                  <Link
                    key={item.id}
                    href={item.href!}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-amber-600 rounded-xl transition-all hover:bg-amber-50/80"
                  >
                    <Icon size={16} className="text-gray-400" />
                    <span>{item.label}</span>
                  </Link>
                )
              }

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                      isOpen ? "text-amber-600 bg-amber-50/80" : "text-gray-600 hover:text-amber-600 hover:bg-amber-50/80"
                    }`}
                  >
                    <Icon size={16} className={isOpen ? "text-amber-500" : "text-gray-400"} />
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                      <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-amber-200/50 py-2 z-20">
                        {item.items?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-3 hover:bg-amber-50/80 transition-colors"
                          >
                            <div className="font-semibold text-gray-900 text-sm">{sub.title}</div>
                            <p className="text-gray-500 text-xs mt-1">{sub.description}</p>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <LanguageSwitcher />
        </div>

        {/* Mobile/Tablet Nav */}
        <div className="flex lg:hidden items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg">
              <Leaf className="text-white" size={16} />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              AgroInsight
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-amber-50/80 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-amber-200/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl">
                    <Leaf className="text-white" size={20} />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    AgroInsight
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-amber-50/80 transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {menuConfig.map((item) => {
                  const Icon = item.icon
                  const isOpen = openDropdown === item.id

                  if (item.type === "link") {
                    return (
                      <Link
                        key={item.id}
                        href={item.href!}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-800 hover:text-amber-600 rounded-xl transition-all hover:bg-amber-50/80 border border-amber-100"
                      >
                        <Icon size={20} className="text-amber-500" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  }

                  return (
                    <div key={item.id} className="border border-amber-100 rounded-xl">
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                        className={`flex items-center justify-between w-full px-4 py-4 text-base font-medium rounded-xl transition-all ${
                          isOpen ? "text-amber-600 bg-amber-50/80" : "text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} className="text-amber-500" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-3 space-y-2">
                          {item.items?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setOpenDropdown(null)
                              }}
                              className="block py-2.5 px-2 text-gray-700 text-sm hover:text-amber-600 transition-colors border-b border-amber-50 last:border-b-0"
                            >
                              <div className="font-medium">{sub.title}</div>
                              <p className="text-gray-500 text-xs mt-1">{sub.description}</p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Language Switcher */}
              <div className="p-6 border-t border-amber-200/50">
                <LanguageSwitcher isMobile />
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
