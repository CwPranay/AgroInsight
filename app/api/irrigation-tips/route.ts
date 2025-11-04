import { NextRequest, NextResponse } from "next/server"

interface IrrigationTip {
    id: number
    crop: string
    season: string
    state: string
    district: string
    city: string
    title: string
    description: string
    icon: string
    weatherBased: boolean
}

interface WeatherData {
    temp: number
    humidity: number
    rainfall: number
    condition: string
    windSpeed: number
}

// Get current season based on month
function getCurrentSeason(): string {
    const month = new Date().getMonth() + 1
    if (month >= 6 && month <= 10) return "Kharif"
    if (month >= 11 || month <= 3) return "Rabi"
    if (month >= 4 && month <= 5) return "Summer"
    return "Winter"
}

// Fetch weather data from OpenWeather API
async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY
        if (!apiKey) {
            console.error("OpenWeather API key not found")
            return null
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache for 1 hour

        if (!response.ok) {
            console.error("Weather API request failed:", response.status)
            return null
        }

        const data = await response.json()

        // Get forecast for rainfall prediction
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        const forecastResponse = await fetch(forecastUrl, { next: { revalidate: 3600 } })

        let rainfall = 0
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json()
            // Calculate total rainfall in next 24 hours
            rainfall = forecastData.list.slice(0, 8).reduce((sum: number, item: any) => {
                return sum + (item.rain?.['3h'] || 0)
            }, 0)
        }

        return {
            temp: data.main.temp,
            humidity: data.main.humidity,
            rainfall,
            condition: data.weather[0].main,
            windSpeed: data.wind.speed
        }
    } catch (error) {
        console.error("Error fetching weather data:", error)
        return null
    }
}



// Get crops suitable for current season
function getSeasonalCrops(season: string): Array<{ name: string, icon: string }> {
    switch (season) {
        case "Kharif": // Monsoon season (June-October)
            return [
                { name: "Rice", icon: "🌾" },
                { name: "Cotton", icon: "🌱" },
                { name: "Maize", icon: "🌽" },
                { name: "Soybean", icon: "🫘" },
                { name: "Groundnut", icon: "🥜" }
            ]
        case "Rabi": // Winter season (November-March)
            return [
                { name: "Wheat", icon: "🌾" },
                { name: "Potato", icon: "🥔" },
                { name: "Onion", icon: "🧅" },
                { name: "Tomato", icon: "🍅" },
                { name: "Cabbage", icon: "🥬" }
            ]
        case "Summer": // Summer season (April-May)
            return [
                { name: "Sugarcane", icon: "🎋" },
                { name: "Mango", icon: "🥭" },
                { name: "Watermelon", icon: "🍉" },
                { name: "Cucumber", icon: "🥒" },
                { name: "Vegetables", icon: "🥗" }
            ]
        default: // Winter
            return [
                { name: "Vegetables", icon: "🥗" },
                { name: "Leafy Greens", icon: "🥬" },
                { name: "Carrots", icon: "🥕" }
            ]
    }
}



