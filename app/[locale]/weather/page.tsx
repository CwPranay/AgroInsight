import { ComingSoon } from "../components/ComingSoon"
import { CloudSun } from "lucide-react"

export default function WeatherPage() {
  return (
    <ComingSoon
      title="Weather Forecast"
      description="Detailed weather forecasts for your location"
      icon={<CloudSun size={48} className="text-white" />}
      estimatedDate="December 2024"
      features={[
        "Hourly weather updates",
        "7-day detailed forecast",
        "Rainfall predictions",
        "Temperature trends",
        "Wind speed and direction",
        "UV index and alerts",
        "Weather-based farming tips",
        "Historical weather data"
      ]}
    />
  )
}
