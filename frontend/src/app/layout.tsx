import '@/styles/globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { WebSocketProvider } from '@/components/providers/WebSocketProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata = {
  title: 'AI CMS - Intelligent Content Management System',
  description: 'Advanced AI-powered content management system with real-time collaboration, intelligent optimization, and comprehensive analytics.',
  keywords: 'CMS, AI, Content Management, AI-powered, Real-time Collaboration, SEO Optimization',
  authors: [{ name: 'MiniMax Agent' }],
  creator: 'MiniMax Agent',
  publisher: 'MiniMax Agent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'AI CMS - Intelligent Content Management System',
    description: 'Advanced AI-powered content management system with real-time collaboration, intelligent optimization, and comprehensive analytics.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'AI CMS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI CMS Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI CMS - Intelligent Content Management System',
    description: 'Advanced AI-powered content management system with real-time collaboration, intelligent optimization, and comprehensive analytics.',
    images: ['/og-image.png'],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

// Viewport must be exported separately in Next.js 14
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0A0A0A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} font-sans antialiased bg-neutral-950 text-neutral-200`}>
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <ToastProvider>
                <WebSocketProvider>
                  {children}
                </WebSocketProvider>
              </ToastProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
        <noscript>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 text-neutral-200">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">JavaScript Required</h1>
              <p className="text-neutral-400">
                This application requires JavaScript to function properly. 
                Please enable JavaScript in your browser settings.
              </p>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  );
}