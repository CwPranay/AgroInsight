import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { Noto_Sans } from "next/font/google";
import "../globals.css";
import { AgroInsightNav } from './components/Navbar';

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
  title: "AgroInsight",
  description: "Helping farmers with crop insights and weather data.",
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
          <AgroInsightNav />
          <div className="overflow-x-hidden w-full">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}