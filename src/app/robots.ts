import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin ainda não existe; a regra já reserva a área de curadoria.
      disallow: ["/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
