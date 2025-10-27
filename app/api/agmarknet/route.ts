import { NextResponse } from "next/server";
import {
    getCommodities,
    getGeographies,
    getMarkets,
    getPrices,
} from "@/lib/agmarknet";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { commodity, state, district, market, from_date, to_date } = body;

        if (!commodity || !state || !district || !market || !from_date || !to_date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log("🔑 Loaded API KEY:", process.env.AGMARKNET_API_KEY ? "✅ Present" : "❌ Missing");

        // 1️⃣ Find commodity
        const commodities = await getCommodities();
        const commodityObj = commodities.find(
            (c: any) => c.commodity_name?.toLowerCase() === commodity?.toLowerCase()
        );
        if (!commodityObj) throw new Error(`Commodity not found: ${commodity}`);

        // 2️⃣ Find state/district
        const geographies = await getGeographies();
        const stateObj = geographies.find(
            (s: any) => s.census_state_name.toLowerCase() === state.toLowerCase()
        );
        if (!stateObj) throw new Error(`State not found: ${state}`);

        const districtObj = geographies.find(
            (d: any) =>
                d.census_state_id === stateObj.census_state_id &&
                d.census_district_name.toLowerCase() === district.toLowerCase()
        );
        if (!districtObj) throw new Error(`District not found: ${district}`);

        // 3️⃣ Find market
        const markets = await getMarkets(
            commodityObj.commodity_id,
            stateObj.census_state_id,
            districtObj.census_district_id
        );
        const marketObj = markets.find(
            (m: any) => m.market_name.toLowerCase() === market.toLowerCase()
        );
        if (!marketObj) throw new Error(`Market not found: ${market}`);

        // 4️⃣ Fetch prices
        const prices = await getPrices({
            commodity_id: commodityObj.commodity_id,
            state_id: stateObj.census_state_id,
            district_id: districtObj.census_district_id,
            market_id: marketObj.market_id,
            from_date,
            to_date,
        });

        if (!prices.length)
            return NextResponse.json({ message: "No price data found" }, { status: 404 });

        return NextResponse.json({
            commodity: commodityObj.commodity_name,
            state: stateObj.census_state_name,
            district: districtObj.census_district_name,
            market: marketObj.market_name,
            from: from_date,
            to: to_date,
            records: prices,
        });
    } catch (err: any) {
        console.error("❌ AgMarkNet error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Use POST to fetch crop price data",
        example: {
            commodity: "Tomato",
            state: "Maharashtra",
            district: "Pune",
            market: "Pune",
            from_date: "2025-10-20",
            to_date: "2025-10-27",
        },
    });
}
