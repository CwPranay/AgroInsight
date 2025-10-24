"use client"

import * as React from "react"
import {
    Leaf,
    CloudSun,
    BarChart3,
    Users,
    BookOpen,
    Home,
    Phone,
    User,
    Menu,
    X,
    ChevronDown,
    LucideIcon,
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
            { href: "/crop-prices", title: "Crop Prices", description: "Live and historical market rates." },
            { href: "/market-trends", title: "Market Trends", description: "Analyze crop demand & prices." },
            { href: "/nearby-markets", title: "Nearby Markets", description: "View local mandi data." },
        ],
    },
    {
        id: "weather",
        label: "Weather & Soil",
        icon: CloudSun,
        type: "dropdown",
        items: [
            { href: "/weather", title: "Forecast", description: "Check 7-day rainfall & temperature." },
            { href: "/soil-insights", title: "Soil Insights", description: "Analyze soil quality." },
            { href: "/irrigation-tips", title: "Irrigation Tips", description: "Smart watering suggestions." },
        ],
    },
    { id: "about", label: "About", href: "/about", icon: Leaf, type: "link" },
   
]

export function AgroInsightNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

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

    return (
        <nav className="relative   bg-white" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center justify-center h-16">
                    <div className="flex items-center gap-20">
                        <span className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
                            <Leaf size={24} />
                            AgroInsight
                        </span>
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
                </div>

                {/* Mobile Nav Header */}
                <div className="lg:hidden flex items-center justify-between h-16">
                    <span className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
                        <Leaf size={24} />
                        AgroInsight
                    </span>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white transform transition-transform duration-300 ease-in-out z-50 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="px-6 py-6 space-y-4">
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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) toggleDropdown(item.id)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen, item.id, toggleDropdown])

    if (item.type === "link") {
        return (
            <a
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-yellow-700 hover:bg-gray-50 rounded transition-colors"
                onClick={closeMenus}
            >
                <Icon size={18} />
                {item.label}
            </a>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => toggleDropdown(item.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-yellow-700 hover:bg-gray-50 rounded transition-colors"
                aria-expanded={isOpen}
            >
                <Icon size={18} />
                {item.label}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                    {item.items?.map(sub => (
                        <a
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                            onClick={closeMenus}
                        >
                            <div className="font-semibold text-sm">{sub.title}</div>
                            <p className="text-gray-500 text-xs mt-1">{sub.description}</p>
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
                className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-700 rounded-md hover:text-yellow-700 hover:bg-gray-50 transition-colors"
                onClick={closeMenus}
            >
                <Icon size={20} />
                {item.label}
            </a>
        )
    }

    return (
        <div>
            <button
                onClick={() => toggleDropdown(item.id)}
                className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-gray-700 hover:text-yellow-700 hover:bg-gray-50 rounded transition-colors"
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-3">
                    <Icon size={20} />
                    {item.label}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="mt-2 ml-9 space-y-1">
                    {item.items?.map(sub => (
                        <a
                            key={sub.href}
                            href={sub.href}
                            className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={closeMenus}
                        >
                            <div className="font-semibold">{sub.title}</div>
                            <p className="text-xs text-gray-500 mt-1">{sub.description}</p>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
})
