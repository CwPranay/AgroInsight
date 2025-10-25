import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts'); // Add this path

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
};

export default withNextIntl(nextConfig);