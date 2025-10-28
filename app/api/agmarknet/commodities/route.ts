import { NextResponse } from "next/server";
import { getCommodities } from "@/lib/agmarknet";

export async function GET() {
    try {
        const commodities = await getCommodities();
        return NextResponse.json({ 
            data: commodities,
            count: commodities.length 
        });
    } catch (err: any) {
        console.error("Commodities API error:", err);
        return NextResponse.json({ 
            error: err.message,
            data: [],
            count: 0
        }, { status: 500 });
    }
}
