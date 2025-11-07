# 🌾 AgroInsight

<div align="center">
  <a href="https://agro-insights.vercel.app/" target="_blank">
    <img src="public/agroinsight.png" alt="AgroInsight Logo" width="400"/>
  </a>
</div>

Modern agricultural intelligence platform providing real-time weather, soil analysis, market trends, and irrigation recommendations for farmers.

![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **Weather Dashboard** - 6-day forecast with location-based data
- **Soil Insights** - Real-time soil analysis (moisture, pH, composition)
- **Irrigation Tips** - Weather-based irrigation recommendations
- **Market Trends** - Agricultural commodity price tracking
- **Multi-language** - English and Hindi support
- **Responsive** - Works on all devices

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm/yarn/pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/agroinsight.git
cd agroinsight

# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
AGMARKNET_API_KEY=your_key
OPENWEATHER_API_KEY=your_key
AGROMONITORING_API_KEY=your_key

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Get API Keys:**
- [OpenWeatherMap](https://openweathermap.org/api)
- [AgroMonitoring](https://agromonitoring.com/)
- [AgMarkNet](https://agmarknet.gov.in/)

## Docker Deployment

### Using Docker
```bash
# Build image
docker build -t agroinsight .

# Run container
docker run -p 3000:3000 \
  -e AGMARKNET_API_KEY=your_key \
  -e OPENWEATHER_API_KEY=your_key \
  -e AGROMONITORING_API_KEY=your_key \
  agroinsight
```

### Using Docker Compose
```yaml
# docker-compose.yml
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

```bash
# Start
docker-compose up -d

# Stop
docker-compose down
```

## Production Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI**: Radix UI, Framer Motion
- **Charts**: Recharts
- **i18n**: next-intl

## Project Structure

```
app/
├── [locale]/           # i18n routes
│   ├── about/
│   ├── irrigation-tips/
│   ├── market-trends/
│   ├── soil-insights/
│   └── weatherDashboard/
├── api/               # API routes
│   ├── irrigation-tips/
│   ├── soil/
│   └── weather/
messages/              # Translations (en, hi)
```

## API Integration

- **OpenWeatherMap** - Weather forecasts & irrigation data
- **Open-Meteo** - Soil moisture & temperature
- **Nominatim** - Reverse geocoding

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AGMARKNET_API_KEY` | Market data |
| `OPENWEATHER_API_KEY` | Weather data |
| `AGROMONITORING_API_KEY` | Soil monitoring |

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request


---

Made with ❤️ for farmers and agricultural professionals
