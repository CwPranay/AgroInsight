import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Noto_Sans } from "next/font/google";
import "../globals.css";
import { AgroInsightNav } from './components/Navbar';
import { ClickFeedback } from './components/ClickFeedback';

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  display: 'swap',
  variable: "--font-noto-sans",
});

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export const metadata = {
  title: "AgroInsight - Agricultural Market Intelligence Platform",
  description: "Real-time crop prices, market trends, and agricultural insights for farmers across India. Track mandi rates, commodity prices, and make informed farming decisions.",
  keywords: "agriculture, crop prices, mandi rates, farming, India, agricultural market, commodity prices",
  authors: [{ name: "AgroInsight" }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "AgroInsight - Agricultural Market Intelligence",
    description: "Real-time crop prices and market trends for Indian farmers",
    type: "website",
    locale: "en_IN",
  },
};

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${notoSans.variable} antialiased`}>
      <body className={`${notoSans.className} overflow-x-hidden`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClickFeedback />
          <AgroInsightNav />
          <div className="overflow-x-hidden w-full">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}