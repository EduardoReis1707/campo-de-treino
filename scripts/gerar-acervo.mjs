/**
 * Gera o acervo publicado do lote piloto a partir de Catalogo_e_fontes.json.
 *
 *   node scripts/gerar-acervo.mjs
 *
 * O script NÃO publica o acervo inteiro. Ele lê o `LOTE` declarado abaixo —
 * a lista conferida pela curadoria — e produz:
 *
 *   src/data/acervo.json   metadados dos materiais publicados
 *   public/acervo/...      cópias dos PDFs cuja hospedagem foi conferida
 *
 * Para publicar mais material, acrescente entradas em `LOTE` e rode de novo.
 * `hospedar: true` copia o PDF para public/acervo e ele passa a abrir aqui.
 * A situação de uso registrada depende da fonte, não da decisão de hospedar:
 *   - fonte oficial          → "hospedagem_conferida" (verificada)
 *   - cópia de terceiros     → "a_confirmar" (hospedada, permissão pendente)
 *   - hospedar: false        → "somente_referencia" (só o link até a origem)
 * O responsável pelo produto decide, entrada por entrada, se aceita o risco
 * de hospedar uma cópia sem permissão confirmada; a etiqueta na página nunca
 * chama isso de "conferido".
 */
import fs from "node:fs";
import path from "node:path";

// O Next carrega o .env sozinho; este script roda no node puro, então lê à mão.
try {
  process.loadEnvFile();
} catch {
  // Sem .env o script segue com o caminho padrão abaixo.
}

const ACERVO_ORIGEM =
  process.env.ACERVO_ORIGEM ||
  "C:/Users/Leticia Lima/Documents/Codex/2026-09-06/ol/outputs/Campo de Treino";

const RAIZ = path.resolve(import.meta.dirname, "..");
const DESTINO_DADOS = path.join(RAIZ, "src", "data", "acervo.json");
const DESTINO_ARQUIVOS = path.join(RAIZ, "public", "acervo");

/** Data em que a curadoria conferiu este lote. */
const DATA_CONFERENCIA = "2026-09-06";

const DESCRICAO_LOTE =
  "Lote piloto conferido em 06/09/2026. O acervo completo ainda está em curadoria.";

/**
 * Lote publicado. Cada entrada é uma pasta `selecao/categoria/ano` do acervo.
 *
 * `hospedar: true` copia o PDF, seja a fonte oficial ou uma cópia de
 * terceiros — a decisão de aceitar o risco de hospedar cópia sem permissão
 * confirmada foi tomada pelo responsável pelo produto em 06/09/2026.
 */
