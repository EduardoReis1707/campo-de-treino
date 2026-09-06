# Campo de Treino

Plataforma gratuita de editais, provas anteriores e gabaritos das seleções
militares brasileiras. Nome provisório.

Este repositório contém o **marco 1**: landing page, catálogo público e o fluxo
completo de escolher uma seleção → filtrar por ano e tipo → abrir um material →
consultar sua fonte e o gabarito correspondente. Sem cadastro, sem pagamentos,
sem simulados e sem IA — conforme o PRD.

## Rodar

```bash
npm install
cp .env.example .env
npm run dev
```

O site sobe em <http://localhost:3000>.

### Variáveis de ambiente

`.env` não é versionado; `.env.example` é o modelo. Duas variáveis, ambas
opcionais em desenvolvimento:

| Variável               | Para que serve                                          |
| ---------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Domínio público, usado por `sitemap.xml` e `robots.txt`. |
| `ACERVO_ORIGEM`        | Pasta do acervo bruto lida por `npm run acervo`.          |

Em produção, defina `NEXT_PUBLIC_SITE_URL` no painel da hospedagem — sem isso o
sitemap sai apontando para `localhost`.

## Como o acervo entra no site

O acervo bruto (474 PDFs coletados em 06/09/2026) vive **fora** deste
repositório, em `Documents/Codex/2026-09-06/ol/outputs/Campo de Treino`. O site
não publica esse acervo inteiro: publica um **lote conferido**.

```bash
npm run acervo
```

O script `scripts/gerar-acervo.mjs` lê `Catalogo_e_fontes.json`, filtra pelo
`LOTE` declarado no topo do próprio script e produz:

- `src/data/acervo.json` — metadados dos materiais publicados;
- `public/acervo/<selecao>/<id>.pdf` — cópias dos PDFs cuja hospedagem foi
  conferida.

Aponte para outra pasta de origem com a variável `ACERVO_ORIGEM`.

### Regra de publicação

Cada entrada do `LOTE` diz se o arquivo pode ser hospedado:

| `hospedar` | Situação de uso        | O que o site faz                                 |
| ---------- | ---------------------- | ------------------------------------------------ |
| `true`     | `hospedagem_conferida` | Mostra o PDF aqui, com visualizador e download.  |
| `false`    | `somente_referencia`   | Mostra a ficha do documento e o link até a fonte. |

O script recusa hospedar qualquer arquivo cuja fonte não seja oficial. Cópias de
cursos e de professores entram apenas como referência à origem, porque a
permissão para republicar não foi verificada.

### Lote publicado hoje

45 documentos em 7 seleções, 28 com arquivo hospedado:

- **ITA** — provas e gabaritos 2024 e 2025, edital e orientações de redação 2027
  (fonte oficial `vestibular.ita.br`);
- **EEAR** — 12 cadernos do CFS 1 e CFS 2 de 2024 (fonte oficial FAB);
- **AFA** — edital 2027 hospedado; provas e gabaritos 2024–2025 por referência;
- **EsPCEx, EPCAR, CN, EN** — editais, provas e gabaritos por referência.

Correções de curadoria (título errado, disciplina faltando, ressalva sobre o
conteúdo do arquivo) ficam no mapa `CURADORIA`, dentro do mesmo script, com o
caminho do arquivo como chave.

## Estrutura

```
src/
  app/                 páginas (App Router)
    acervo/            catálogo com busca, filtros, paginação e estados vazios
    selecoes/[slug]/   página de cada seleção
    material/[id]/     ficha do documento, visualizador e vínculo com gabarito
  components/          interface
  data/acervo.json     gerado por npm run acervo — não editar à mão
  lib/
    acervo.ts          única porta de entrada aos dados do acervo
    selecoes.ts        metadados curados das 11 seleções
    tipos.ts           tipos do domínio
scripts/gerar-acervo.mjs
supabase/migrations/   esquema do marco 2 (ainda não aplicado)
```

`src/lib/acervo.ts` isola a origem dos dados. No marco 2 ele passa a falar com o
Supabase; as páginas não mudam.

## Decisões técnicas

**Sem Supabase no marco 1.** O catálogo público é leitura de dados que não mudam
entre publicações de lote, então ele é gerado estaticamente no build — rápido no
celular e sem custo de banco. O Supabase entra no marco 2, junto com
autenticação da equipe, upload e fluxo de publicação;
`supabase/migrations/0001_esquema_acervo.sql` já traz o esquema com RLS,
protegendo rascunhos inclusive contra acesso direto ao arquivo.

**PDFs sob demanda.** O visualizador só busca o arquivo quando a pessoa clica.
Um caderno de questões tem megabytes; ninguém deve pagar esse download por
engano.

**PWA sem promessa falsa.** Há manifesto, ícones e service worker
(`public/sw.js`), que guarda o casco do site e as páginas já visitadas. PDFs
ficam de fora do cache e o site diz isso: não existe acervo offline.

**Imagens.** A direção visual aprovada pede fotografia própria ou licenciada. Não
havia acervo de imagens, então a abertura foi construída com tipografia — o
índice de siglas — em vez de banco de imagens não licenciado.

## Pendências antes de publicar

- Definir o canal de contato da curadoria (hoje `/sobre` diz que ainda não
  existe, em vez de exibir um formulário que não funciona).
- Conferir os endereços institucionais das seleções sem `siteOficial` em
  `src/lib/selecoes.ts` (AFA, EsPCEx, ESA, EEAR aparecem como "A confirmar").
- Definir `NEXT_PUBLIC_SITE_URL` no ambiente de produção, para `sitemap.xml` e
  `robots.txt`.
- Decidir a hospedagem e o orçamento de armazenamento e tráfego.
