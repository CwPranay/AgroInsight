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

// Types
interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  type: "link" | "dropdown"
  href?: string
  items?: SubMenuItem[]
}

interface SubMenuItem {
  href: string
  title: string
  description: string
}

interface MenuItemProps {
  item: MenuItem
  openDropdown: string | null
  toggleDropdown: (id: string) => void
  closeMenus: () => void
  isMobile?: boolean
}

// Menu config
const menuConfig: MenuItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home, type: "link" },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    type: "dropdown",
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
    type: "dropdown",
    items: [
      { href: "/weather", title: "Forecast", description: "Check 7-day rainfall & temperature" },
      { href: "/soil-insights", title: "Soil Insights", description: "Analyze soil quality" },
      { href: "/irrigation-tips", title: "Irrigation Tips", description: "Smart watering suggestions" },
    ],
  },
  { id: "about", label: "About", href: "/about", icon: Leaf, type: "link" },
]

// Language configuration
const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
]

interface LanguageSwitcherProps {
  onLanguageChange?: (lang: string) => void
  isMobile?: boolean
}

// Generic hook
function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void,
  active = true
) {
  React.useEffect(() => {
    if (!active) return
    const listener = (e: MouseEvent | TouchEvent) => {
      const el = ref?.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) handler()
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler, active])
}

function LanguageSwitcher({ onLanguageChange, isMobile = false }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = React.useState("en")
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useOutsideClick(ref, () => setIsOpen(false), isOpen)

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode)
    setIsOpen(false)
    onLanguageChange?.(langCode)
  }

  const currentLanguage = languages.find((l) => l.code === currentLang)

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
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-4 py-3 text-sm font-medium border rounded-lg transition-colors duration-200 ${currentLang === lang.code
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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 rounded-lg transition-all duration-200 hover:bg-amber-50/80 group border border-amber-200/60"
        aria-expanded={isOpen}
      >
        <Languages size={16} className="text-amber-500 group-hover:text-amber-600" />
        <span className="font-medium hidden sm:inline">{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-600" : "text-amber-500"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-amber-200/50 py-2 z-50 animate-in fade-in-0 zoom-in-95">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors duration-200 hover:bg-amber-50/80 ${currentLang === lang.code ? "text-amber-600 bg-amber-50/50" : "text-gray-700"
                }`}
            >
              <span className="font-medium w-8">{lang.code.toUpperCase()}</span>
              <span className="flex-1 text-left">{lang.native}</span>
              {currentLang === lang.code && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function AgroInsightNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const [scrolled, setScrolled] = React.useState(false)
  const mobilePanelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false)
        setOpenDropdown(null)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  useOutsideClick(mobilePanelRef, () => setMobileMenuOpen(false), mobileMenuOpen)

  const toggleDropdown = React.useCallback(
    (id: string) => setOpenDropdown((prev) => (prev === id ? null : id)),
    []
  )
  const closeMenus = React.useCallback(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [])

  const handleLanguageChange = (lang: string) => {
    console.log("Language changed to:", lang)
  }

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${scrolled ? "border-amber-200/60 shadow-sm" : "border-transparent"
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: "1280px" }}>
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center justify-between h-16 overflow-visible">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-sm">
              <Leaf className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent whitespace-nowrap">
              AgroInsight
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {menuConfig.map((item) => (
              <MenuItemComponent
                key={item.id}
                item={item}
                openDropdown={openDropdown}
                toggleDropdown={toggleDropdown}
                closeMenus={closeMenus}
              />
            ))}
          </div>
          <LanguageSwitcher onLanguageChange={handleLanguageChange} />
        </div>

        {/* Tablet Nav */}
        <div className="hidden md:flex lg:hidden items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex-shrink-0">
              <Leaf className="text-white" size={18} />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent truncate">
              AgroInsight
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <LanguageSwitcher onLanguageChange={handleLanguageChange} />
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-600 hover:bg-amber-50/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Header */}
        <div className="flex md:hidden items-center justify-between h-16 gap-2">
          <div className="flex items-center gap-2 flex-shrink min-w-0">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex-shrink-0">
              <Leaf className="text-white" size={16} />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent truncate">
              AgroInsight
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <LanguageSwitcher onLanguageChange={handleLanguageChange} />
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-600 hover:bg-amber-50/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div
          ref={mobilePanelRef}
          className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white border-l border-amber-200/50 z-[60] shadow-2xl animate-in slide-in-from-right duration-300"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-amber-200/50 bg-white flex-shrink-0">
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
                className="p-2 rounded-lg hover:bg-amber-50/80 transition-colors duration-200"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 p-6 space-y-3 overflow-y-auto">
              {menuConfig.map((item) => (
                <MobileMenuItemComponent
                  key={item.id}
                  item={item}
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  closeMenus={closeMenus}
                  isMobile
                />
              ))}
            </div>

            {/* Language Switcher */}
            <div className="p-6 border-t border-amber-200/50 bg-white flex-shrink-0">
              <LanguageSwitcher onLanguageChange={handleLanguageChange} isMobile />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-[55] md:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
}

// Desktop Dropdown
function MenuItemComponent({ item, openDropdown, toggleDropdown, closeMenus }: MenuItemProps) {
  const Icon = item.icon
  const isOpen = openDropdown === item.id
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  useOutsideClick(dropdownRef, () => isOpen && toggleDropdown(item.id), isOpen)

  if (item.type === "link") {
    return (
      <Link
        href={item.href || "#"}
        onClick={closeMenus}
        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-amber-600 rounded-xl transition-all duration-200 hover:bg-amber-50/80 group whitespace-nowrap"
      >
        <Icon size={16} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => toggleDropdown(item.id)}
        className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${isOpen ? "text-amber-600 bg-amber-50/80" : "text-gray-600 hover:text-amber-600 hover:bg-amber-50/80"
          }`}
      >
        <Icon size={16} className={isOpen ? "text-amber-500" : "text-gray-400 group-hover:text-amber-500"} />
        <span>{item.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180 text-amber-500" : "text-gray-400"}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-amber-200/50 py-2 z-50">
          {item.items?.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={closeMenus}
              className="block px-4 py-3 hover:bg-amber-50/80 transition-colors"
            >
              <div className="font-semibold text-gray-900 text-sm">{sub.title}</div>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{sub.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// Mobile Dropdown
function MobileMenuItemComponent({ item, openDropdown, toggleDropdown, closeMenus }: MenuItemProps) {
  const Icon = item.icon
  const isOpen = openDropdown === item.id

  if (item.type === "link") {
    return (
      <Link
        href={item.href || "#"}
        onClick={closeMenus}
        className="flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-800 hover:text-amber-600 rounded-xl transition-all duration-200 hover:bg-amber-50/80 group border border-amber-100"
      >
        <Icon size={20} className="text-amber-500 group-hover:text-amber-600 transition-colors" />
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <div className="border border-amber-100 rounded-xl transition-colors duration-200 hover:bg-amber-50/80">
      <button
        onClick={() => toggleDropdown(item.id)}
        className={`flex items-center justify-between w-full px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 group ${isOpen ? "text-amber-600 bg-amber-50/80" : "text-gray-800"
          }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={isOpen ? "text-amber-500" : "text-amber-500/80"} />
          <span>{item.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-500" : "text-gray-400"}`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-3 space-y-2 bg-white/90 rounded-b-xl">
          {item.items?.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              onClick={closeMenus}
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
}