const LOTE = [
  // ITA — fonte oficial vestibular.ita.br, conferida por amostragem.
  { selecao: "ITA", categoria: "Editais", ano: "2027", hospedar: true },
  { selecao: "ITA", categoria: "Informacoes", ano: "2027", hospedar: true },
  { selecao: "ITA", categoria: "Provas", ano: "2024", hospedar: true },
  { selecao: "ITA", categoria: "Provas", ano: "2025", hospedar: true },
  { selecao: "ITA", categoria: "Gabaritos", ano: "2024", hospedar: true },
  { selecao: "ITA", categoria: "Gabaritos", ano: "2025", hospedar: true },

  // EEAR — fonte oficial FAB, conferida por amostragem.
  { selecao: "EEAR", categoria: "Provas_e_gabaritos", ano: "2024", hospedar: true },
  { selecao: "EEAR", categoria: "Editais", ano: "2026-2027", hospedar: true },

  // AFA — edital oficial; provas e gabaritos são cópias de terceiros (Específico).
  { selecao: "AFA", categoria: "Editais", ano: "2027", hospedar: true },
  { selecao: "AFA", categoria: "Provas", ano: "2024", hospedar: true },
  { selecao: "AFA", categoria: "Provas", ano: "2025", hospedar: true },
  { selecao: "AFA", categoria: "Gabaritos", ano: "2024", hospedar: true },
  { selecao: "AFA", categoria: "Gabaritos", ano: "2025", hospedar: true },

  // EsPCEx, EPCAR, CN e EN — cópias de terceiros (Unipre, SEYP, Madematica).
  { selecao: "EsPCEx", categoria: "Editais", ano: "2026-2027", hospedar: true },
  { selecao: "EsPCEx", categoria: "Provas", ano: "2024", hospedar: true },
  { selecao: "EsPCEx", categoria: "Gabaritos", ano: "2024", hospedar: true },
  { selecao: "EPCAR", categoria: "Editais", ano: "2026-2027", hospedar: true },
  { selecao: "EPCAR", categoria: "Provas", ano: "2024", hospedar: true },
  { selecao: "EPCAR", categoria: "Gabaritos", ano: "2024", hospedar: true },
  { selecao: "CN", categoria: "Editais", ano: "2026", hospedar: true },
  { selecao: "CN", categoria: "Provas", ano: "2024", hospedar: true },
  { selecao: "EN", categoria: "Editais", ano: "2026", hospedar: true },

  // EFOMM — cópia de terceiros (Unipre); edital vigente e as duas edições mais
  // recentes. A fonte ainda não tem gabarito de 2025, só das provas.
  { selecao: "EFOMM", categoria: "Editais", ano: "2026-2027", hospedar: true },
  { selecao: "EFOMM", categoria: "Provas", ano: "2025", hospedar: true },
  { selecao: "EFOMM", categoria: "Provas", ano: "2024", hospedar: true },
  { selecao: "EFOMM", categoria: "Gabaritos", ano: "2024", hospedar: true },

  // ESA — cópia de terceiros (Unipre); edital vigente e as duas edições mais
  // recentes que têm prova e gabarito parelhos (a prova de 2026 já existe na
  // fonte, mas ainda sem gabarito publicado).
  { selecao: "ESA", categoria: "Editais", ano: "2026-2027", hospedar: true },
  { selecao: "ESA", categoria: "Provas", ano: "2025", hospedar: true },
  { selecao: "ESA", categoria: "Provas", ano: "2024", hospedar: true },
  { selecao: "ESA", categoria: "Gabaritos", ano: "2025", hospedar: true },
  { selecao: "ESA", categoria: "Gabaritos", ano: "2024", hospedar: true },

  // EAM — cópia de terceiros (SEYP). Não há gabarito na fonte para nenhuma
  // edição; publicamos só as provas.
  { selecao: "EAM", categoria: "Editais", ano: "2026", hospedar: true },
  { selecao: "EAM", categoria: "Provas", ano: "2026", hospedar: true },
  { selecao: "EAM", categoria: "Provas", ano: "2025", hospedar: true },

  // IME — cópia de terceiros (Madematica); edital vigente, o caderno combinado
  // de provas e gabarito de 2026 e as provas de Matemática (única disciplina
  // disponível na fonte) das duas edições mais recentes.
  { selecao: "IME", categoria: "Editais", ano: "2026-2027", hospedar: true },
  { selecao: "IME", categoria: "Provas_e_gabaritos", ano: "2026", hospedar: true },
  { selecao: "IME", categoria: "Provas_por_disciplina", ano: "2025-2026", hospedar: true },
  { selecao: "IME", categoria: "Provas_por_disciplina", ano: "2024-2025", hospedar: true },
];

/**
 * Correções e ressalvas anotadas na conferência, por caminho no acervo.
 * Sobrescrevem o que as regras automáticas derivam do nome do arquivo.
 * Uma chave terminada em barra vale para todos os arquivos daquela pasta.
 */
const CURADORIA = {
  "ITA/Gabaritos/2025/gabarito_2025_2f.pdf": {
    disciplinas: ["Português"],
    titulo: "Gabarito da 2ª fase (Português) — vestibular 2025",
    notas: [
      "O arquivo publicado pelo ITA traz apenas o gabarito da parte objetiva de Português da 2ª fase.",
    ],
  },
  "ITA/Gabaritos/2024/gabarito_2024.pdf": {
    notas: ["Confere as questões objetivas da 1ª fase."],
  },
  "EEAR/Provas_e_gabaritos/2024/": {
    notas: [
      "A pasta de origem reúne provas e gabaritos; nesta edição só as provas foram localizadas.",
    ],
  },
  "CN/Provas/2024/2024colegio-naval-portugues-estudos-sociais-ciencias.pdf": {
    disciplinas: ["Português", "Estudos Sociais", "Ciências"],
    titulo: "Prova de Português, Estudos Sociais e Ciências — Colégio Naval 2024",
  },
  "IME/Provas_e_gabaritos/2026/2026-1-IME-PROVAS-VESTIBULAR-1a-FASE-COM-GABARITOS.pdf": {
    notas: ["Este arquivo reúne as provas e o gabarito da 1ª fase no mesmo PDF."],
  },
};