// Get crop-specific irrigation advice
function getCropSpecificAdvice(crop: string, season: string, weather: WeatherData, locale: string = "en"): string {
    const adviceMap: Record<string, Record<string, string>> = {
        "Rice": {
            en: weather.rainfall > 10
                ? "Maintain 2-3 inches standing water. Drain excess water to prevent lodging."
                : "Keep fields flooded with 2-3 inches water during vegetative stage.",
            hi: weather.rainfall > 10
                ? "2-3 इंच खड़ा पानी बनाए रखें। गिरने से रोकने के लिए अतिरिक्त पानी निकालें।"
                : "वनस्पति अवस्था के दौरान खेतों को 2-3 इंच पानी से भरा रखें।"
        },
        "Wheat": {
            en: "Critical stages: Crown root initiation, tillering, flowering. Don't miss these irrigations.",
            hi: "महत्वपूर्ण चरण: मुकुट जड़ आरंभ, कल्ले फूटना, फूल आना। इन सिंचाइयों को न चूकें।"
        },
        "Cotton": {
            en: "Use drip irrigation if possible. Deep but infrequent watering encourages deep roots.",
            hi: "यदि संभव हो तो ड्रिप सिंचाई का उपयोग करें। गहरी लेकिन कम बार पानी देने से गहरी जड़ें बढ़ती हैं।"
        },
        "Potato": {
            en: "Consistent moisture is key. Irregular watering causes hollow heart and misshapen tubers.",
            hi: "लगातार नमी महत्वपूर्ण है। अनियमित पानी देने से खोखले और विकृत कंद होते हैं।"
        },
        "Tomato": {
            en: "Drip irrigation at root zone prevents leaf diseases. Mulch to maintain moisture.",
            hi: "जड़ क्षेत्र में ड्रिप सिंचाई पत्ती रोगों को रोकती है। नमी बनाए रखने के लिए मल्च करें।"
        },
        "Onion": {
            en: "Shallow roots need frequent light irrigation. Stop watering 2 weeks before harvest.",
            hi: "उथली जड़ों को बार-बार हल्की सिंचाई की आवश्यकता होती है। कटाई से 2 सप्ताह पहले पानी देना बंद करें।"
        },
        "Sugarcane": {
            en: "Water every 7-10 days. Increase frequency during tillering and grand growth phase.",
            hi: "हर 7-10 दिन में पानी दें। कल्ले फूटने और बड़ी वृद्धि चरण के दौरान आवृत्ति बढ़ाएं।"
        },
        "Maize": {
            en: "Critical at tasseling and silking. Water stress here severely reduces yield.",
            hi: "फूल आने और रेशम निकलने पर महत्वपूर्ण। यहां पानी की कमी से उपज गंभीर रूप से कम होती है।"
        },
        "Soybean": {
            en: "Ensure moisture during flowering and pod filling stages for better yield.",
            hi: "बेहतर उपज के लिए फूल आने और फली भरने के चरणों में नमी सुनिश्चित करें।"
        },
        "Groundnut": {
            en: "Drought tolerant but needs water during pod formation. Avoid waterlogging.",
            hi: "सूखा सहिष्णु लेकिन फली बनने के दौरान पानी की आवश्यकता होती है। जलभराव से बचें।"
        },
        "Cabbage": {
            en: "Regular watering prevents head splitting. Maintain consistent soil moisture.",
            hi: "नियमित पानी देने से सिर फटने से बचता है। लगातार मिट्टी की नमी बनाए रखें।"
        },
        "Mango": {
            en: "Deep watering once a week. Reduce during flowering to prevent flower drop.",
            hi: "सप्ताह में एक बार गहरा पानी दें। फूल गिरने से रोकने के लिए फूल आने के दौरान कम करें।"
        },
        "Watermelon": {
            en: "Drip irrigation recommended. Reduce water as fruits ripen for better sweetness.",
            hi: "ड्रिप सिंचाई की सिफारिश की जाती है। बेहतर मिठास के लिए फल पकने पर पानी कम करें।"
        },
        "Cucumber": {
            en: "Needs consistent moisture. Mulch heavily and use drip irrigation.",
            hi: "लगातार नमी की आवश्यकता है। भारी मल्च करें और ड्रिप सिंचाई का उपयोग करें।"
        },
        "Vegetables": {
            en: "Most vegetables need 1-2 inches water per week. Adjust based on weather.",
            hi: "अधिकांश सब्जियों को प्रति सप्ताह 1-2 इंच पानी की आवश्यकता होती है। मौसम के आधार पर समायोजित करें।"
        },
        "Leafy Greens": {
            en: "Keep soil consistently moist but not waterlogged. Light daily watering works best.",
            hi: "मिट्टी को लगातार नम रखें लेकिन जलभराव न करें। हल्का दैनिक पानी देना सबसे अच्छा काम करता है।"
        },
        "Carrots": {
            en: "Even moisture prevents splitting. Reduce water as roots mature.",
            hi: "समान नमी फटने से रोकती है। जड़ें परिपक्व होने पर पानी कम करें।"
        }
    }

    const lang = locale === "hi" ? "hi" : "en"
    return adviceMap[crop]?.[lang] || (lang === "hi" ? "मिट्टी की नमी की निगरानी करें और तदनुसार सिंचाई समायोजित करें।" : "Monitor soil moisture and adjust irrigation accordingly.")
}

