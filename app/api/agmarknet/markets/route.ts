import { NextResponse } from "next/server";
import { getMarkets } from "@/lib/agmarknet";

// Mock markets data
const MOCK_MARKETS = [
    { market_id: 1, market_name: "Pune Market" },
    { market_id: 2, market_name: "Mumbai Market" },
    { market_id: 3, market_name: "Nagpur Market" },
];

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { commodity_id, state_id, district_id } = body;

        if (!commodity_id || !state_id || !district_id) {
            return NextResponse.json(
                { error: "Missing required fields: commodity_id, state_id, district_id" },
                { status: 400 }
            );
        }

        const markets = await getMarkets(commodity_id, state_id, district_id);
        return NextResponse.json({ data: markets });
    } catch (err: any) {
        return NextResponse.json({ 
            data: MOCK_MARKETS,
            warning: "Using mock data - API unavailable"
        });
    }
}