const SIGLA_PARA_SLUG = {
  ITA: "ita",
  IME: "ime",
  EN: "en",
  EFOMM: "efomm",
  AFA: "afa",
  EsPCEx: "espcex",
  ESA: "esa",
  EEAR: "eear",
  EAM: "eam",
  CN: "cn",
  EPCAR: "epcar",
};

/** Nome por extenso usado nos títulos gerados automaticamente. */
const NOME_SELECAO = {
  EN: "Escola Naval",
  EAM: "Escola de Aprendizes-Marinheiros",
  EFOMM: "EFOMM",
  ESA: "ESA",
  IME: "IME",
};

const ROTULO_FONTE = {
  copia_publica: "Cópia pública",
  copia_publica_Madematica: "Cópia pública — Madematica",
  copia_publica_Unipre: "Cópia pública — Unipre",
  copia_publica_SEYP: "Cópia pública — SEYP",
  copia_publica_Especifico: "Cópia pública — Específico",
};

const DISCIPLINAS = {
  matematica: "Matemática",
  fisica: "Física",
  quimica: "Química",
  portugues: "Português",
  ingles: "Inglês",
  redacao: "Redação",
  biologia: "Biologia",
  historia: "História",
  geografia: "Geografia",
  ciencias: "Ciências",
};

// ---------------------------------------------------------------------------

function slugificar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Monta um id legível a partir das partes que identificam o documento
 * (seleção, edição, tipo, fase, caderno, disciplinas) e garante unicidade.
 */
function idUnico(partes, jaUsados) {
  const base = slugificar(partes.filter(Boolean).join("-"));
  let id = base;
  let sufixo = 2;
  while (jaUsados.has(id)) id = `${base}-${sufixo++}`;
  jaUsados.add(id);
  return id;
}

function ordinalFase(n) {
  return `${n}ª fase`;
}

