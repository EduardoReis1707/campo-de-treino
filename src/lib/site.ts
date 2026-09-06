/**
 * Endereço público do site, usado no sitemap e no robots.
 * Defina NEXT_PUBLIC_SITE_URL no ambiente de produção.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
