"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export function GlobalLoadingIndicator() {
    const [loading, setLoading] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        setLoading(false)
    }, [pathname, searchParams])

    useEffect(() => {
        // Show loading on navigation
        const handleStart = () => setLoading(true)
        const handleComplete = () => setLoading(false)

        // Listen for route changes
        window.addEventListener('beforeunload', handleStart)

        return () => {
            window.removeEventListener('beforeunload', handleStart)
        }
    }, [])

    if (!loading) return null

    return (
        <>
            {/* Top Loading Bar */}
            <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-pulse">
                <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
            </div>

            {/* Center Loading Spinner */}
            <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3">
                    <Loader2 size={40} className="text-blue-500 animate-spin" />
                    <p className="text-sm font-semibold text-gray-700">Loading...</p>
                </div>
            </div>

            <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
        </>
    )
}