/** "Matemática, Inglês e Física" — enumeração legível em português. */
function listar(itens) {
  if (itens.length <= 1) return itens.join("");
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/**
 * Deriva os metadados de um documento a partir da seleção, da categoria e do
 * nome do arquivo. Cada seleção nomeia seus arquivos de um jeito, então as
 * regras são por seleção; o fallback usa apenas a categoria.
 */
function derivarMetadados({ sigla, categoria, edicao, nome }) {
  const base = nome.replace(/\.pdf$/i, "");
  const vazio = {
    tipo: tipoPorCategoria(categoria),
    fase: null,
    caderno: null,
    disciplinas: [],
    titulo: `${sigla} ${edicao} — ${base}`,
  };

  if (sigla === "ITA") return derivarIta(base, edicao, categoria) ?? vazio;
  if (sigla === "EEAR") return derivarEear(base, edicao, categoria) ?? vazio;
  if (sigla === "AFA") return derivarAfa(base, edicao, categoria) ?? vazio;
  if (sigla === "EsPCEx") return derivarEspcex(base, edicao, categoria) ?? vazio;
  if (sigla === "EPCAR") return derivarEpcar(base, edicao, categoria) ?? vazio;
  if (sigla === "CN") return derivarCn(base, edicao, categoria) ?? vazio;
  if (sigla === "EFOMM") return derivarEfomm(base, edicao) ?? vazio;
  if (sigla === "ESA") return derivarEsa(base, edicao) ?? vazio;
  if (sigla === "EAM") return derivarEam(base, edicao) ?? vazio;
  if (sigla === "IME") return derivarIme(base, edicao, categoria) ?? vazio;
  if (categoria === "Editais") {
    const nomeSelecao = NOME_SELECAO[sigla] ?? sigla;
    return {
      ...vazio,
      tipo: "edital",
      titulo: `Edital — ${nomeSelecao} ${edicao.replace("-", "/")}`,
    };
  }
  return vazio;
}

function tipoPorCategoria(categoria) {
  if (categoria === "Editais") return "edital";
  if (categoria === "Gabaritos") return "gabarito";
  if (categoria === "Informacoes") return "informacao";
  if (categoria === "Provas_e_gabaritos") return "prova_e_gabarito";
  return "prova";
}

function derivarIta(base) {
  let m;
  if ((m = base.match(/^edital_(\d{4})$/))) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital do vestibular ${m[1]}`,
    };
  }
  if ((m = base.match(/^programa_(\d{4})$/))) {
    return {
      tipo: "informacao",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Programa das provas — vestibular ${m[1]}`,
    };
  }
  if ((m = base.match(/^orientacoes_redacao_(\d{4})$/))) {
    return {
      tipo: "informacao",
      fase: null,
      caderno: null,
      disciplinas: ["Redação"],
      titulo: `Orientações para a redação — vestibular ${m[1]}`,
    };
  }
  if ((m = base.match(/^(\d{4})_fase1$/))) {
    return {
      tipo: "prova",
      fase: ordinalFase(1),
      caderno: null,
      disciplinas: [],
      titulo: `Prova da 1ª fase — vestibular ${m[1]}`,
    };
  }
  if ((m = base.match(/^gabarito_(\d{4})_2f$/))) {
    return {
      tipo: "gabarito",
      fase: ordinalFase(2),
      caderno: null,
      disciplinas: [],
      titulo: `Gabarito da 2ª fase — vestibular ${m[1]}`,
    };
  }
  if ((m = base.match(/^gabarito_(\d{4})$/))) {
    return {
      tipo: "gabarito",
      fase: ordinalFase(1),
      caderno: null,
      disciplinas: [],
      titulo: `Gabarito da 1ª fase — vestibular ${m[1]}`,
    };
  }
  if ((m = base.match(/^([a-z]+)_(\d{4})_2f$/))) {
    const disciplina = DISCIPLINAS[m[1]];
    if (disciplina) {
      return {
        tipo: "prova",
        fase: ordinalFase(2),
        caderno: null,
        disciplinas: [disciplina],
        titulo: `Prova de ${disciplina} — 2ª fase, vestibular ${m[2]}`,
      };
    }
  }
  if ((m = base.match(/^([a-z]+)_(\d{4})$/))) {
    const disciplina = DISCIPLINAS[m[1]];
    if (disciplina) {
      return {
        tipo: "prova",
        fase: null,
        caderno: null,
        disciplinas: [disciplina],
        titulo: `Prova de ${disciplina} — vestibular ${m[2]}`,
      };
    }
  }
  return null;
}

function derivarEear(base, edicao) {
  let m;
  if ((m = base.match(/^prova_cfs[_-](\d)[_-](\d{4})_cod_(\d+)/))) {
    return {
      tipo: "prova",
      fase: `CFS ${m[1]}`,
      caderno: `Código ${m[3]}`,
      disciplinas: [],
      titulo: `Prova do CFS ${m[1]}/${m[2]} — código ${m[3]}`,
    };
  }
  if ((m = base.match(/^prova_cfs[_-](\d)[_-](\d{4})$/))) {
    return {
      tipo: "prova",
      fase: `CFS ${m[1]}`,
      caderno: null,
      disciplinas: [],
      titulo: `Prova do CFS ${m[1]}/${m[2]}`,
    };
  }
  if ((m = base.match(/^gab_of_cfs(_bct)?_cod_(\d+)(_red)?$/))) {
    const bct = m[1] ? " (BCT)" : "";
    return {
      tipo: "gabarito",
      fase: null,
      caderno: `Código ${m[2]}`,
      disciplinas: [],
      titulo: `Gabarito oficial${bct} — código ${m[2]}, edição ${edicao}`,
    };
  }
  if ((m = base.match(/^CFS_(I+)_-_([\d-]+)$/))) {
    return {
      tipo: "prova",
      fase: `CFS ${m[1].length}`,
      caderno: null,
      disciplinas: [],
      titulo: `Prova do CFS ${m[1].length} — ${m[2].replace("-", "/")}`,
    };
  }
  if (/^Edital-EEAR-CFS(\d)/.test(base)) {
    const fase = base.match(/^Edital-EEAR-CFS(\d)/)[1];
    return {
      tipo: "edital",
      fase: `CFS ${fase}`,
      caderno: null,
      disciplinas: [],
      titulo: `Edital do CFS ${fase} — ${edicao.replace("-", "/")}`,
    };
  }
  return null;
}

