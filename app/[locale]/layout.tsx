import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AgroInsightNav } from './components/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export const metadata = {
  title: "AgroInsight",
  description: "Helping farmers with crop insights and weather data.",
};

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  // AWAIT the params promise
  const { locale } = await params;
  const messages = await getMessages();

 

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AgroInsightNav/>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}