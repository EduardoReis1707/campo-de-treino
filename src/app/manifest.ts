import type { MetadataRoute } from "next";

/**
 * Manifesto do PWA. O site é instalável; isso não equivale a um aplicativo de
 * loja, e o acervo não fica disponível offline por inteiro.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Campo de Treino — editais e provas anteriores",
    short_name: "Campo de Treino",
    description:
      "Acervo gratuito de editais, provas anteriores e gabaritos das seleções militares brasileiras.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "pt-BR",
    background_color: "#f6f5f2",
    theme_color: "#15181a",
    categories: ["education", "books"],
    icons: [
      { src: "/icone.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icone-mascara.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Acervo", url: "/acervo" },
      { name: "Seleções", url: "/selecoes" },
    ],
  };
}
