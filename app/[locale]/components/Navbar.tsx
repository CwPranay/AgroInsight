"use client"

import * as React from "react"
import Link from "next/link"
import { LanguageSwitcher } from "@/app/[locale]/components/LanguageSWitcher"
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
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

const menuConfig = (t: (key: string) => string) => [
  { 
    id: "home", 
    label: t('home'), 
    href: "/", 
    icon: Home, 
    type: "link" as const 
  },
  {
    id: "dashboard",
    label: t('dashboard'),
    icon: BarChart3,
    type: "dropdown" as const,
    items: [
      { 
        href: "/dashboard?section=crop-prices", 
        title: t('cropPrices'), 
        description: t('cropPricesDescription') 
      },
      { 
        href: "/dashboard?section=market-trends", 
        title: t('marketTrends'), 
        description: t('marketTrendsDescription') 
      },
      { 
        href: "/dashboard?section=nearby-markets", 
        title: t('nearbyMarkets'), 
        description: t('nearbyMarketsDescription') 
      },
    ],
  },
  {
    id: "weather",
    label: t('weatherSoil'),
    icon: CloudSun,
    type: "dropdown" as const,
    items: [
      { 
        href: "/weather", 
        title: t('weatherForecast'), 
        description: t('weatherForecastDescription') 
      },
      { 
        href: "/soil-insights", 
        title: t('soilInsights'), 
        description: t('soilInsightsDescription') 
      },
      { 
        href: "/irrigation-tips", 
        title: t('irrigationTips'), 
        description: t('irrigationTipsDescription') 
      },
    ],
  },
  { 
    id: "about", 
    label: t('about'), 
    href: "/about", 
    icon: Leaf, 
    type: "link" as const 
  },
]

export function AgroInsightNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const t = useTranslations('Navigation')
  const locale = useLocale()

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)'
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [mobileMenuOpen])

  const menuItems = menuConfig(t)

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeInItem {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Custom scrollbar for sidebar */
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 3px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }

        /* Prevent layout shift */
        body {
          --scrollbar-width: 0px;
        }

        @media (min-width: 1024px) {
          body {
            --scrollbar-width: 0px;
          }
        }
      `}</style>

      <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                <Leaf className="text-white transition-transform duration-300 group-hover:rotate-12" size={22} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                AgroInsight
              </span>
            </Link>

            {/* Desktop Menu Items */}
            <div className="flex items-center gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isOpen = openDropdown === item.id

                if (item.type === "link") {
                  return (
                    <Link
                      key={item.id}
                      href={item.href!}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-amber-600 rounded-xl transition-all duration-200 hover:bg-amber-50/80"
                    >
                      <Icon size={16} className="text-gray-400 transition-colors duration-200" />
                      <span>{item.label}</span>
                    </Link>
                  )
                }

                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isOpen
                          ? "text-amber-600 bg-amber-50/80"
                          : "text-gray-700 hover:text-amber-600 hover:bg-amber-50/80"
                      }`}
                    >
                      <Icon 
                        size={16} 
                        className={`transition-colors duration-200 ${
                          isOpen ? "text-amber-500" : "text-gray-400"
                        }`} 
                      />
                      <span>{item.label}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`} 
                      />
                    </button>

                    {isOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-[60]" 
                          onClick={() => setOpenDropdown(null)} 
                        />
                        <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-amber-200/50 py-2 z-[70] animate-fadeIn">
                          {item.items?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-4 py-3 hover:bg-amber-50/80 transition-all duration-200 group"
                            >
                              <div className="font-semibold text-gray-900 text-sm group-hover:text-amber-600 transition-colors">
                                {sub.title}
                              </div>
                              <p className="text-gray-500 text-xs mt-1">
                                {sub.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile/Tablet Header */}
          <div className="flex lg:hidden items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Leaf className="text-white" size={18} />
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-amber-50/80 transition-all duration-200"
                aria-label={t('toggleMenu')}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl z-[110] lg:hidden transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-yellow-50/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-md">
                <Leaf className="text-white" size={20} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/80 transition-all duration-200"
              aria-label={t('closeMenu')}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Sidebar Menu Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-2 sidebar-scroll">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isOpen = openDropdown === item.id

              if (item.type === "link") {
                return (
                  <Link
                    key={item.id}
                    href={item.href!}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-gray-800 hover:text-amber-600 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50/50 border border-amber-100 hover:border-amber-300 hover:shadow-sm"
                    style={{
                      animation: mobileMenuOpen ? `fadeInItem 0.3s ease-out ${index * 50}ms both` : 'none'
                    }}
                  >
                    <Icon size={20} className="text-amber-500" />
                    <span>{item.label}</span>
                  </Link>
                )
              }

              return (
                <div
                  key={item.id}
                  className="border border-amber-100 rounded-xl overflow-hidden hover:border-amber-300 transition-all duration-200 hover:shadow-sm"
                  style={{
                    animation: mobileMenuOpen ? `fadeInItem 0.3s ease-out ${index * 50}ms both` : 'none'
                  }}
                >
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3.5 text-base font-medium transition-all duration-200 ${
                      isOpen
                        ? "text-amber-600 bg-gradient-to-r from-amber-50 to-yellow-50/50"
                        : "text-gray-800 hover:bg-amber-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-amber-500" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`} 
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-3 pb-2 space-y-1 bg-gradient-to-b from-amber-50/30 to-transparent">
                        {item.items?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setOpenDropdown(null)
                            }}
                            className="block py-3 px-3 text-gray-700 text-sm hover:text-amber-600 transition-all duration-200 rounded-lg hover:bg-white/80 hover:shadow-sm border-b border-amber-50 last:border-b-0"
                          >
                            <div className="font-medium">{sub.title}</div>
                            <p className="text-gray-500 text-xs mt-1">
                              {sub.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sidebar Footer - Language Switcher */}
          <div className="p-5 border-t border-amber-200/50 bg-gradient-to-r from-amber-50/30 to-yellow-50/20">
            <LanguageSwitcher isMobile />
          </div>
        </div>
      </aside>
    </>
  )
}