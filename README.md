# 🌾 AgroInsight

**AgroInsight** is a modern agricultural intelligence platform built with Next.js, providing farmers and agricultural professionals with real-time insights on weather, soil conditions, market trends, and irrigation recommendations.

![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🌤️ **Weather Dashboard** - 6-day weather forecast with detailed metrics
- 🌱 **Soil Insights** - Real-time soil analysis with moisture, pH, and composition data
- 💧 **Irrigation Tips** - Location-based irrigation recommendations by season
- 📊 **Market Trends** - Agricultural commodity price tracking and analysis
- 🌍 **Multi-language Support** - Available in English and Hindi
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎯 **Location-based Services** - GPS-enabled location detection with reverse geocoding

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agroinsight.git
   cd agroinsight
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   AGMARKNET_API_KEY=your_agmarknet_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   AGROMONITORING_API_KEY=your_agromonitoring_api_key
   ```

   **API Keys:**
   - **OpenWeather API**: Get your free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - **AgroMonitoring API**: Sign up at [AgroMonitoring](https://agromonitoring.com/)
   - **AgMarkNet API**: Register at [AgMarkNet](https://agmarknet.gov.in/)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Using Docker

1. **Build the Docker image**
   ```bash
   docker build -t agroinsight .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e AGMARKNET_API_KEY=your_agmarknet_api_key \
     -e OPENWEATHER_API_KEY=your_openweather_api_key \
     -e AGROMONITORING_API_KEY=your_agromonitoring_api_key \
     agroinsight
   ```

3. **Access the application**
   
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Using Docker Compose

1. **Create a `docker-compose.yml` file**
   ```yaml
   version: '3.8'
   
   services:
     agroinsight:
       build: .
       ports:
         - "3000:3000"
       environment:
         - AGMARKNET_API_KEY=${AGMARKNET_API_KEY}
         - OPENWEATHER_API_KEY=${OPENWEATHER_API_KEY}
         - AGROMONITORING_API_KEY=${AGROMONITORING_API_KEY}
       restart: unless-stopped
   ```

2. **Create a `.env` file** (for Docker Compose)
   ```env
   AGMARKNET_API_KEY=your_agmarknet_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   AGROMONITORING_API_KEY=your_agromonitoring_api_key
   ```

3. **Start the services**
   ```bash
   docker-compose up -d
   ```

4. **Stop the services**
   ```bash
   docker-compose down
   ```

## 📦 Production Build

### Local Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)

## 📁 Project Structure

```
agroinsight/
├── app/
│   ├── [locale]/              # Internationalized routes
│   │   ├── about/             # About page
│   │   ├── components/        # Shared components
│   │   ├── contexts/          # React contexts (Location)
│   │   ├── irrigation-tips/   # Irrigation recommendations
│   │   ├── market-trends/     # Market price tracking
│   │   ├── soil-insights/     # Soil analysis
│   │   └── weatherDashboard/  # Weather forecast
│   └── api/                   # API routes
│       ├── soil/              # Soil data API
│       └── weather/           # Weather data API
├── messages/                  # i18n translation files
│   ├── en.json               # English translations
│   └── hi.json               # Hindi translations
├── public/                    # Static assets
├── Dockerfile                 # Docker configuration
├── .dockerignore             # Docker ignore rules
└── package.json              # Dependencies
```

## 🌐 API Integration

AgroInsight integrates with multiple agricultural and weather APIs:

- **Open-Meteo**: Soil moisture and temperature data
- **OpenWeatherMap**: Weather forecasts and conditions
- **AgroMonitoring**: Satellite-based agricultural monitoring
- **Nominatim (OpenStreetMap)**: Reverse geocoding for location names

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AGMARKNET_API_KEY` | AgMarkNet API key for market data | Yes |
| `OPENWEATHER_API_KEY` | OpenWeather API key for weather data | Yes |
| `AGROMONITORING_API_KEY` | AgroMonitoring API key for soil data | Yes |

### Caching

- **Soil Data**: Cached for 6 hours to reduce API calls
- **Weather Data**: Cached using Next.js revalidation (6 hours)

## 🌍 Internationalization

AgroInsight supports multiple languages:

- **English** (`/en`)
- **Hindi** (`/hi`)

To add a new language:
1. Create a new JSON file in `messages/` (e.g., `messages/es.json`)
2. Add translations following the existing structure
3. Update the locale configuration in `i18n.ts`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Soil data from [Open-Meteo](https://open-meteo.com/)
- Market data from [AgMarkNet](https://agmarknet.gov.in/)
- Icons by [Lucide](https://lucide.dev/)

## 📧 Support

For support, email support@agroinsight.com or open an issue in the GitHub repository.

---

**Made with ❤️ for farmers and agricultural professionals**
