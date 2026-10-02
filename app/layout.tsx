import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Rubik_Mono_One, Space_Mono } from "next/font/google";
import { CalmProvider } from "@/components/CalmProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { calmBootScript } from "@/lib/calm";
import "./globals.css";
import "./pages.css";

const display = Rubik_Mono_One({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-display", display: "swap" });
const serif = Playfair_Display({ weight: "900", style: "italic", subsets: ["latin", "latin-ext"], variable: "--font-serif", display: "swap" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--font-mono", display: "swap" });
const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Loud House: contemporary art, at volume", template: "%s · Loud House" },
  description: "Loud House is a contemporary art gallery in east London. This summer: MORE, thirty artists in six rooms, 20 June – 27 September 2027.",
  metadataBase: new URL("https://loudhouse.example"),
  openGraph: { siteName: "Loud House", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning className={`${display.variable} ${serif.variable} ${mono.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: calmBootScript }} />
      </head>
      <body>
        <CalmProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <PageTransition />
        </CalmProvider>
      </body>
    </html>
  );
}
