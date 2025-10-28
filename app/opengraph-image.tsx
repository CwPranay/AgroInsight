import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'AgroInsight - Agricultural Market Intelligence'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #f97316 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 80,
            }}
          >
            🌾
          </div>
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          AgroInsight
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Real-time Crop Prices & Market Trends
        </div>
        
        {/* Badge */}
        <div
          style={{
            marginTop: 40,
            padding: '12px 32px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 50,
            fontSize: 24,
            color: 'white',
            display: 'flex',
          }}
        >
          Agricultural Market Intelligence Platform
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
