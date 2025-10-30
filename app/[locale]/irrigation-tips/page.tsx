import { ComingSoon } from "../components/ComingSoon"
import { Droplets } from "lucide-react"

export default function IrrigationTipsPage() {
  return (
    <ComingSoon
      title="Irrigation Tips"
      description="Smart irrigation recommendations based on weather and soil conditions"
      icon={<Droplets size={48} className="text-white" />}
      estimatedDate="January 2025"
      features={[
        "Water requirement calculator",
        "Irrigation scheduling",
        "Weather-based recommendations",
        "Soil moisture tracking",
        "Water conservation tips",
        "Drip vs flood irrigation guide",
        "Crop-specific watering needs",
        "Cost optimization strategies"
      ]}
    />
  )
}
