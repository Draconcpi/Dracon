import type { Metadata } from "next";
import { Inter, Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/i18n";

// Lazy-load heavy 3D background — no SSR needed
const CosmicBackground = dynamic(() => import("@/components/ui/CosmicBackground"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Dracon — Ilustração & Animação Mística",
    template: "%s | Dracon",
  },
  description:
    "Portfólio de ilustração e animação — arte mística, fantasia e mundos arcanos. Criando universos visuais onde magia e imaginação se encontram.",
  keywords: [
    "ilustração",
    "animação",
    "concept art",
    "arte digital",
    "fantasia",
    "magia",
    "portfólio",
    "dracon",
    "arte mística",
  ],
  authors: [{ name: "Dracon" }],
  openGraph: {
    title: "Dracon — Ilustração & Animação Mística",
    description:
      "Portfólio de ilustração e animação — arte mística, fantasia e mundos arcanos.",
    url: "https://dracon.art",
    siteName: "Dracon",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dracon — Ilustração & Animação Mística",
    description: "Arte mística, fantasia e mundos arcanos.",
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
    <html lang="pt-BR" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${inter.variable} ${cinzel.variable} ${cinzelDecorative.variable} antialiased cosmic-bg min-h-screen overflow-x-hidden`}
      >
        <I18nProvider>
          <CosmicBackground />
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
