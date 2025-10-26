"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import CropsPrice from "./components/cropsFilter";
import MarketTrends from "./components/marketTrends";
import { cropTrends } from "@/mockData/trend";
import { BarChart3, TrendingUp, MapPin, Sparkles } from "lucide-react";


export default function DashboardPage() {
  const t = useTranslations("dashboard.sections");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const searchParams = useSearchParams();
  
  const filteredTrends = useMemo(() => {
    // Only filter if crop or state is selected
    if (!selectedCrop && !selectedState) {
      return []
    }
    return cropTrends.filter((item) => {
      const cropMatch = selectedCrop ? item.crop === selectedCrop : true;
      const stateMatch = selectedState ? item.state === selectedState : true;
      return cropMatch && stateMatch;
    });
  }, [selectedCrop, selectedState]);

  // scrolls to correct section when dashboard loads
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      // Wait for DOM to be ready
      const timer = setTimeout(() => {
        const el = document.getElementById(section);
        if (el) {
          const navHeight = 64; // Height of sticky navbar
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navHeight - 20; // 20px extra padding

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r mt-8 from-amber-500 via-yellow-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Sparkles size={18} />
              <span className="text-sm font-medium">{t("welcome")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("dashboardTitle")}
            </h1>
            <p className="text-lg md:text-xl text-amber-50 max-w-2xl">
              {t("dashboardSubtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Overview Section */}
       

        {/* Crop Prices Section */}
        <section id="crop-prices" className="scroll-mt-20">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{t("cropPrices")}</h2>
            </div>
            <p className="text-gray-600 ml-13">{t("cropPricesDesc")}</p>
          </div>
          <CropsPrice
            crop={selectedCrop || undefined}
            state={selectedState || undefined}
            setCrop={setSelectedCrop}
            setState={setSelectedState}
          />
        </section>

        {/* Market Trends Section */}
        <section id="market-trends" className="scroll-mt-20">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{t("marketTrends")}</h2>
            </div>
            <p className="text-gray-600 ml-13">{t("marketTrendsDesc")}</p>
          </div>
          <MarketTrends data={filteredTrends} />
        </section>

        {/* Nearby Markets Section */}
        <section id="nearby-markets" className="scroll-mt-20">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <MapPin size={20} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{t("nearbyMarkets")}</h2>
            </div>
            <p className="text-gray-600 ml-13">{t("nearbyMarketsDesc")}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
                <MapPin size={40} className="text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("comingSoon")}</h3>
              <p className="text-gray-600 max-w-md">
                {t("comingSoonMessage")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
