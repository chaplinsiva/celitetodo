import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Celite Manager - AI-Powered Tasks & Finance',
  description:
    'A smart, offline-first manager for tasks and finances. Create tasks and track money with natural language, powered by Gemini AI.',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Celite Manager',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  icons: {
    icon: '/icon-512x512.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <PWAInstallPrompt />
        </AuthProvider>
        <Script
          src="https://pl30495157.effectivecpmnetwork.com/97/71/e6/9771e6509339e6feb369af0db20025cf.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
