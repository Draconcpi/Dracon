import type { Metadata } from "next";
import { Inter, Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StarField from "@/components/ui/StarField";
import CosmicDust from "@/components/ui/CosmicDust";

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
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.variable} ${cinzel.variable} ${cinzelDecorative.variable} antialiased cosmic-bg min-h-screen`}
      >
        <StarField count={180} />
        <CosmicDust count={40} />
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
