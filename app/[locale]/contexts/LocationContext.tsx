"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LocationData {
    latitude: number
    longitude: number
    city?: string
    district?: string
    state?: string
    country?: string
}

interface LocationContextType {
    location: LocationData | null
    setLocation: (location: LocationData | null) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocationState] = useState<LocationData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Load location from localStorage on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem("userLocation")
        if (savedLocation) {
            try {
                setLocationState(JSON.parse(savedLocation))
            } catch (error) {
                console.error("Failed to parse saved location:", error)
            }
        }
    }, [])

    // Save location to localStorage whenever it changes
    const setLocation = (newLocation: LocationData | null) => {
        setLocationState(newLocation)
        if (newLocation) {
            localStorage.setItem("userLocation", JSON.stringify(newLocation))
        } else {
            localStorage.removeItem("userLocation")
        }
    }

    return (
        <LocationContext.Provider value={{ location, setLocation, isLoading, setIsLoading }}>
            {children}
        </LocationContext.Provider>
    )
}

export function useLocation() {
    const context = useContext(LocationContext)
    if (context === undefined) {
        throw new Error("useLocation must be used within a LocationProvider")
    }
    return context
}