// Translations for irrigation tips
const translations = {
    en: {
        crops: {
            "Rice": "Rice",
            "Wheat": "Wheat",
            "Cotton": "Cotton",
            "Potato": "Potato",
            "Tomato": "Tomato",
            "Onion": "Onion",
            "Sugarcane": "Sugarcane",
            "Maize": "Maize",
            "Soybean": "Soybean",
            "Groundnut": "Groundnut",
            "Cabbage": "Cabbage",
            "Mango": "Mango",
            "Watermelon": "Watermelon",
            "Cucumber": "Cucumber",
            "Vegetables": "Vegetables",
            "Leafy Greens": "Leafy Greens",
            "Carrots": "Carrots"
        },
        titles: {
            heavyRain: "Reduce Irrigation - Heavy Rain Expected",
            moderateRain: "Light Irrigation Needed",
            hotDry: "Increase Irrigation - Hot & Dry",
            hotModerate: "Regular Irrigation Required",
            coolHumid: "Reduce Irrigation Frequency",
            optimal: "Optimal Irrigation Schedule"
        },
        descriptions: {
            heavyRain: "Heavy rainfall ({rainfall}mm) expected in next 24 hours. Skip irrigation for {crop}. Ensure proper drainage to prevent waterlogging. Check fields after rain stops.",
            moderateRain: "Moderate rain ({rainfall}mm) expected. Provide light irrigation to {crop} only if soil is dry. Monitor soil moisture levels closely.",
            hotDry: "High temperature ({temp}°C) and low humidity ({humidity}%). {crop} needs frequent irrigation. Water early morning or evening. Consider mulching to retain moisture.",
            hotModerate: "Temperature at {temp}°C with {humidity}% humidity. Maintain regular irrigation schedule for {crop}. Water every 2-3 days depending on soil type.",
            coolHumid: "Cool weather ({temp}°C) with high humidity ({humidity}%). {crop} needs less water. Irrigate every 4-5 days. Avoid overwatering to prevent fungal diseases.",
            optimal: "Current conditions ({temp}°C, {humidity}% humidity) are favorable. Maintain standard irrigation for {crop}. Water every 3-4 days or when top 2 inches of soil is dry."
        }
    },
    hi: {
        crops: {
            "Rice": "चावल",
            "Wheat": "गेहूं",
            "Cotton": "कपास",
            "Potato": "आलू",
            "Tomato": "टमाटर",
            "Onion": "प्याज",
            "Sugarcane": "गन्ना",
            "Maize": "मक्का",
            "Soybean": "सोयाबीन",
            "Groundnut": "मूंगफली",
            "Cabbage": "पत्तागोभी",
            "Mango": "आम",
            "Watermelon": "तरबूज",
            "Cucumber": "खीरा",
            "Vegetables": "सब्जियां",
            "Leafy Greens": "पत्तेदार साग",
            "Carrots": "गाजर"
        },
        titles: {
            heavyRain: "सिंचाई कम करें - भारी बारिश की संभावना",
            moderateRain: "हल्की सिंचाई आवश्यक",
            hotDry: "सिंचाई बढ़ाएं - गर्म और शुष्क",
            hotModerate: "नियमित सिंचाई आवश्यक",
            coolHumid: "सिंचाई की आवृत्ति कम करें",
            optimal: "इष्टतम सिंचाई अनुसूची"
        },
        descriptions: {
            heavyRain: "अगले 24 घंटों में भारी बारिश ({rainfall}मिमी) की संभावना। {crop} के लिए सिंचाई छोड़ें। जलभराव रोकने के लिए उचित जल निकासी सुनिश्चित करें। बारिश रुकने के बाद खेतों की जांच करें।",
            moderateRain: "मध्यम बारिश ({rainfall}मिमी) की संभावना। {crop} को हल्की सिंचाई केवल तभी दें जब मिट्टी सूखी हो। मिट्टी की नमी के स्तर की बारीकी से निगरानी करें।",
            hotDry: "उच्च तापमान ({temp}°C) और कम आर्द्रता ({humidity}%)। {crop} को बार-बार सिंचाई की आवश्यकता है। सुबह जल्दी या शाम को पानी दें। नमी बनाए रखने के लिए मल्चिंग पर विचार करें।",
            hotModerate: "तापमान {temp}°C और {humidity}% आर्द्रता। {crop} के लिए नियमित सिंचाई अनुसूची बनाए रखें। मिट्टी के प्रकार के आधार पर हर 2-3 दिन में पानी दें।",
            coolHumid: "ठंडा मौसम ({temp}°C) और उच्च आर्द्रता ({humidity}%)। {crop} को कम पानी की आवश्यकता है। हर 4-5 दिन में सिंचाई करें। फंगल रोगों को रोकने के लिए अधिक पानी देने से बचें।",
            optimal: "वर्तमान स्थितियां ({temp}°C, {humidity}% आर्द्रता) अनुकूल हैं। {crop} के लिए मानक सिंचाई बनाए रखें। हर 3-4 दिन में या जब मिट्टी के ऊपर 2 इंच सूख जाए तो पानी दें।"
        }
    }
}

