/**
 * Tipos do domínio do acervo.
 *
 * Estes tipos são a fronteira entre os dados e a apresentação. O marco 1 lê os
 * dados de um arquivo JSON gerado por `scripts/gerar-acervo.mjs`; o marco 2
 * troca a origem por Supabase mantendo estes mesmos tipos.
 */

/** Agrupamentos usados na navegação. Uma seleção pode pertencer a mais de um. */
export type Forca =
  | "Exército"
  | "Marinha"
  | "Aeronáutica"
  | "Marinha Mercante"
  | "Engenharia";

/** Momento da trajetória escolar em que se ingressa na seleção. */
export type GrupoEscolar = "ensino-medio" | "pos-ensino-medio";

export type TipoMaterial =
  | "edital"
  | "prova"
  | "gabarito"
  | "prova_e_gabarito"
  | "informacao";

/**
 * Situação de uso conferida na curadoria. Determina se o arquivo pode ser
 * hospedado pela plataforma ou se apenas a origem é referenciada.
 */
export type SituacaoUso =
  /** Documento de fonte oficial, conferido, com cópia hospedada aqui. */
  | "hospedagem_conferida"
  /** Cópia de terceiros: a plataforma indica a origem e não hospeda o arquivo. */
  | "somente_referencia"
  /** Origem localizada, permissão de republicação ainda não verificada. */
  | "a_confirmar";

export type Fonte = {
  /** URL do arquivo original. */
  url: string;
  /** Página em que o arquivo foi encontrado, quando diferente da URL. */
  pagina: string;
  /** Rótulo da origem, ex.: "vestibular.ita.br" ou "cópia pública — Unipre". */
  rotulo: string;
  oficial: boolean;
};

export type Selecao = {
  slug: string;
  sigla: string;
  nome: string;
  forcas: Forca[];
  grupo: GrupoEscolar;
  /** Uma linha sobre o que é a seleção. */
  resumo: string;
  /** Escolaridade exigida; "A confirmar no edital" quando não verificada. */
  escolaridadeExigida: string;
  /** Formação oferecida; "A confirmar no edital" quando não verificada. */
  formacaoOferecida: string;
  siteOficial: string;
  /** Ressalvas de curadoria exibidas na página da seleção. */
  observacoes: string[];
};

export type Material = {
  id: string;
  selecao: string;
  titulo: string;
  tipo: TipoMaterial;
  /** Identificação da edição conforme a fonte, ex.: "2025" ou "2026-2027". */
  edicao: string;
  /** Ano de aplicação, quando distinguível da edição. */
  anoAplicacao: number | null;
  /** Ano de ingresso, quando distinguível da edição. */
  anoIngresso: number | null;
  /** Fase da seleção, ex.: "1ª fase", "CFS 1". Nulo quando não se aplica. */
  fase: string | null;
  /** Versão/caderno da prova, ex.: "Código 02". Nulo quando não se aplica. */
  caderno: string | null;
  disciplinas: string[];
  paginas: number | null;
  bytes: number | null;
  sha256: string | null;
  situacaoUso: SituacaoUso;
  /** Caminho público do PDF hospedado; nulo quando só há referência à origem. */
  arquivo: string | null;
  fonte: Fonte;
  /** Data em que a curadoria conferiu o item (ISO 8601). */
  dataConferencia: string;
  /** Id do gabarito correspondente, quando existe no acervo. */
  gabaritoId: string | null;
  /** Ids das provas que este gabarito responde. */
  provasIds: string[];
  /** Ressalvas específicas deste documento. */
  notas: string[];
};

export type Acervo = {
  geradoEm: string;
  /** Descrição do lote publicado, exibida nos avisos de curadoria. */
  lote: string;
  materiais: Material[];
};
