import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Cabecalho } from "@/components/cabecalho";
import { Rodape } from "@/components/rodape";
import { SuporteOffline } from "@/components/suporte-offline";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Campo de Treino — editais e provas anteriores de concursos militares",
    template: "%s · Campo de Treino",
  },
  description:
    "Acervo gratuito de editais, provas anteriores e gabaritos das seleções militares brasileiras, com a fonte de cada documento.",
  applicationName: "Campo de Treino",
  appleWebApp: { capable: true, title: "Campo de Treino", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#15181a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-grafite-900 focus:px-4 focus:py-2 focus:text-papel"
        >
          Pular para o conteúdo
        </a>
        <SuporteOffline />
        <Cabecalho />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  );
}
