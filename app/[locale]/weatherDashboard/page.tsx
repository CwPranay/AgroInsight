import SevenDayForecast from "./components/7dayforecast"

export default function WeatherDashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30">
            {/* Hero Section */}
            <header className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white mt-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-4">
                            <span className="text-xl sm:text-2xl">🌤️</span>
                            <span className="text-xs sm:text-sm font-medium">Weather Intelligence</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                            Weather Dashboard
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-blue-50 max-w-2xl">
                            Get accurate weather forecasts to plan your farming activities effectively
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <section id="weather-forecast">
                    <SevenDayForecast />
                </section>
            </main>
        </div>
    )
}
