/** Remove acentos e caixa para que a busca tolere "fisica", "Física" e "FÍSICA". */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

const ROTULOS_TIPO = {
  edital: "Edital",
  prova: "Prova",
  gabarito: "Gabarito",
  prova_e_gabarito: "Prova com gabarito",
  informacao: "Informação",
} as const;

export function rotuloTipo(tipo: keyof typeof ROTULOS_TIPO): string {
  return ROTULOS_TIPO[tipo];
}

const ROTULOS_SITUACAO = {
  hospedagem_conferida: "Arquivo conferido e disponível aqui",
  somente_referencia: "Disponível na fonte de origem",
  a_confirmar: "Permissão de uso a confirmar",
} as const;

export function rotuloSituacao(situacao: keyof typeof ROTULOS_SITUACAO): string {
  return ROTULOS_SITUACAO[situacao];
}

/** Formata bytes para leitura humana; devolve null quando o tamanho é desconhecido. */
export function formatarTamanho(bytes: number | null): string | null {
  if (bytes === null || bytes <= 0) return null;
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** "2026-2027" vira "2026/2027"; um ano isolado fica como está. */
export function rotuloEdicao(edicao: string): string {
  return edicao.replace("-", "/");
}
