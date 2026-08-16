import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Zumbii — Empowering Businesses, Connecting Communities, Growing Together.",
  description: "India's premier B2B & B2C marketplace. Shop wholesale, connect with suppliers, explore franchise opportunities, and grow your business with Zumbii.",
  keywords: ["Zumbii", "eCommerce", "B2B", "B2C", "marketplace", "India", "wholesale", "franchise", "business"],
  openGraph: {
    title: "Zumbii — India's Trusted Business Marketplace",
    description: "Empowering Businesses, Connecting Communities, Growing Together.",
    url: "https://zumbii.com",
    siteName: "Zumbii",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zumbii — India's Trusted Business Marketplace",
    description: "Empowering Businesses, Connecting Communities, Growing Together.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
