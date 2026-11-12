import type { Metadata } from "next";
import { Jost, Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/i18n";
import { getContentOverrides, getSeoSettings } from "@/lib/content";

// Lazy-load heavy 3D background — no SSR needed
const CosmicBackground = dynamic(() => import("@/components/ui/CosmicBackground"), {
  ssr: false,
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600"],
  display: "swap",
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

const DEFAULT_TITLE = "Dracon — Ilustração & Animação Mística";
const DEFAULT_DESCRIPTION =
  "Portfólio de ilustração e animação — arte mística, fantasia e mundos arcanos. Criando universos visuais onde magia e imaginação se encontram.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const title = seo.title || DEFAULT_TITLE;
  const description = seo.description || DEFAULT_DESCRIPTION;

  return {
    title: {
      default: title,
      template: "%s | Dracon",
    },
    description,
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
      title,
      description,
      url: "https://dracon.art",
      siteName: "Dracon",
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const overrides = await getContentOverrides();

  return (
    <html lang="pt-BR" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${jost.variable} ${cinzel.variable} ${cinzelDecorative.variable} antialiased cosmic-bg min-h-screen overflow-x-hidden`}
      >
        <I18nProvider overrides={overrides}>
          <CosmicBackground />
          <Navbar />
          <main id="conteudo" className="relative z-10">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