function derivarAfa(base, edicao) {
  if (/_Provas$/.test(base)) {
    return {
      tipo: "prova",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Caderno de questões — AFA ${edicao}`,
    };
  }
  if (/_Gabaritos$/.test(base)) {
    return {
      tipo: "gabarito",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Gabarito — AFA ${edicao}`,
    };
  }
  if (/edital/i.test(base)) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital de abertura — AFA ${edicao}`,
    };
  }
  return null;
}

function derivarEspcex(base, edicao) {
  const dia = base.match(/(\d)o_DIA/);
  const fase = dia ? `${dia[1]}º dia` : null;
  if (/Gabarito/i.test(base)) {
    return {
      tipo: "gabarito",
      fase,
      caderno: null,
      disciplinas: [],
      titulo: `Gabarito${fase ? ` do ${fase}` : ""} — EsPCEx ${edicao.replace("-", "/")}`,
    };
  }
  if (/DIA/.test(base)) {
    return {
      tipo: "prova",
      fase,
      caderno: null,
      disciplinas: [],
      titulo: `Prova${fase ? ` do ${fase}` : ""} — EsPCEx ${edicao.replace("-", "/")}`,
    };
  }
  if (/edital/i.test(base)) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital — EsPCEx ${edicao.replace("-", "/")}`,
    };
  }
  return null;
}

function derivarEpcar(base, edicao) {
  const rotuloEdicao = edicao.replace("-", "/");
  if (/GABARITO/i.test(base)) {
    return {
      tipo: "gabarito",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Gabarito — EPCAR ${rotuloEdicao}`,
    };
  }
  if (/edital/i.test(base)) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital — EPCAR ${rotuloEdicao}`,
    };
  }
  return {
    tipo: "prova",
    fase: null,
    caderno: null,
    disciplinas: [],
    titulo: `Prova — EPCAR ${rotuloEdicao}`,
  };
}

function derivarCn(base, edicao) {
  if (/edital/i.test(base)) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital — Colégio Naval ${edicao}`,
    };
  }
  const m = base.match(/colegio-naval-(.+)$/);
  if (m) {
    const disciplinas = m[1]
      .split(/[-_]/)
      .map((p) => DISCIPLINAS[p] ?? null)
      .filter(Boolean);
    const lista = disciplinas.length ? listar(disciplinas) : "múltiplas disciplinas";
    return {
      tipo: "prova",
      fase: null,
      caderno: null,
      disciplinas,
      titulo: `Prova de ${lista} — Colégio Naval ${edicao}`,
    };
  }
  return null;
}

/**
 * EFOMM nomeia por "1o_DIA"/"2o_DIA" e "GABARITO", com o ciclo completo
 * (aplicação/ingresso) embutido no nome do arquivo, não na pasta do ano.
 */
function derivarEfomm(base, edicao) {
  const ciclo = base.match(/_(\d{4})-(\d{4})_/);
  const rotulo = ciclo ? `${ciclo[1]}/${ciclo[2]}` : edicao;
  if (/GABARITO/i.test(base)) {
    return {
      tipo: "gabarito",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Gabarito — EFOMM ${rotulo}`,
    };
  }
  const dia = base.match(/(\d)o_DIA/);
  if (dia) {
    return {
      tipo: "prova",
      fase: `${dia[1]}º dia`,
      caderno: null,
      disciplinas: [],
      titulo: `Prova do ${dia[1]}º dia — EFOMM ${rotulo}`,
    };
  }
  if (/edital/i.test(base)) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital — EFOMM ${edicao.replace("-", "/")}`,
    };
  }
  return null;
}

/** ESA nomeia por "GABARITO" e um arquivo único de prova por ano (sem dias). */
function derivarEsa(base, edicao) {
  const ciclo = base.match(/(\d{4})-(\d{4})/);
  const rotulo = ciclo ? `${ciclo[1]}/${ciclo[2]}` : edicao;
  if (/GABARITO/i.test(base)) {
    return {
      tipo: "gabarito",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Gabarito — ESA ${rotulo}`,
    };
  }
  if (/edital/i.test(base)) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital — ESA ${edicao.replace("-", "/")}`,
    };
  }
  return {
    tipo: "prova",
    fase: null,
    caderno: null,
    disciplinas: [],
    titulo: `Prova — ESA ${rotulo}`,
  };
}

/** EAM: só edital e prova por ano; a fonte não traz gabarito de nenhuma edição. */
function derivarEam(base, edicao) {
  if (/edital/i.test(base)) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital — EAM ${edicao}`,
    };
  }
  return {
    tipo: "prova",
    fase: null,
    caderno: null,
    disciplinas: [],
    titulo: `Prova — EAM ${edicao}`,
  };
}

