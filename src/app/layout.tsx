import type { Metadata } from "next";
import { Josefin_Sans, Lexend } from "next/font/google";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  display: "swap",
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://quentino.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Quentin Orhant - Maker et développeur freelance",
  description: "Portfolio de Quentin Orhant, maker et développeur freelance spécialisé dans les projets entre écologie et numérique. Prototypage, programmation, médiation et créations artistiques.",
  keywords: ["maker", "développeur", "freelance", "écologie", "numérique", "low-tech", "prototypage", "Bretagne"],
  authors: [{ name: "Quentin Orhant" }],
  creator: "Quentin Orhant",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    title: "Quentin Orhant - Maker et développeur freelance",
    description: "Portfolio de Quentin Orhant, maker et développeur freelance spécialisé dans les projets entre écologie et numérique. Prototypage, programmation, médiation et créations artistiques.",
    siteName: "Quentin Orhant",
    images: [
      {
        url: "/avatar2.png",
        width: 1200,
        height: 630,
        alt: "Quentin Orhant - Maker et développeur freelance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quentin Orhant - Maker et développeur freelance",
    description: "Portfolio de Quentin Orhant, maker et développeur freelance spécialisé dans les projets entre écologie et numérique. Prototypage, programmation, médiation et créations artistiques.",
    images: ["/avatar2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${josefinSans.variable} ${lexend.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Cloudinary for faster image loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#fafaf9" />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
