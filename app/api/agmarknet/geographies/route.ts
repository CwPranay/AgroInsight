import { NextResponse } from "next/server";
import { getGeographies } from "@/lib/agmarknet";

// Mock data as fallback
const MOCK_GEOGRAPHIES = [
    { census_state_id: 1, census_state_name: "Maharashtra", census_district_id: 101, census_district_name: "Pune" },
    { census_state_id: 1, census_state_name: "Maharashtra", census_district_id: 102, census_district_name: "Mumbai" },
    { census_state_id: 1, census_state_name: "Maharashtra", census_district_id: 103, census_district_name: "Nagpur" },
    { census_state_id: 2, census_state_name: "Gujarat", census_district_id: 201, census_district_name: "Ahmedabad" },
    { census_state_id: 2, census_state_name: "Gujarat", census_district_id: 202, census_district_name: "Surat" },
    { census_state_id: 3, census_state_name: "Madhya Pradesh", census_district_id: 301, census_district_name: "Indore" },
    { census_state_id: 3, census_state_name: "Madhya Pradesh", census_district_id: 302, census_district_name: "Bhopal" },
];

export async function GET() {
    try {
        const geographies = await getGeographies();
        return NextResponse.json({ 
            data: geographies,
            count: geographies.length 
        });
    } catch (err: any) {
        // Return mock data as fallback
        return NextResponse.json({ 
            data: MOCK_GEOGRAPHIES,
            count: MOCK_GEOGRAPHIES.length,
            warning: "Using mock data - API unavailable"
        });
    }
}
