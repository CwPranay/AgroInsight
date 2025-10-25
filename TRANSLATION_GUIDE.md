# 🌐 Translation Guide for AgroInsight

## Current Status

✅ Translation files created: `messages/en.json` and `messages/hi.json`
✅ next-intl is already configured in your project
✅ Components are ready to be translated

## How to Add Translations to Components

### Example: HeroSection with Translations

**Before (hardcoded):**
```tsx
<h1>Smarter Decisions for Every Farmer</h1>
```

**After (translatable):**
```tsx
import { useTranslations } from 'next-intl'

export function HeroSection() {
  const t = useTranslations('hero')
  
  return (
    <h1>{t('headline')}</h1>
  )
}
```

## Step-by-Step Guide

### 1. Update HeroSection

```tsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sprout } from "lucide-react"
import { useTranslations } from 'next-intl'

export function HeroSection() {
  const t = useTranslations('hero')
  
  return (
    <section className="...">
      {/* Badge */}
      <span>{t('badge')}</span>
      
      {/* Headline */}
      <h1>{t('headline')}</h1>
      
      {/* Subtext */}
      <p>{t('subtext')}</p>
      
      {/* Buttons */}
      <Link href="/crop-prices">{t('ctaPrimary')}</Link>
      <Link href="/weather">{t('ctaSecondary')}</Link>
      
      {/* Stats */}
      <div>{t('stats.farmers')}</div>
      <div>{t('stats.markets')}</div>
      <div>{t('stats.updates')}</div>
    </section>
  )
}
```

### 2. Update FeaturesGrid

```tsx
"use client"

import { useTranslations } from 'next-intl'

export function FeaturesGrid() {
  const t = useTranslations('features')
  
  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('subtitle')}</p>
      
      {/* Feature Cards */}
      <div>
        <h3>{t('cropPrices.title')}</h3>
        <p>{t('cropPrices.description')}</p>
      </div>
      
      <div>
        <h3>{t('weather.title')}</h3>
        <p>{t('weather.description')}</p>
      </div>
      
      {/* ... more features */}
    </section>
  )
}
```

### 3. Update LiveDataPreview

```tsx
"use client"

import { useTranslations } from 'next-intl'

export function LiveDataPreview() {
  const t = useTranslations('liveData')
  
  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('subtitle')}</p>
      
      {/* Crop Prices */}
      <h3>{t('cropPrices.title')}</h3>
      <span>{t('cropPrices.updated')}</span>
      <button>{t('cropPrices.viewAll')}</button>
      
      {/* Weather */}
      <h3>{t('weather.title')}</h3>
      <span>{t('weather.rainfall')}</span>
      <span>{t('weather.humidity')}</span>
      <button>{t('weather.forecast')}</button>
    </section>
  )
}
```

### 4. Update ValueSection

```tsx
"use client"

import { useTranslations } from 'next-intl'

export function ValueSection() {
  const t = useTranslations('value')
  
  return (
    <section>
      <h2>{t('title')}</h2>
      <p>{t('subtitle')}</p>
      
      {/* Value Cards */}
      <div>
        <h3>{t('dataInsights.title')}</h3>
        <p>{t('dataInsights.description')}</p>
      </div>
      
      <div>
        <h3>{t('realTime.title')}</h3>
        <p>{t('realTime.description')}</p>
      </div>
      
      <div>
        <h3>{t('multilingual.title')}</h3>
        <p>{t('multilingual.description')}</p>
      </div>
      
      {/* Stats */}
      <div>{t('stats.users')}</div>
      <div>{t('stats.markets')}</div>
      <div>{t('stats.uptime')}</div>
      <div>{t('stats.support')}</div>
    </section>
  )
}
```

### 5. Update FooterCTA

```tsx
"use client"

import { useTranslations } from 'next-intl'

export function FooterCTA() {
  const t = useTranslations('footerCTA')
  
  return (
    <section>
      <h2>{t('headline')}</h2>
      <p>{t('subtext')}</p>
      <Link href="/crop-prices">{t('cta')}</Link>
      
      {/* Trust Indicators */}
      <span>{t('trust.free')}</span>
      <span>{t('trust.noCard')}</span>
      <span>{t('trust.instant')}</span>
    </section>
  )
}
```

## Translation Files Structure

### messages/en.json
```json
{
  "hero": {
    "badge": "Empowering Farmers with Data",
    "headline": "Smarter Decisions for Every Farmer",
    "subtext": "Track crop prices, monitor weather...",
    "ctaPrimary": "View Dashboard",
    "ctaSecondary": "Check Weather",
    "stats": {
      "farmers": "Active Farmers",
      "markets": "Markets Tracked",
      "updates": "Live Updates"
    }
  },
  "features": { ... },
  "liveData": { ... },
  "value": { ... },
  "footerCTA": { ... }
}
```

### messages/hi.json
```json
{
  "hero": {
    "badge": "डेटा के साथ किसानों को सशक्त बनाना",
    "headline": "हर किसान के लिए स्मार्ट निर्णय",
    "subtext": "फसल की कीमतों को ट्रैक करें...",
    "ctaPrimary": "डैशबोर्ड देखें",
    "ctaSecondary": "मौसम जांचें",
    "stats": {
      "farmers": "सक्रिय किसान",
      "markets": "ट्रैक किए गए बाजार",
      "updates": "लाइव अपडेट"
    }
  },
  "features": { ... },
  "liveData": { ... },
  "value": { ... },
  "footerCTA": { ... }
}
```

## Language Switching

Your navbar already has a language switcher! When users click it:

1. URL changes: `/en` → `/hi`
2. next-intl automatically loads the correct messages
3. All components re-render with new translations

## Testing Translations

1. Visit: `http://localhost:3000/en` (English)
2. Visit: `http://localhost:3000/hi` (Hindi)
3. Use the language switcher in the navbar

## Adding More Languages

1. Create new file: `messages/es.json` (Spanish)
2. Copy structure from `en.json`
3. Translate all values
4. Update `i18n.ts` config to include 'es'

## Best Practices

✅ **DO:**
- Keep translation keys descriptive
- Use nested objects for organization
- Test both languages regularly
- Keep translations up to date

❌ **DON'T:**
- Hardcode text in components
- Mix languages in one file
- Forget to translate new features
- Use machine translation without review

## Quick Reference

| Component | Translation Key | Example |
|-----------|----------------|---------|
| HeroSection | `hero.*` | `t('hero.headline')` |
| FeaturesGrid | `features.*` | `t('features.title')` |
| LiveDataPreview | `liveData.*` | `t('liveData.title')` |
| ValueSection | `value.*` | `t('value.title')` |
| FooterCTA | `footerCTA.*` | `t('footerCTA.headline')` |

## Current Status

✅ Translation files ready
✅ next-intl configured
⚠️ Components need to be updated to use translations

## To Enable Translations

Simply update each component to use `useTranslations()` as shown above!

---

**Note**: The current components work perfectly with hardcoded English text. Translations are optional but recommended for reaching more farmers!
