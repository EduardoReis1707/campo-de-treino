import type { MetadataRoute } from "next";
import { todosMateriais } from "@/lib/acervo";
import { SELECOES } from "@/lib/selecoes";
import { SITE_URL } from "@/lib/site";

/** Páginas públicas para indexação. A área de curadoria fica fora. */
export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ["", "/acervo", "/selecoes", "/sobre"].map((rota) => ({
    url: `${SITE_URL}${rota}`,
    changeFrequency: "weekly" as const,
    priority: rota === "" ? 1 : 0.8,
  }));

  const selecoes = SELECOES.map((s) => ({
    url: `${SITE_URL}/selecoes/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const materiais = todosMateriais().map((m) => ({
    url: `${SITE_URL}/material/${m.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...fixas, ...selecoes, ...materiais];
}
