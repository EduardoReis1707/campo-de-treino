import type { Brasao, Forca, GrupoEscolar, Selecao } from "@/lib/tipos";

/**
 * Brasões obtidos no Wikimedia Commons em 07/09/2026 — todos em domínio público
 * ou sob licença Creative Commons compatível com reuso. Duas seleções (EN e
 * EAM) ficam sem brasão: não achamos uma insígnia própria e bem licenciada
 * para nenhuma das duas — ver commit que introduziu este arquivo.
 */
const BRASAO_CIAGA: Brasao = {
  arquivo: "/insignias/efomm.png",
  credito: "Arthurmalheiros / Wikimedia Commons, domínio público",
  fonte: "https://commons.wikimedia.org/wiki/File:Bras%C3%A3o_do_CIAGA.png",
};

/**
 * Metadados curados das seleções.
 *
 * Regra de curadoria: só entra aqui o que foi conferido. Campos não verificados
 * ficam com "A confirmar no edital da edição" em vez de uma suposição — a
 * plataforma não substitui a leitura do edital.
 *
 * `siteOficial` vazio significa que o endereço institucional ainda não foi
 * conferido por esta curadoria; a interface exibe "A confirmar".
 */
export const SELECOES: Selecao[] = [
  {
    slug: "ita",
    sigla: "ITA",
    nome: "Instituto Tecnológico de Aeronáutica",
    forcas: ["Aeronáutica", "Engenharia"],
    grupo: "pos-ensino-medio",
    resumo:
      "Instituto de ensino superior ligado à Força Aérea Brasileira, em São José dos Campos, com cursos de engenharia.",
    escolaridadeExigida: "Ensino médio concluído ou em conclusão, conforme o edital da edição.",
    formacaoOferecida: "Cursos de graduação em engenharia.",
    siteOficial: "https://vestibular.ita.br",
    observacoes: [
      "A prova é dividida em fases; a 2ª fase tem provas por disciplina e redação.",
    ],
    brasao: {
      arquivo: "/insignias/ita.svg",
      credito: "Macucal / Wikimedia Commons, CC BY-SA 4.0",
      fonte:
        "https://commons.wikimedia.org/wiki/File:Escudo_de_Instituto_Tecnol%C3%B3gico_de_Aeron%C3%A1utica.svg",
    },
  },
  {
    slug: "ime",
    sigla: "IME",
    nome: "Instituto Militar de Engenharia",
    forcas: ["Exército", "Engenharia"],
    grupo: "pos-ensino-medio",
    resumo:
      "Instituto de ensino superior do Exército Brasileiro, no Rio de Janeiro, com cursos de engenharia.",
    escolaridadeExigida: "Ensino médio concluído ou em conclusão, conforme o edital da edição.",
    formacaoOferecida: "Cursos de graduação em engenharia.",
    siteOficial: "https://vestibular.ime.eb.br",
    observacoes: [
      "Há modalidades distintas de ingresso; confira no edital da edição qual se aplica ao seu caso.",
    ],
    brasao: {
      arquivo: "/insignias/ime.svg",
      credito: "Wikimedia Commons, CC BY-SA 4.0",
      fonte:
        "https://commons.wikimedia.org/wiki/File:Escudo_de_Instituto_Militar_de_Engenharia.svg",
    },
  },
  {
    slug: "en",
    sigla: "EN",
    nome: "Escola Naval",
    forcas: ["Marinha"],
    grupo: "pos-ensino-medio",
    resumo:
      "Escola de formação de oficiais da Marinha do Brasil, no Rio de Janeiro. O ingresso ocorre pelo concurso CPAEN.",
    escolaridadeExigida: "Ensino médio concluído ou em conclusão, conforme o edital da edição.",
    formacaoOferecida: "A confirmar no edital da edição.",
    siteOficial: "https://www.marinha.mil.br/ensino/",
    observacoes: [
      "Corpos e quadros oferecidos variam por edição; verifique o edital.",
    ],
    brasao: null,
  },
  {
    slug: "efomm",
    sigla: "EFOMM",
    nome: "Escola de Formação de Oficiais da Marinha Mercante",
    forcas: ["Marinha Mercante"],
    grupo: "pos-ensino-medio",
    resumo:
      "Formação para a Marinha Mercante, conduzida pelo CIAGA e pelo CIABA. Não é carreira militar da Marinha do Brasil.",
    escolaridadeExigida: "Ensino médio concluído ou em conclusão, conforme o edital da edição.",
    formacaoOferecida: "Formação de oficiais da Marinha Mercante.",
    siteOficial: "https://www.marinha.mil.br/ciaga/aefomm",
    observacoes: [
      "A EFOMM forma para a Marinha Mercante; não confunda com a Escola Naval.",
      "O brasão exibido é do CIAGA, o centro de instrução da Marinha que administra a EFOMM; não localizamos um distintivo próprio dela.",
    ],
    brasao: BRASAO_CIAGA,
  },
  {
    slug: "afa",
    sigla: "AFA",
    nome: "Academia da Força Aérea",
    forcas: ["Aeronáutica"],
    grupo: "pos-ensino-medio",
    resumo:
      "Escola de formação de oficiais da Força Aérea Brasileira, em Pirassununga.",
    escolaridadeExigida: "Ensino médio concluído ou em conclusão, conforme o edital da edição.",
    formacaoOferecida: "A confirmar no edital da edição.",
    siteOficial: "https://www2.fab.mil.br/afa/",
    observacoes: [
      "Quadros oferecidos variam por edição; verifique o edital.",
    ],
    brasao: {
      arquivo: "/insignias/afa.gif",
      credito: "Força Aérea Brasileira, domínio público",
      fonte: "https://commons.wikimedia.org/wiki/File:Academia_da_For%C3%A7a_A%C3%A9rea.gif",
    },
  },
  {
    slug: "espcex",
    sigla: "EsPCEx",
    nome: "Escola Preparatória de Cadetes do Exército",
    forcas: ["Exército"],
    grupo: "pos-ensino-medio",
    resumo:
      "Escola do Exército Brasileiro, em Campinas, que antecede a formação de oficiais na AMAN.",
    escolaridadeExigida: "Ensino médio concluído ou em conclusão, conforme o edital da edição.",
    formacaoOferecida: "A confirmar no edital da edição.",
    siteOficial: "https://www.espcex.eb.mil.br",
    observacoes: [],
    brasao: {
      arquivo: "/insignias/espcex.png",
      credito: "Rosefigdo / Wikimedia Commons, CC BY-SA 3.0",
      fonte: "https://commons.wikimedia.org/wiki/File:EsPCEx_7.png",
    },
  },
  {
    slug: "esa",
    sigla: "ESA",
    nome: "Escola de Sargentos das Armas",
    forcas: ["Exército"],
    grupo: "pos-ensino-medio",
    resumo: "Escola do Exército Brasileiro voltada à formação de sargentos de carreira.",
    escolaridadeExigida: "A confirmar no edital da edição.",
    formacaoOferecida: "A confirmar no edital da edição.",
    siteOficial: "https://www.esa.eb.mil.br",
    observacoes: [],
    brasao: {
      arquivo: "/insignias/esa.svg",
      credito: "Wikimedia Commons, CC0",
      fonte:
        "https://commons.wikimedia.org/wiki/File:Distintivo_da_Escola_de_Sargentos_das_Armas_-_ESA.svg",
    },
  },
  {
    slug: "eear",
    sigla: "EEAR",
    nome: "Escola de Especialistas de Aeronáutica",
    forcas: ["Aeronáutica"],
    grupo: "pos-ensino-medio",
    resumo:
      "Escola da Força Aérea Brasileira, em Guaratinguetá, responsável pelo Curso de Formação de Sargentos (CFS).",
    escolaridadeExigida: "A confirmar no edital da edição.",
    formacaoOferecida: "Curso de Formação de Sargentos (CFS).",
    siteOficial: "https://www2.fab.mil.br/eear/",
    observacoes: [
      "As provas costumam ter mais de uma incorporação por ano (CFS 1 e CFS 2) e vários cadernos por código.",
    ],
    brasao: {
      arquivo: "/insignias/eear.png",
      credito: "Força Aérea Brasileira, domínio público",
      fonte: "https://commons.wikimedia.org/wiki/File:COA_EEAR.png",
    },
  },
  {
    slug: "eam",
    sigla: "EAM",
    nome: "Escola de Aprendizes-Marinheiros",
    forcas: ["Marinha"],
    grupo: "pos-ensino-medio",
    resumo: "Escolas da Marinha do Brasil voltadas à formação de praças.",
    escolaridadeExigida: "A confirmar no edital da edição.",
    formacaoOferecida: "A confirmar no edital da edição.",
    siteOficial: "https://www.marinha.mil.br/ensino/",
    observacoes: [],
    brasao: null,
  },
  {
    slug: "cn",
    sigla: "CN",
    nome: "Colégio Naval",
    forcas: ["Marinha"],
    grupo: "ensino-medio",
    resumo:
      "Colégio da Marinha do Brasil, em Angra dos Reis, com ensino médio militar. O ingresso ocorre pelo concurso CPACN.",
    escolaridadeExigida:
      "Ingresso após o 9º ano do ensino fundamental, conforme o edital da edição.",
    formacaoOferecida: "Ensino médio militar.",
    siteOficial: "https://www.marinha.mil.br/ensino/",
    observacoes: [],
    brasao: {
      arquivo: "/insignias/cn.png",
      credito: "Marinha do Brasil, domínio público",
      fonte: "https://commons.wikimedia.org/wiki/File:Bras%C3%A3o_do_Col%C3%A9gio_Naval.png",
    },
  },
  {
    slug: "epcar",
    sigla: "EPCAR",
    nome: "Escola Preparatória de Cadetes do Ar",
    forcas: ["Aeronáutica"],
    grupo: "ensino-medio",
    resumo:
      "Escola da Força Aérea Brasileira, em Barbacena, com ensino médio militar que antecede a Academia da Força Aérea.",
    escolaridadeExigida:
      "Ingresso após o 9º ano do ensino fundamental, conforme o edital da edição.",
    formacaoOferecida: "Ensino médio militar.",
    siteOficial: "https://www2.fab.mil.br/epcar/",
    observacoes: [],
    brasao: {
      arquivo: "/insignias/epcar.svg",
      credito: "Força Aérea Brasileira / Wikimedia Commons, CC BY 4.0",
      fonte: "https://commons.wikimedia.org/wiki/File:Escudo_de_EPCAR.svg",
    },
  },
];

