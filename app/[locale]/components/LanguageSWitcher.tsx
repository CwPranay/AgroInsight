'use client'

import * as React from 'react'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Languages, ChevronDown } from 'lucide-react'

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
]

export function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const locale = useLocale()
  const pathname = usePathname()

  const changeLanguage = (newLocale: string) => {
    if (locale === newLocale) {
      setIsOpen(false)
      return
    }

    // Simple path replacement logic
    const segments = pathname.split('/').filter(segment => segment)
    const currentLocales = languages.map(l => l.code)
    
    if (segments.length > 0 && currentLocales.includes(segments[0])) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }
    
    const newPath = '/' + segments.join('/')
    window.location.href = newPath
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.language-switcher')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  if (isMobile) {
    return (
      <div className="w-full language-switcher">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 mb-3">
          <Languages size={18} className="text-amber-500" />
          <span className="font-medium">Language / भाषा</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-4 py-3 text-sm font-medium border rounded-lg transition-all duration-200 ${
                locale === lang.code
                  ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm scale-105"
                  : "border-amber-200 text-gray-700 hover:bg-amber-50/80 hover:border-amber-300"
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
    <div className="relative language-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 rounded-lg transition-all duration-200 hover:bg-amber-50/80 border border-amber-200/60 hover:border-amber-300"
      >
        <Languages size={16} className="text-amber-500" />
        <span className="font-medium hidden sm:inline">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-amber-200/50 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all duration-200 ${
                locale === lang.code
                  ? "text-amber-600 bg-amber-50/50 font-medium"
                  : "text-gray-700 hover:bg-amber-50/80"
              }`}
            >
              <span className="font-medium w-8">{lang.code.toUpperCase()}</span>
              <span className="flex-1 text-left">{lang.native}</span>
              {locale === lang.code && (
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}