import { ComingSoon } from "../components/ComingSoon"
import { Users } from "lucide-react"

export default function AboutPage() {
  return (
    <ComingSoon
      title="About AgroInsight"
      description="Learn more about our mission to empower farmers with data-driven insights"
      icon={<Users size={48} className="text-white" />}
      estimatedDate="Coming Soon"
      features={[
        "Our story and mission",
        "Meet the team",
        "Technology we use",
        "Success stories",
        "Partner organizations",
        "Awards and recognition",
        "Contact information",
        "Career opportunities"
      ]}
    />
  )
}
