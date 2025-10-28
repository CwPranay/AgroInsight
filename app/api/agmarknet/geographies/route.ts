import { NextResponse } from "next/server";
import { getGeographies } from "@/lib/agmarknet";

export async function GET() {
    try {
        const geographies = await getGeographies();
        return NextResponse.json({ 
            data: geographies,
            count: geographies.length 
        });
    } catch (err: any) {
        return NextResponse.json({ 
            error: err.message,
            data: [],
            count: 0
        }, { status: 500 });
    }
}
