import { NextResponse } from "next/server";
import { getCommodities } from "@/lib/agmarknet";

// Mock data as fallback
const MOCK_COMMODITIES = [
    { commodity_id: 1, commodity_name: "Wheat" },
    { commodity_id: 2, commodity_name: "Rice" },
    { commodity_id: 3, commodity_name: "Tomato" },
    { commodity_id: 4, commodity_name: "Onion" },
    { commodity_id: 5, commodity_name: "Potato" },
    { commodity_id: 6, commodity_name: "Cotton" },
    { commodity_id: 7, commodity_name: "Soybean" },
    { commodity_id: 8, commodity_name: "Bajra" },
];

export async function GET() {
    try {
        const commodities = await getCommodities();
        return NextResponse.json({ 
            data: commodities,
            count: commodities.length 
        });
    } catch (err: any) {
        // Return mock data as fallback
        return NextResponse.json({ 
            data: MOCK_COMMODITIES,
            count: MOCK_COMMODITIES.length,
            warning: "Using mock data - API unavailable"
        });
    }
}
