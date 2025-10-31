export interface SoilData {
  pH: number
  organicCarbon: number
  clay: number
  silt: number
  sand: number
  soilType: string
  summaryKey: string
  recommendedCrops: string[]
  coordinates: { lat: number; lng: number }
  soilMoisture?: number | null
  surfaceTemperature?: number | null
  soilTemperature?: number | null
  dataSource?: string
  fallback?: boolean
  cached?: boolean
}

export function getPhCategory(pH: number): 'acidic' | 'neutral' | 'alkaline' {
  if (pH < 6.0) return 'acidic'
  if (pH > 7.5) return 'alkaline'
  return 'neutral'
}

export function getPhColor(pH: number): string {
  const category = getPhCategory(pH)
  switch (category) {
    case 'acidic':
      return 'from-red-500 to-orange-500'
    case 'neutral':
      return 'from-green-500 to-emerald-500'
    case 'alkaline':
      return 'from-blue-500 to-cyan-500'
  }
}

export function getOrganicCarbonLevel(oc: number): 'low' | 'medium' | 'high' {
  if (oc < 1.0) return 'low'
  if (oc > 2.0) return 'high'
  return 'medium'
}

export function getOrganicCarbonColor(oc: number): string {
  const level = getOrganicCarbonLevel(oc)
  switch (level) {
    case 'low':
      return 'from-orange-500 to-red-500'
    case 'medium':
      return 'from-yellow-500 to-amber-500'
    case 'high':
      return 'from-green-500 to-emerald-500'
  }
}

export function getSoilTypeIcon(soilType: string): string {
  if (soilType.includes('Clay')) return '🏺'
  if (soilType.includes('Sand')) return '🏖️'
  if (soilType.includes('Silt')) return '🌊'
  if (soilType.includes('Loam')) return '🌱'
  return '🌍'
}

export function getSoilTypeColor(soilType: string): string {
  if (soilType.includes('Clay')) return 'from-amber-600 to-orange-700'
  if (soilType.includes('Sand')) return 'from-yellow-400 to-amber-500'
  if (soilType.includes('Silt')) return 'from-gray-400 to-gray-500'
  if (soilType.includes('Loam')) return 'from-green-600 to-emerald-700'
  return 'from-gray-500 to-gray-600'
}
