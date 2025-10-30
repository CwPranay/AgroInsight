import { ComingSoon } from "../components/ComingSoon"
import { Leaf } from "lucide-react"

export default function SoilInsightsPage() {
  return (
    <ComingSoon
      title="Soil Insights"
      description="Analyze soil quality and get recommendations for better crop yield"
      icon={<Leaf size={48} className="text-white" />}
      estimatedDate="January 2025"
      features={[
        "Soil pH analysis",
        "Nutrient level detection",
        "Moisture content monitoring",
        "Soil type identification",
        "Fertilizer recommendations",
        "Crop suitability analysis",
        "Soil health reports",
        "Historical soil data"
      ]}
    />
  )
}
