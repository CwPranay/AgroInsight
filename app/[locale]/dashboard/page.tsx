"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Head from "next/head";
import CropsPrice from "./components/cropsFilter";
import MarketTrends from "./components/marketTrends";
import NearbyMarket from "./components/nearByMarket";
import { cropTrends } from "@/mockData/trend";
import { BarChart3, TrendingUp, MapPin, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations("dashboard.sections");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const searchParams = useSearchParams();
  
  const filteredTrends = useMemo(() => {
    // Only filter if crop or state is selected
    if (!selectedCrop && !selectedState && !selectedDistrict) {
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
    <>
      <Head>
        <title>AgroInsight Dashboard - Real-time Crop Prices & Market Trends in India</title>
        <meta name="description" content="Track live agricultural commodity prices, market trends, and mandi rates across India. Get real-time updates on wheat, rice, tomato, onion prices and more." />
        <meta name="keywords" content="crop prices, mandi rates, agricultural market, commodity prices, India agriculture, wheat price, rice price, vegetable prices, APMC rates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AgroInsight Dashboard - Real-time Crop Prices & Market Trends" />
        <meta property="og:description" content="Track live agricultural commodity prices and market trends across India" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AgroInsight Dashboard - Real-time Crop Prices" />
        <meta name="twitter:description" content="Track live agricultural commodity prices and market trends across India" />
        <link rel="canonical" href="https://agroinsight.com/dashboard" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30">
        {/* Hero Section */}
        <header className="bg-gradient-to-r mt-8 from-amber-500 via-yellow-500 to-orange-500 text-white">
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
        </header>

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
            district={selectedDistrict || undefined}
            setDistrict={setSelectedDistrict}
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
           <NearbyMarket
           state={selectedState || undefined}
           setState={selectedState}/>
          </div>
        </section>
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AgroInsight Dashboard",
              "description": "Real-time agricultural commodity prices and market trends across India",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />
      </div>
      </main>
    </>
  );
}
