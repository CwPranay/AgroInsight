import { NextResponse } from "next/server";

const BASE_URL = "https://api.ceda.ashoka.edu.in/v1/agmarknet";
const API_KEY = process.env.AGMARKNET_API_KEY;

async function safeFetch(url: string, options?: RequestInit) {
    const headers = {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
        const text = await res.text();
        console.error("❌ Error response:", text);
        throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { commodity, state, district, market, from_date, to_date } = body;

        console.log("🔑 Loaded API KEY:", API_KEY ? "✅ Present" : "❌ Missing");

        // 1️⃣ Commodities
        const commodities = await safeFetch(`${BASE_URL}/commodities`);
        const commodityList = commodities.output?.data;
        if (!commodityList) throw new Error("Invalid commodities response");

        const commodityObj = commodityList.find(
            (c: any) =>
                c.commodity_name?.toLowerCase() === commodity?.toLowerCase()
        );
        if (!commodityObj) throw new Error(`Commodity not found: ${commodity}`);
        const commodity_id = commodityObj.commodity_id;

        // 2️⃣ Geographies
        const geographies = await safeFetch(`${BASE_URL}/geographies`);
        const geoData = geographies.output?.data;
        if (!geoData) throw new Error("Invalid geographies response");

        const stateObj = geoData.find(
            (s: any) =>
                s.census_state_name?.toLowerCase() === state?.toLowerCase()
        );
        if (!stateObj) throw new Error(`State not found: ${state}`);
        const state_id = stateObj.census_state_id;

        const districtObj = geoData.find(
            (d: any) =>
                d.census_state_id === state_id &&
                d.census_district_name?.toLowerCase() === district?.toLowerCase()
        );
        if (!districtObj) throw new Error(`District not found: ${district}`);
        const district_id = districtObj.census_district_id;


        // 3️⃣ Fetch markets (final fixed version)
        const marketPayload = {
            commodity_id,
            state_id,
            district_id,
            indicator: "price",
        };

        console.log("🧩 Market request body:", marketPayload);

        const markets = await safeFetch(`${BASE_URL}/markets`, {
            method: "POST",
            body: JSON.stringify(marketPayload),
        });

        if (!markets.output?.data)
            throw new Error("Invalid markets response");

        console.log(
            "🏪 Sample markets:",
            markets.output.data.slice(0, 5).map((m: any) => m.market_name)
        );

        const marketObj = markets.output.data.find(
            (m: any) => m.market_name.toLowerCase() === market?.toLowerCase()
        );
        if (!marketObj) throw new Error(`Market not found: ${market}`);
        const market_id = marketObj.market_id;

        // 4️⃣ Prices (same thing here — correct key names)
        // 4️⃣ Fetch prices (final fixed version)
        const pricePayload = {
            commodity_id,
            state_id,
            district_id: [district_id],
            market_id: [market_id],
            from_date,
            to_date,
            indicator: "price",
        };

        console.log("💰 Price request body:", pricePayload);

        const priceData = await safeFetch(`${BASE_URL}/prices`, {
            method: "POST",
            body: JSON.stringify(pricePayload),
        });


        return NextResponse.json(priceData);
    } catch (error: any) {
        console.error("❌ AgMarkNet error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Use POST to fetch crop data",
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
