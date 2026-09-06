import dados from "@/data/acervo.json";
import { SELECOES, buscarSelecao } from "@/lib/selecoes";
import { normalizar } from "@/lib/texto";
import type { Acervo, Material, TipoMaterial } from "@/lib/tipos";

/**
 * Acesso ao acervo publicado.
 *
 * No marco 1 a origem é o JSON gerado por `scripts/gerar-acervo.mjs`. As funções
 * abaixo são a única porta de entrada aos dados, para que o marco 2 possa trocar
 * o JSON por Supabase sem mexer nas páginas.
 */
const acervo = dados as Acervo;

export function lote(): string {
  return acervo.lote;
}

export function todosMateriais(): Material[] {
  return acervo.materiais;
}

export function buscarMaterial(id: string): Material | undefined {
  return acervo.materiais.find((m) => m.id === id);
}

export function materiaisDaSelecao(slug: string): Material[] {
  return acervo.materiais.filter((m) => m.selecao === slug);
}

/** Seleções que já têm algum material publicado. */
export function selecoesComAcervo() {
  const comAcervo = new Set(acervo.materiais.map((m) => m.selecao));
  return SELECOES.filter((s) => comAcervo.has(s.slug));
}

export function contarPorSelecao(): Map<string, number> {
  const contagem = new Map<string, number>();
  for (const material of acervo.materiais) {
    contagem.set(material.selecao, (contagem.get(material.selecao) ?? 0) + 1);
  }
  return contagem;
}

// --- consulta do catálogo ---------------------------------------------------

export type Ordenacao = "recentes" | "antigos" | "titulo";

export type Filtros = {
  busca: string;
  selecoes: string[];
  edicoes: string[];
  tipos: TipoMaterial[];
  disciplinas: string[];
  ordenacao: Ordenacao;
  pagina: number;
};

export const FILTROS_VAZIOS: Filtros = {
  busca: "",
  selecoes: [],
  edicoes: [],
  tipos: [],
  disciplinas: [],
  ordenacao: "recentes",
  pagina: 1,
};

export const POR_PAGINA = 12;

/** Primeiro ano citado na edição, usado para ordenar "2026-2027" junto de "2026". */
function anoDaEdicao(edicao: string): number {
  const m = edicao.match(/\d{4}/);
  return m ? Number(m[0]) : 0;
}

/** Texto em que a busca procura: título, seleção, edição, disciplina e fase. */
function textoDeBusca(material: Material): string {
  const selecao = buscarSelecao(material.selecao);
  return normalizar(
    [
      material.titulo,
      material.edicao,
      material.fase,
      material.caderno,
      ...material.disciplinas,
      selecao?.sigla,
      selecao?.nome,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function aplicarFiltros(materiais: Material[], filtros: Filtros): Material[] {
  const termo = normalizar(filtros.busca);
  const termos = termo.split(/\s+/).filter(Boolean);

  const filtrados = materiais.filter((material) => {
    if (filtros.selecoes.length && !filtros.selecoes.includes(material.selecao)) return false;
    if (filtros.edicoes.length && !filtros.edicoes.includes(material.edicao)) return false;
    if (filtros.tipos.length && !filtros.tipos.includes(material.tipo)) return false;
    if (
      filtros.disciplinas.length &&
      !material.disciplinas.some((d) => filtros.disciplinas.includes(d))
    ) {
      return false;
    }
    if (termos.length) {
      const texto = textoDeBusca(material);
      if (!termos.every((t) => texto.includes(t))) return false;
    }
    return true;
  });

  const ordenado = [...filtrados];
  if (filtros.ordenacao === "titulo") {
    ordenado.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
  } else {
    const direcao = filtros.ordenacao === "antigos" ? -1 : 1;
    ordenado.sort(
      (a, b) =>
        direcao * (anoDaEdicao(b.edicao) - anoDaEdicao(a.edicao)) ||
        a.titulo.localeCompare(b.titulo, "pt-BR"),
    );
  }
  return ordenado;
}

export type Pagina<T> = {
  itens: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
};

export function paginar<T>(itens: T[], pagina: number, porPagina = POR_PAGINA): Pagina<T> {
  const totalPaginas = Math.max(1, Math.ceil(itens.length / porPagina));
  const atual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (atual - 1) * porPagina;
  return {
    itens: itens.slice(inicio, inicio + porPagina),
    total: itens.length,
    pagina: atual,
    totalPaginas,
  };
}

/** Opções disponíveis nos filtros, calculadas a partir do que está publicado. */
export function opcoesDeFiltro(materiais: Material[] = acervo.materiais) {
  const edicoes = [...new Set(materiais.map((m) => m.edicao))].sort((a, b) =>
    b.localeCompare(a),
  );
  const tipos = [...new Set(materiais.map((m) => m.tipo))] as TipoMaterial[];
  const disciplinas = [...new Set(materiais.flatMap((m) => m.disciplinas))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  return { edicoes, tipos, disciplinas };
}

/** Gabarito ligado a uma prova, quando existe no acervo. */
export function gabaritoDe(material: Material): Material | undefined {
  return material.gabaritoId ? buscarMaterial(material.gabaritoId) : undefined;
}

/** Provas respondidas por um gabarito. */
export function provasDe(material: Material): Material[] {
  return material.provasIds
    .map((id) => buscarMaterial(id))
    .filter((m): m is Material => Boolean(m));
}

/**
 * Outros documentos da mesma seleção e edição, para navegar sem voltar ao
 * filtro. Deixa de fora o que já aparece na seção de prova/gabarito da página.
 */
export function relacionados(material: Material, limite = 6): Material[] {
  const jaExibidos = new Set([
    material.id,
    ...(material.gabaritoId ? [material.gabaritoId] : []),
    ...material.provasIds,
  ]);
  return acervo.materiais
    .filter(
      (m) =>
        !jaExibidos.has(m.id) &&
        m.selecao === material.selecao &&
        m.edicao === material.edicao,
    )
    .slice(0, limite);
}
