import { NextResponse } from "next/server";
import { getMarkets } from "@/lib/agmarknet";

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
        
        return NextResponse.json({ 
            data: markets || [],
            count: markets?.length || 0
        });
    } catch (err: any) {
        console.error("Markets API error:", err);
        return NextResponse.json({ 
            error: err.message,
            data: [],
            count: 0
        }, { status: 500 });
    }
}
