import { NextResponse } from "next/server";
import { getCommodities, getGeographies } from "@/lib/agmarknet";

export async function GET() {
    try {
        console.log("🔑 Testing AgMarkNet API...");
        console.log("API Key present:", !!process.env.AGMARKNET_API_KEY);
        
        const [commodities, geographies] = await Promise.all([
            getCommodities(),
            getGeographies()
        ]);

        return NextResponse.json({
            success: true,
            apiKeyPresent: !!process.env.AGMARKNET_API_KEY,
            commoditiesCount: commodities.length,
            geographiesCount: geographies.length,
            sampleCommodity: commodities[0],
            sampleGeography: geographies[0],
            message: "AgMarkNet API is working!"
        });
    } catch (err: any) {
        console.error("❌ AgMarkNet test error:", err);
        return NextResponse.json({
            success: false,
            error: err.message,
            apiKeyPresent: !!process.env.AGMARKNET_API_KEY
        }, { status: 500 });
    }
}
