import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/constants";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Zumbii — Empowering Businesses, Connecting Communities, Growing Together.",
  description: "India's premier B2B & B2C marketplace. Shop wholesale, connect with suppliers, explore franchise opportunities, and grow your business with Zumbii.",
  keywords: ["Zumbii", "eCommerce", "B2B", "B2C", "marketplace", "India", "wholesale", "franchise", "business"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zumbii — India's Trusted Business Marketplace",
    description: "Empowering Businesses, Connecting Communities, Growing Together.",
    url: siteConfig.url,
    siteName: "Zumbii",
    type: "website",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Zumbii — India's Trusted Business Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zumbii — India's Trusted Business Marketplace",
    description: "Empowering Businesses, Connecting Communities, Growing Together.",
    images: ["/images/og-banner.png"],
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: `${siteConfig.url}/images/zumbii-logo-header-wide.png`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