/**
 * IME: o edital é um documento avulso do Diário Oficial, o caderno mais
 * recente já vem com provas e gabarito juntos, e o restante da fonte só tem
 * a prova de Matemática (2ª fase) avulsa, ano a ano.
 */
function derivarIme(base, edicao, categoria) {
  if (/edital/i.test(base)) {
    return {
      tipo: "edital",
      fase: null,
      caderno: null,
      disciplinas: [],
      titulo: `Edital — IME ${edicao.replace("-", "/")}`,
    };
  }
  if (categoria === "Provas_e_gabaritos") {
    const faseMatch = base.match(/(\d)a-FASE/i);
    const fase = faseMatch ? ordinalFase(Number(faseMatch[1])) : null;
    return {
      tipo: "prova_e_gabarito",
      fase,
      caderno: null,
      disciplinas: [],
      titulo: `Prova e gabarito${fase ? ` da ${fase}` : ""} — IME ${edicao}`,
    };
  }
  if (categoria === "Provas_por_disciplina") {
    const m = base.match(/Prova_de_Matematica_IME_([\d-]+)_(\d)a_fase/);
    if (m) {
      const fase = ordinalFase(Number(m[2]));
      return {
        tipo: "prova",
        fase,
        caderno: null,
        disciplinas: ["Matemática"],
        titulo: `Prova de Matemática — ${fase}, IME ${m[1].replace("-", "/")}`,
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------

function anosDaEdicao(edicao) {
  const m = edicao.match(/^(\d{4})-(\d{4})$/);
  if (m) return { anoAplicacao: Number(m[1]), anoIngresso: Number(m[2]) };
  return { anoAplicacao: null, anoIngresso: null };
}

function montarFonte(fontes) {
  const preferida = fontes.find((f) => f.source_type === "oficial") ?? fontes[0];
  if (!preferida) {
    return { url: "", pagina: "", rotulo: "Não informado", oficial: false };
  }
  const oficial = preferida.source_type === "oficial";
  let rotulo = ROTULO_FONTE[preferida.source_type] ?? "Cópia pública";
  if (oficial) {
    try {
      rotulo = new URL(preferida.url).hostname.replace(/^www\./, "");
    } catch {
      rotulo = "Fonte oficial";
    }
  }
  return {
    url: preferida.url,
    pagina: preferida.source ?? preferida.url,
    rotulo,
    oficial,
  };
}

/** Junta as correções da curadoria que valem para um arquivo e para sua pasta. */
function curadoriaDe(caminho) {
  const daPasta = CURADORIA[caminho.replace(/[^/]+$/, "")] ?? {};
  const direta = CURADORIA[caminho] ?? {};
  return {
    ...daPasta,
    ...direta,
    notas: [...(daPasta.notas ?? []), ...(direta.notas ?? [])],
  };
}

/**
 * Liga cada gabarito às provas da mesma seleção, edição e fase. Quando o
 * gabarito cobre disciplinas específicas, só liga às provas dessas disciplinas —
 * é o caso da 2ª fase do ITA, em que o gabarito publicado é só de Português.
 */
function vincularGabaritos(materiais) {
  const provas = materiais.filter((m) => m.tipo === "prova");
  for (const gabarito of materiais.filter((m) => m.tipo === "gabarito")) {
    const candidatas = provas.filter(
      (p) =>
        p.selecao === gabarito.selecao &&
        p.edicao === gabarito.edicao &&
        (gabarito.fase === null || p.fase === gabarito.fase) &&
        (gabarito.caderno === null || p.caderno === gabarito.caderno) &&
        (gabarito.disciplinas.length === 0 ||
          p.disciplinas.length === 0 ||
          p.disciplinas.some((d) => gabarito.disciplinas.includes(d))),
    );
    gabarito.provasIds = candidatas.map((p) => p.id);
    for (const prova of candidatas) prova.gabaritoId = gabarito.id;
  }
}

// ---------------------------------------------------------------------------

function main() {
  const catalogo = JSON.parse(
    fs.readFileSync(path.join(ACERVO_ORIGEM, "Catalogo_e_fontes.json"), "utf8"),
  );

  const noLote = (caminho) => {
    const [selecao, categoria, ano] = caminho.split("/");
    return LOTE.find(
      (l) => l.selecao === selecao && l.categoria === categoria && l.ano === ano,
    );
  };

  const materiais = [];
  const idsUsados = new Set();

  for (const doc of catalogo.documentos) {
    const caminho = doc.arquivo.replace(/\\/g, "/");
    const entrada = noLote(caminho);
    if (!entrada) continue;

    const [sigla, categoria, edicao, nome] = caminho.split("/");
    const slugSelecao = SIGLA_PARA_SLUG[sigla];
    if (!slugSelecao) throw new Error(`Seleção sem slug: ${sigla}`);

    const derivado = { ...derivarMetadados({ sigla, categoria, edicao, nome }), notas: [] };
    const corrigido = { ...derivado, ...curadoriaDe(caminho) };
    const fonte = montarFonte(doc.fontes ?? []);

    // Hospedar não implica "verificado": só a fonte oficial ganha esse selo.
    const situacaoUso = !entrada.hospedar
      ? "somente_referencia"
      : fonte.oficial
        ? "hospedagem_conferida"
        : "a_confirmar";

    const id = idUnico(
      [
        slugSelecao,
        edicao,
        corrigido.tipo,
        corrigido.fase,
        corrigido.caderno,
        corrigido.disciplinas.join("-"),
      ],
      idsUsados,
    );

    const arquivoPublico = entrada.hospedar ? `/acervo/${slugSelecao}/${id}.pdf` : null;
    if (arquivoPublico) {
      const destino = path.join(DESTINO_ARQUIVOS, slugSelecao, `${id}.pdf`);
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.copyFileSync(path.join(ACERVO_ORIGEM, caminho), destino);
    }

    materiais.push({
      id,
      selecao: slugSelecao,
      titulo: corrigido.titulo,
      tipo: corrigido.tipo,
      edicao,
      ...anosDaEdicao(edicao),
      fase: corrigido.fase,
      caderno: corrigido.caderno,
      disciplinas: corrigido.disciplinas,
      paginas: doc.paginas ?? null,
      bytes: doc.bytes ?? null,
      sha256: doc.sha256 ?? null,
      situacaoUso,
      arquivo: arquivoPublico,
      fonte,
      dataConferencia: DATA_CONFERENCIA,
      gabaritoId: null,
      provasIds: [],
      notas: corrigido.notas,
    });
  }

  vincularGabaritos(materiais);

  materiais.sort(
    (a, b) =>
      a.selecao.localeCompare(b.selecao) ||
      b.edicao.localeCompare(a.edicao) ||
      a.titulo.localeCompare(b.titulo, "pt-BR"),
  );

  fs.mkdirSync(path.dirname(DESTINO_DADOS), { recursive: true });
  fs.writeFileSync(
    DESTINO_DADOS,
    `${JSON.stringify({ geradoEm: DATA_CONFERENCIA, lote: DESCRICAO_LOTE, materiais }, null, 2)}\n`,
  );

  const conferidos = materiais.filter((m) => m.situacaoUso === "hospedagem_conferida").length;
  const aConfirmar = materiais.filter((m) => m.situacaoUso === "a_confirmar").length;
  const referencia = materiais.filter((m) => m.situacaoUso === "somente_referencia").length;
  const selecoes = new Set(materiais.map((m) => m.selecao));
  console.log(
    `${materiais.length} materiais em ${selecoes.size} seleções: ` +
      `${conferidos} hospedados de fonte oficial, ` +
      `${aConfirmar} hospedados como cópia sem permissão confirmada, ` +
      `${referencia} só com referência à origem.`,
  );

  const semVinculo = materiais.filter((m) => m.tipo === "prova" && !m.gabaritoId).length;
  console.log(`${semVinculo} provas sem gabarito correspondente no acervo.`);
}

main();
