import { FILTROS_VAZIOS, type Filtros, type Ordenacao } from "@/lib/acervo";
import type { TipoMaterial } from "@/lib/tipos";

/** Nomes dos parâmetros na URL. A URL é o estado do catálogo — dá para compartilhar. */
export const PARAMS = {
  busca: "q",
  selecao: "selecao",
  edicao: "edicao",
  tipo: "tipo",
  disciplina: "disciplina",
  ordem: "ordem",
  pagina: "pagina",
} as const;

export type ParamsBrutos = Record<string, string | string[] | undefined>;

function lista(valor: string | string[] | undefined): string[] {
  if (!valor) return [];
  return Array.isArray(valor) ? valor : [valor];
}

const ORDENACOES: Ordenacao[] = ["recentes", "antigos", "titulo"];

export function lerFiltros(params: ParamsBrutos): Filtros {
  const ordem = params[PARAMS.ordem];
  const busca = params[PARAMS.busca];
  const pagina = Number(params[PARAMS.pagina]);
  return {
    ...FILTROS_VAZIOS,
    busca: typeof busca === "string" ? busca : "",
    selecoes: lista(params[PARAMS.selecao]),
    edicoes: lista(params[PARAMS.edicao]),
    tipos: lista(params[PARAMS.tipo]) as TipoMaterial[],
    disciplinas: lista(params[PARAMS.disciplina]),
    ordenacao:
      typeof ordem === "string" && ORDENACOES.includes(ordem as Ordenacao)
        ? (ordem as Ordenacao)
        : "recentes",
    pagina: Number.isFinite(pagina) && pagina > 0 ? Math.trunc(pagina) : 1,
  };
}

/** Monta a URL do catálogo preservando os filtros ativos. */
export function urlDoAcervo(filtros: Filtros, sobrescrever: Partial<Filtros> = {}): string {
  const f = { ...filtros, ...sobrescrever };
  const busca = new URLSearchParams();
  if (f.busca.trim()) busca.set(PARAMS.busca, f.busca.trim());
  f.selecoes.forEach((v) => busca.append(PARAMS.selecao, v));
  f.edicoes.forEach((v) => busca.append(PARAMS.edicao, v));
  f.tipos.forEach((v) => busca.append(PARAMS.tipo, v));
  f.disciplinas.forEach((v) => busca.append(PARAMS.disciplina, v));
  if (f.ordenacao !== "recentes") busca.set(PARAMS.ordem, f.ordenacao);
  if (f.pagina > 1) busca.set(PARAMS.pagina, String(f.pagina));
  const texto = busca.toString();
  return texto ? `/acervo?${texto}` : "/acervo";
}

export function temFiltroAtivo(filtros: Filtros): boolean {
  return Boolean(
    filtros.busca.trim() ||
      filtros.selecoes.length ||
      filtros.edicoes.length ||
      filtros.tipos.length ||
      filtros.disciplinas.length,
  );
}
