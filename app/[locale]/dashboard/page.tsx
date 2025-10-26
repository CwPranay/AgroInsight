"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar from "./components/filter-bar";


export default function DashboardPage() {
  const searchParams = useSearchParams();

  // scrolls to correct section when dashboard loads
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        // delay until layout is rendered
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-10 space-y-20">
      <section id="overview">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <p>General insights, highlights, and quick info for farmers.</p>
      </section>

      <section id="crop-prices">
        <h2 className="text-2xl font-semibold mb-4">Crop Prices</h2>
        {/* crop price content */}
        <FilterBar/>
        
    
      </section>

      <section id="market-trends">
        <h2 className="text-2xl font-semibold mb-4">Market Trends</h2>
        {/* market trends charts */}
      </section>

      <section id="nearby-markets">
        <h2 className="text-2xl font-semibold mb-4">Nearby Markets</h2>
        {/* nearby market cards */}
      </section>
    </div>
  );
}
