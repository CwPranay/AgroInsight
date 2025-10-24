"use client"

import * as React from "react"
import {
    Leaf,
    CloudSun,
    BarChart3,
    Home,
    Menu,
    X,
    ChevronDown,
    LucideIcon,
    Languages,
} from "lucide-react"

// Types
interface MenuItem {
    id: string
    label: string
    icon: LucideIcon
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
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
]

interface LanguageSwitcherProps {
    onLanguageChange?: (lang: string) => void
}

function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
    const [currentLang, setCurrentLang] = React.useState('en')
    const [isOpen, setIsOpen] = React.useState(false)

    const handleLanguageChange = (langCode: string) => {
        setCurrentLang(langCode)
        setIsOpen(false)
        onLanguageChange?.(langCode)
        // Here you would typically integrate with next-i18n
        // router.push(pathname, { locale: langCode })
    }

    const currentLanguage = languages.find(lang => lang.code === currentLang)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 rounded-lg transition-all duration-200 hover:bg-amber-50/80 group border border-amber-200/60"
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <Languages size={16} className="text-amber-500 group-hover:text-amber-600" />
                <span className="font-medium">{currentLanguage?.code.toUpperCase()}</span>
                <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-amber-600" : "text-amber-500"
                    }`} 
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-amber-200/50 py-2 z-50 animate-in fade-in-0 zoom-in-95">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors duration-200 hover:bg-amber-50/80 ${
                                currentLang === lang.code 
                                    ? "text-amber-600 bg-amber-50/50" 
                                    : "text-gray-700"
                            }`}
                        >
                            <span className="font-medium w-8">{lang.code.toUpperCase()}</span>
                            <span className="flex-1 text-left">{lang.native}</span>
                            {currentLang === lang.code && (
                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            )}
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

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Escape key to close menus
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

    // Prevent scroll when mobile menu open
    React.useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [mobileMenuOpen])

    const toggleDropdown = (id: string) => setOpenDropdown(openDropdown === id ? null : id)
    const closeMenus = () => { setMobileMenuOpen(false); setOpenDropdown(null) }

    const handleLanguageChange = (lang: string) => {
        console.log('Language changed to:', lang)
        // Integrate with next-i18n here:
        // const router = useRouter()
        // const pathname = usePathname()
        // router.push(pathname, { locale: lang })
    }

    return (
        <nav 
            className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b transition-all duration-300 ${
                scrolled ? "border-amber-200/60 shadow-sm" : "border-transparent"
            }`}
            role="navigation" 
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-sm">
                            <Leaf className="text-white" size={22} />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                            AgroInsight
                        </span>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center gap-1">
                        {menuConfig.map(item => (
                            <MenuItemComponent
                                key={item.id}
                                item={item}
                                openDropdown={openDropdown}
                                toggleDropdown={toggleDropdown}
                                closeMenus={closeMenus}
                            />
                        ))}
                    </div>

                    {/* Language Switcher */}
                    <LanguageSwitcher onLanguageChange={handleLanguageChange} />
                </div>

                {/* Mobile Nav Header */}
                <div className="lg:hidden flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg">
                            <Leaf className="text-white" size={18} />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                            AgroInsight
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher onLanguageChange={handleLanguageChange} />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-amber-50/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? (
                                <X size={22} className="text-gray-700" />
                            ) : (
                                <Menu size={22} className="text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={closeMenus}
                />
            )}

            {/* Mobile Menu Panel */}
            <div
                className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl transform transition-transform duration-300 ease-out z-50 border-l border-amber-200/50 ${
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Header */}
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
                            onClick={closeMenus}
                            className="p-2 rounded-lg hover:bg-amber-50/80 transition-colors duration-200"
                            aria-label="Close menu"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Mobile Menu Items */}
                    <div className="flex-1 px-6 py-6 space-y-2">
                        {menuConfig.map(item => (
                            <MobileMenuItemComponent
                                key={item.id}
                                item={item}
                                openDropdown={openDropdown}
                                toggleDropdown={toggleDropdown}
                                closeMenus={closeMenus}
                            />
                        ))}
                    </div>

                    {/* Mobile Language Section */}
                    <div className="p-6 border-t border-amber-200/50">
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
                            <Languages size={18} className="text-amber-500" />
                            <span className="font-medium">Language / भाषा</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className="flex-1 px-3 py-2 text-sm font-medium border border-amber-200/60 rounded-lg hover:bg-amber-50/80 transition-colors duration-200 text-gray-700 hover:text-amber-600"
                                >
                                    {lang.native}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

// Desktop Menu Item
const MenuItemComponent = React.memo<MenuItemProps>(({ item, openDropdown, toggleDropdown, closeMenus }) => {
    const Icon = item.icon
    const isOpen = openDropdown === item.id
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!isOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                toggleDropdown(item.id)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen, item.id, toggleDropdown])

    if (item.type === "link") {
        return (
            <a
                href={item.href}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-amber-600 rounded-xl transition-all duration-200 hover:bg-amber-50/80 group"
                onClick={closeMenus}
            >
                <Icon size={18} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                {item.label}
            </a>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => toggleDropdown(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isOpen 
                    ? "text-amber-600 bg-amber-50/80" 
                    : "text-gray-600 hover:text-amber-600 hover:bg-amber-50/80"
                }`}
                aria-expanded={isOpen}
            >
                <Icon 
                    size={18} 
                    className={`transition-colors ${
                        isOpen ? "text-amber-500" : "text-gray-400 group-hover:text-amber-500"
                    }`} 
                />
                {item.label}
                <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-amber-500" : "text-gray-400 group-hover:text-amber-500"
                    }`} 
                />
            </button>
            
            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-amber-200/50 py-3 z-50 animate-in fade-in-0 zoom-in-95">
                    {item.items?.map((sub, index) => (
                        <a
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-3 hover:bg-amber-50/80 transition-colors duration-200 group animate-in fade-in-0 slide-in-from-left-2"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={closeMenus}
                        >
                            <div className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                {sub.title}
                            </div>
                            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                                {sub.description}
                            </p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
})

// Mobile Menu Item
const MobileMenuItemComponent = React.memo<MenuItemProps>(({ item, openDropdown, toggleDropdown, closeMenus }) => {
    const Icon = item.icon
    const isOpen = openDropdown === item.id

    if (item.type === "link") {
        return (
            <a
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-600 hover:text-amber-600 rounded-xl transition-all duration-200 hover:bg-amber-50/80 group"
                onClick={closeMenus}
            >
                <Icon size={20} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                {item.label}
            </a>
        )
    }

    return (
        <div className="rounded-xl transition-colors duration-200 hover:bg-amber-50/80">
            <button
                onClick={() => toggleDropdown(item.id)}
                className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 group ${
                    isOpen ? "text-amber-600 bg-amber-50/80" : "text-gray-600 hover:text-amber-600"
                }`}
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-3">
                    <Icon 
                        size={20} 
                        className={`transition-colors ${
                            isOpen ? "text-amber-500" : "text-gray-400 group-hover:text-amber-500"
                        }`} 
                    />
                    {item.label}
                </span>
                <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-amber-500" : "text-gray-400 group-hover:text-amber-500"
                    }`} 
                />
            </button>
            
            {isOpen && (
                <div className="mt-1 ml-4 space-y-1 border-l-2 border-amber-100/80 pl-4 py-2">
                    {item.items?.map((sub, index) => (
                        <a
                            key={sub.href}
                            href={sub.href}
                            className="block px-3 py-2.5 text-sm rounded-lg hover:bg-amber-50/80 transition-colors duration-200 group animate-in fade-in-0 slide-in-from-left-2"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={closeMenus}
                        >
                            <div className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                {sub.title}
                            </div>
                            <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                                {sub.description}
                            </p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
})