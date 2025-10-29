import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get("lat");
        const lon = searchParams.get("lon");
        const city = searchParams.get("city");

        const apiKey = process.env.OPENWEATHER_API_KEY;
        

        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        let url = ""
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${apiKey}`;
        }

        else if (city) {
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=7&units=metric&appid=${apiKey}`;
        }
        else {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod && data.cod !== "200") {
            return NextResponse.json({ error: data.message || "Error fetching weather data" }, { status: parseInt(data.cod) || 500 });
        }
        return NextResponse.json(data);


    } catch (error) {
        console.error("Weather API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}