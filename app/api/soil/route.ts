import { NextRequest, NextResponse } from "next/server"

// In-memory cache for soil data (6 hours)
const CACHE_VERSION = 'v2' // Increment this to invalidate all cache
const cache = new Map<string, { data: any; timestamp: number; version: string }>()
const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours in milliseconds

// Generate cache key from coordinates
function getCacheKey(lat: number, lng: number): string {
    // Round to 3 decimal places (~100m precision) for better cache hits
    return `${lat.toFixed(3)}_${lng.toFixed(3)}`
}

// Check if cached data is still valid
function getCachedData(lat: number, lng: number): any | null {
    const key = getCacheKey(lat, lng)
    const cached = cache.get(key)

    if (cached && cached.version === CACHE_VERSION && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`✅ Cache hit for ${key}`)
        return cached.data
    }

    if (cached) {
        cache.delete(key) // Remove expired or old version cache
    }

    return null
}

// Store data in cache
function setCachedData(lat: number, lng: number, data: any): void {
    const key = getCacheKey(lat, lng)
    cache.set(key, {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
    })
    console.log(`💾 Cached data for ${key} (${CACHE_VERSION})`)
}

function classifySoilType(sand: number, silt: number, clay: number): string {
    // USDA Soil Texture Triangle classification
    if (sand >= 85) return 'Sand'
    if (sand >= 70 && sand < 85 && clay < 15) return 'Loamy Sand'
    if (sand >= 50 && sand < 70 && clay < 20) return 'Sandy Loam'
    if (sand >= 20 && sand < 50 && clay < 27) return 'Loam'
    if (silt >= 80 && clay < 12) return 'Silt'
    if (silt >= 50 && clay < 27) return 'Silt Loam'
    if (clay >= 40) return 'Clay'
    if (clay >= 27 && clay < 40 && sand < 45) return 'Clay Loam'
    if (clay >= 27 && clay < 40 && sand >= 45) return 'Sandy Clay Loam'
    if (clay >= 27 && clay < 40 && silt >= 40) return 'Silty Clay Loam'
    if (clay >= 35 && sand >= 45) return 'Sandy Clay'
    if (clay >= 40 && silt >= 40) return 'Silty Clay'

    return 'Loam' // Default
}

function getRecommendedCrops(pH: number, soilType: string): string[] {
    const crops: string[] = []

    // pH-based recommendations
    if (pH >= 6.0 && pH <= 7.5) {
        crops.push('Wheat', 'Maize', 'Groundnut', 'Soybean')
    } else if (pH < 6.0) {
        crops.push('Rice', 'Potato', 'Tea', 'Blueberry')
    } else if (pH > 7.5) {
        crops.push('Cotton', 'Sorghum', 'Barley', 'Sugarbeet')
    }

    // Soil type based recommendations
    if (soilType.includes('Clay')) {
        crops.push('Rice', 'Wheat')
    } else if (soilType.includes('Sand')) {
        crops.push('Groundnut', 'Watermelon', 'Carrot')
    } else if (soilType.includes('Loam')) {
        crops.push('Tomato', 'Corn', 'Vegetables')
    }

    // Remove duplicates
    return [...new Set(crops)].slice(0, 6)
}

function getSoilSummary(pH: number, organicCarbon: number, soilType: string): string {
    let phDesc = 'neutral'
    if (pH < 6.0) phDesc = 'acidic'
    else if (pH > 7.5) phDesc = 'alkaline'

    let ocDesc = 'medium'
    if (organicCarbon < 1.0) ocDesc = 'low'
    else if (organicCarbon > 2.0) ocDesc = 'high'

    return `${phDesc}_${ocDesc}_${soilType.toLowerCase().replace(' ', '_')}`
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")

    if (!lat || !lng) {
        return NextResponse.json({ error: "Missing coordinates" }, { status: 400 })
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)

    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
    }

    // Check cache first
    const cachedData = getCachedData(latitude, longitude)
    if (cachedData) {
        return NextResponse.json({
            ...cachedData,
            cached: true
        })
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=soil_temperature_0cm,soil_moisture_0_to_7cm&forecast_days=1`

        const response = await fetch(url, {
            next: { revalidate: 21600 } // 6 hours
        })

        if (!response.ok) throw new Error("Open-Meteo request failed")

        const data = await response.json()
        const idx = data.hourly.time.length - 1
        const temperature = data.hourly.soil_temperature_0cm[idx]
        let moisture = data.hourly.soil_moisture_0_to_7cm[idx]

        // Fallback if Open-Meteo returns null
        const moistureFallback = moisture === null || moisture === undefined
        if (moistureFallback) {
            if (temperature < 20) moisture = 0.35
            else if (temperature < 30) moisture = 0.25
            else moisture = 0.15
        }

        // Estimate soil composition based on moisture
        let clay = 25
        let silt = 40
        let sand = 35
        let pH = 6.8
        let organicCarbon = 1.1

        if (moisture > 0.3) {
            // High moisture suggests clay-rich soil
            clay = 35
            silt = 35
            sand = 30
            organicCarbon = 1.5
            pH = 6.5
        } else if (moisture > 0.2) {
            // Moderate moisture - loamy soil
            clay = 25
            silt = 40
            sand = 35
            organicCarbon = 1.1
            pH = 6.8
        } else {
            // Low moisture - sandy soil
            clay = 15
            silt = 25
            sand = 60
            organicCarbon = 0.8
            pH = 7.0
        }

        const soilType = classifySoilType(sand, silt, clay)
        const recommendedCrops = getRecommendedCrops(pH, soilType)
        const summaryKey = getSoilSummary(pH, organicCarbon, soilType)

        const result = {
            pH: parseFloat(pH.toFixed(1)),
            organicCarbon: parseFloat(organicCarbon.toFixed(2)),
            clay: parseFloat(clay.toFixed(1)),
            silt: parseFloat(silt.toFixed(1)),
            sand: parseFloat(sand.toFixed(1)),
            soilType,
            summaryKey,
            recommendedCrops,
            coordinates: { lat: latitude, lng: longitude },
            soilMoisture: parseFloat(moisture.toFixed(2)),
            surfaceTemperature: parseFloat(temperature.toFixed(1)),
            soilTemperature: parseFloat(temperature.toFixed(1)),
            dataSource: "open-meteo",
            fallback: moistureFallback
        }

        // Cache the result
        setCachedData(latitude, longitude, result)

        return NextResponse.json(result)

    } catch (err) {
        console.error("🔥 Soil Fetch Error:", err)

        // Return fallback data
        const fallbackResult = {
            pH: 6.8,
            organicCarbon: 1.1,
            clay: 25,
            silt: 40,
            sand: 35,
            soilType: "Loam",
            summaryKey: "neutral_medium_loam",
            recommendedCrops: ["Wheat", "Maize", "Groundnut", "Soybean", "Tomato", "Corn"],
            coordinates: { lat: latitude, lng: longitude },
            soilMoisture: 0.25,
            surfaceTemperature: 25,
            soilTemperature: 25,
            dataSource: "fallback",
            fallback: true
        }

        return NextResponse.json(fallbackResult)
    }
}
