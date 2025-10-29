import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const city = searchParams.get("city");

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    let url = "";
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    } else {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod && data.cod !== "200") {
      return NextResponse.json(
        { error: data.message || "Error fetching weather data" },
        { status: parseInt(data.cod) || 500 }
      );
    }

    // ✅ Group forecast data by day
    const dailyData = Object.values(
      data.list.reduce((acc: any, item: any) => {
        const date = item.dt_txt.split(" ")[0]; // e.g. "2025-10-30"
        if (!acc[date]) acc[date] = [];

        acc[date].push(item);
        return acc;
      }, {})
    ).map((dayItems: any) => {
      const temps = dayItems.map((i: any) => i.main.temp);
      const avgTemp =
        temps.reduce((a: number, b: number) => a + b, 0) / temps.length;

      // Pick the middle record (around noon)
      const mainItem = dayItems[Math.floor(dayItems.length / 2)];

      return {
        date: mainItem.dt_txt.split(" ")[0],
        temp: avgTemp.toFixed(1),
        min: Math.min(...dayItems.map((i: any) => i.main.temp_min)).toFixed(1),
        max: Math.max(...dayItems.map((i: any) => i.main.temp_max)).toFixed(1),
        weather: mainItem.weather[0].main,
        description: mainItem.weather[0].description,
        icon: mainItem.weather[0].icon,
      };
    });

    // Limit to 7 days
    const forecast7Days = dailyData.slice(0, 7);

    return NextResponse.json({
      city: data.city,
      forecast: forecast7Days,
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
