// Generate dates for the last 7 days
const generateDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

const dates = generateDates()

export const cropTrends = [
  {
    crop: "Wheat",
    market: "Pune Market 1",
    state: "Maharashtra",
    trend: dates.map((date, i) => ({ date, price: 2450 + (i * 5) + Math.floor(Math.random() * 30) - 15 })),
  },
  {
    crop: "Rice",
    market: "Nagpur Market 1",
    state: "Maharashtra",
    trend: dates.map((date, i) => ({ date, price: 3100 + (i * 8) + Math.floor(Math.random() * 40) - 20 })),
  },
  {
    crop: "Tomato",
    market: "Mumbai Market 1",
    state: "Maharashtra",
    trend: dates.map((date, i) => ({ date, price: 1800 + (i * 15) + Math.floor(Math.random() * 50) - 25 })),
  },
  {
    crop: "Onion",
    market: "Nashik Market 1",
    state: "Maharashtra",
    trend: dates.map((date, i) => ({ date, price: 2200 + (i * 10) + Math.floor(Math.random() * 60) - 30 })),
  },
  {
    crop: "Potato",
    market: "Pune Market 2",
    state: "Maharashtra",
    trend: dates.map((date, i) => ({ date, price: 1500 + (i * 7) + Math.floor(Math.random() * 40) - 20 })),
  },
  {
    crop: "Cotton",
    market: "Aurangabad Market 1",
    state: "Maharashtra",
    trend: dates.map((date, i) => ({ date, price: 6700 + (i * 12) + Math.floor(Math.random() * 80) - 40 })),
  },
  {
    crop: "Soybean",
    market: "Indore Market 1",
    state: "Madhya Pradesh",
    trend: dates.map((date, i) => ({ date, price: 4850 + (i * 10) + Math.floor(Math.random() * 50) - 25 })),
  },
  {
    crop: "Bajra",
    market: "Ahmedabad Market 1",
    state: "Gujarat",
    trend: dates.map((date, i) => ({ date, price: 2250 + (i * 6) + Math.floor(Math.random() * 30) - 15 })),
  },
  {
    crop: "Maize",
    market: "Surat Market 1",
    state: "Gujarat",
    trend: dates.map((date, i) => ({ date, price: 1900 + (i * 8) + Math.floor(Math.random() * 35) - 18 })),
  },
  {
    crop: "Groundnut",
    market: "Rajkot Market 1",
    state: "Gujarat",
    trend: dates.map((date, i) => ({ date, price: 5500 + (i * 15) + Math.floor(Math.random() * 70) - 35 })),
  },
  {
    crop: "Sugarcane",
    market: "Bhopal Market 1",
    state: "Madhya Pradesh",
    trend: dates.map((date, i) => ({ date, price: 3200 + (i * 9) + Math.floor(Math.random() * 45) - 22 })),
  },
  {
    crop: "Jowar",
    market: "Bangalore Market 1",
    state: "Karnataka",
    trend: dates.map((date, i) => ({ date, price: 2800 + (i * 7) + Math.floor(Math.random() * 40) - 20 })),
  },
  {
    crop: "Tur (Arhar)",
    market: "Mysore Market 1",
    state: "Karnataka",
    trend: dates.map((date, i) => ({ date, price: 7200 + (i * 18) + Math.floor(Math.random() * 90) - 45 })),
  },
  {
    crop: "Gram",
    market: "Chennai Market 1",
    state: "Tamil Nadu",
    trend: dates.map((date, i) => ({ date, price: 5800 + (i * 14) + Math.floor(Math.random() * 70) - 35 })),
  },
  {
    crop: "Moong",
    market: "Coimbatore Market 1",
    state: "Tamil Nadu",
    trend: dates.map((date, i) => ({ date, price: 8500 + (i * 20) + Math.floor(Math.random() * 100) - 50 })),
  },
  {
    crop: "Urad",
    market: "Jaipur Market 1",
    state: "Rajasthan",
    trend: dates.map((date, i) => ({ date, price: 7800 + (i * 17) + Math.floor(Math.random() * 85) - 42 })),
  },
  {
    crop: "Masoor",
    market: "Ludhiana Market 1",
    state: "Punjab",
    trend: dates.map((date, i) => ({ date, price: 6500 + (i * 16) + Math.floor(Math.random() * 80) - 40 })),
  },
  {
    crop: "Sunflower",
    market: "Gurgaon Market 1",
    state: "Haryana",
    trend: dates.map((date, i) => ({ date, price: 6200 + (i * 15) + Math.floor(Math.random() * 75) - 38 })),
  },
  {
    crop: "Mustard",
    market: "Lucknow Market 1",
    state: "Uttar Pradesh",
    trend: dates.map((date, i) => ({ date, price: 5400 + (i * 13) + Math.floor(Math.random() * 65) - 32 })),
  },
  {
    crop: "Groundnut Oil",
    market: "Kolkata Market 1",
    state: "West Bengal",
    trend: dates.map((date, i) => ({ date, price: 12000 + (i * 25) + Math.floor(Math.random() * 120) - 60 })),
  },
]
