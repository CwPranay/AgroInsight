import { NextResponse } from "next/server";
import { getPrices } from "@/lib/agmarknet";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { commodity_id, state_id, district_id, market_id, from_date, to_date } = body;

        if (!commodity_id || !state_id || !district_id || !market_id || !from_date || !to_date) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const prices = await getPrices({
            commodity_id,
            state_id,
            district_id,
            market_id,
            from_date,
            to_date,
        });

        return NextResponse.json({ 
            data: prices || [],
            count: prices?.length || 0
        });
    } catch (err: any) {
        console.error("Prices API error:", err);
        return NextResponse.json({ 
            error: err.message,
            data: [],
            count: 0
        }, { status: 500 });
    }
}