/** Painéis de navegação da landing page. Uma seleção pode aparecer em mais de um. */
export const FORCAS: { forca: Forca; descricao: string }[] = [
  {
    forca: "Exército",
    descricao: "Seleções ligadas ao Exército Brasileiro.",
  },
  {
    forca: "Marinha",
    descricao: "Seleções ligadas à Marinha do Brasil.",
  },
  {
    forca: "Aeronáutica",
    descricao: "Seleções ligadas à Força Aérea Brasileira.",
  },
  {
    forca: "Engenharia",
    descricao: "Institutos de engenharia com vestibular próprio.",
  },
  {
    forca: "Marinha Mercante",
    descricao: "Formação civil para a navegação comercial.",
  },
];

export const GRUPOS: { grupo: GrupoEscolar; rotulo: string; descricao: string }[] = [
  {
    grupo: "ensino-medio",
    rotulo: "Ingresso no ensino médio militar",
    descricao: "Para quem está concluindo o ensino fundamental.",
  },
  {
    grupo: "pos-ensino-medio",
    rotulo: "Ingresso após o ensino médio",
    descricao: "Para quem está concluindo ou já concluiu o ensino médio.",
  },
];

const porSlug = new Map(SELECOES.map((s) => [s.slug, s]));

export function buscarSelecao(slug: string): Selecao | undefined {
  return porSlug.get(slug);
}

export function selecoesDaForca(forca: Forca): Selecao[] {
  return SELECOES.filter((s) => s.forcas.includes(forca));
}
