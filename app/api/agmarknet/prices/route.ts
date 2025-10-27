import { NextResponse } from "next/server";
import { getPrices } from "@/lib/agmarknet";

// Mock price data
const generateMockPrice = () => {
    const today = new Date();
    return {
        date: today.toISOString().split('T')[0],
        modal_price: Math.floor(Math.random() * 3000) + 1000,
        min_price: Math.floor(Math.random() * 2000) + 800,
        max_price: Math.floor(Math.random() * 4000) + 2000,
    };
};

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

        return NextResponse.json({ data: prices });
    } catch (err: any) {
        return NextResponse.json({ 
            data: [generateMockPrice()],
            warning: "Using mock data - API unavailable"
        });
    }
}