function getTranslatedTip(
    crop: { name: string, icon: string },
    weather: WeatherData,
    season: string,
    city: string,
    district: string,
    state: string,
    id: number,
    locale: string = "en"
): IrrigationTip | null {
    const { temp, humidity, rainfall } = weather
    const lang = locale === "hi" ? translations.hi : translations.en

    let titleKey = ""
    let descKey = ""

    if (rainfall > 20) {
        titleKey = "heavyRain"
        descKey = "heavyRain"
    } else if (rainfall > 5) {
        titleKey = "moderateRain"
        descKey = "moderateRain"
    } else if (temp > 35 && humidity < 40) {
        titleKey = "hotDry"
        descKey = "hotDry"
    } else if (temp > 30 && humidity < 60) {
        titleKey = "hotModerate"
        descKey = "hotModerate"
    } else if (temp < 20 && humidity > 70) {
        titleKey = "coolHumid"
        descKey = "coolHumid"
    } else {
        titleKey = "optimal"
        descKey = "optimal"
    }

    const translatedCrop = lang.crops[crop.name as keyof typeof lang.crops] || crop.name
    const title = lang.titles[titleKey as keyof typeof lang.titles]
    let description = lang.descriptions[descKey as keyof typeof lang.descriptions]

    description = description
        .replace(/{rainfall}/g, rainfall.toFixed(1))
        .replace(/{crop}/g, translatedCrop)
        .replace(/{temp}/g, temp.toFixed(1))
        .replace(/{humidity}/g, humidity.toString())

    const cropAdvice = getCropSpecificAdvice(crop.name, season, weather, locale)
    description += ` ${cropAdvice}`

    return {
        id,
        crop: translatedCrop,
        season,
        state,
        district,
        city,
        title,
        description,
        icon: crop.icon,
        weatherBased: true
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const city = searchParams.get("city") || "Unknown"
    const district = searchParams.get("district") || "Unknown"
    const state = searchParams.get("state") || "Unknown"
    const season = searchParams.get("season") || getCurrentSeason()
    const locale = searchParams.get("locale") || "en"

    if (!lat || !lon) {
        return NextResponse.json({
            error: "Latitude and longitude are required"
        }, { status: 400 })
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)

    if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json({
            error: "Invalid coordinates"
        }, { status: 400 })
    }

    // Fetch weather data
    const weather = await fetchWeatherData(latitude, longitude)

    if (!weather) {
        return NextResponse.json({
            error: "Failed to fetch weather data"
        }, { status: 500 })
    }

    // Generate weather-based irrigation tips with translations
    const seasonalCrops = getSeasonalCrops(season)
    const tips: IrrigationTip[] = []
    let tipId = 1

    for (const crop of seasonalCrops) {
        const tip = getTranslatedTip(crop, weather, season, city, district, state, tipId++, locale)
        if (tip) tips.push(tip)
    }

    return NextResponse.json({
        tips,
        location: { city, district, state, lat: latitude, lon: longitude },
        season,
        weather: {
            temperature: weather.temp,
            humidity: weather.humidity,
            rainfall: weather.rainfall,
            condition: weather.condition,
            windSpeed: weather.windSpeed
        },
        count: tips.length,
        generatedAt: new Date().toISOString()
    })
}
