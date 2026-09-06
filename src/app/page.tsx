import Link from "next/link";
import { contarPorSelecao, todosMateriais } from "@/lib/acervo";
import { FORCAS, SELECOES, selecoesDaForca } from "@/lib/selecoes";
import type { Forca } from "@/lib/tipos";

/** Painéis de navegação da abertura, na ordem aprovada no PRD. */
const PAINEIS: Forca[] = ["Exército", "Marinha", "Aeronáutica", "Engenharia"];

const PASSOS = [
  {
    titulo: "Escolha a seleção",
    texto: "ITA, IME, EN, EFOMM, AFA, EsPCEx, ESA, EEAR, EAM, CN ou EPCAR.",
  },
  {
    titulo: "Filtre por ano e tipo",
    texto: "Edital, prova, gabarito ou material de apoio, edição por edição.",
  },
  {
    titulo: "Abra o documento",
    texto: "Com a fonte de onde veio e o gabarito correspondente, quando existe.",
  },
];

const PERGUNTAS = [
  {
    pergunta: "Preciso criar conta?",
    resposta:
      "Não. O acervo é público e gratuito, sem cadastro. As contas existem apenas para a equipe que faz a curadoria.",
  },
  {
    pergunta: "De onde vêm os documentos?",
    resposta:
      "De sites oficiais das instituições e, quando necessário, de cópias públicas. Cada documento mostra a origem e a data em que foi conferido.",
  },
  {
    pergunta: "O acervo está completo?",
    resposta:
      "Não. Publicamos por lotes conferidos. Faltam edições e seleções, e alguns documentos aparecem apenas com o caminho até a fonte, sem cópia hospedada aqui.",
  },
  {
    pergunta: "Posso usar o edital daqui para me inscrever?",
    resposta:
      "Não. Os editais são cópias históricas para estudo. Para inscrição e prazos, consulte sempre o site oficial da seleção.",
  },
];

function Painel({ forca }: { forca: Forca }) {
  const selecoes = selecoesDaForca(forca);
  const contagem = contarPorSelecao();
  const descricao = FORCAS.find((f) => f.forca === forca)?.descricao ?? "";

  return (
    <section className="flex flex-col justify-between border-t border-grafite-700 px-5 py-8 sm:px-7 lg:border-t-0 lg:border-l lg:first:border-l-0 lg:py-12">
      <div>
        <h3 className="display text-3xl text-papel lg:text-4xl">{forca}</h3>
        <p className="mt-2 max-w-xs text-[15px] text-grafite-300">{descricao}</p>
      </div>
      <ul className="mt-6 space-y-px lg:mt-10">
        {selecoes.map((selecao) => {
          const total = contagem.get(selecao.slug) ?? 0;
          return (
            <li key={selecao.slug}>
              <Link
                href={`/selecoes/${selecao.slug}`}
                className="flex items-baseline justify-between gap-3 py-2 text-papel transition-colors hover:text-oliva-400"
              >
                <span className="display text-2xl lg:text-[26px]">{selecao.sigla}</span>
                <span className="text-[13px] text-grafite-300">
                  {total > 0
                    ? `${total} ${total === 1 ? "documento" : "documentos"}`
                    : "em curadoria"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function Inicio() {
  const materiais = todosMateriais();
  const contagem = contarPorSelecao();
  const comAcervo = SELECOES.filter((s) => (contagem.get(s.slug) ?? 0) > 0).length;

  return (
    <>
      {/* Abertura: o próprio índice de siglas é a imagem da página. */}
      <section className="bg-grafite-900 text-papel">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 lg:pt-24 lg:pb-20">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <h1 className="display text-5xl sm:text-6xl lg:text-[5.5rem]">
                Prepare seu próximo passo.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-grafite-200">
                Editais, provas anteriores e exercícios para organizar sua
                preparação.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/acervo"
                  className="rounded-sm bg-oliva-400 px-7 py-3.5 text-[17px] font-semibold text-grafite-900 transition-colors hover:bg-oliva-500 hover:text-papel"
                >
                  Explorar acervo
                </Link>
                <Link
                  href="/selecoes"
                  className="rounded-sm border border-grafite-600 px-7 py-3.5 text-[17px] font-medium text-papel transition-colors hover:border-grafite-300"
                >
                  Ver seleções
                </Link>
              </div>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-grafite-300">
                {materiais.length} documentos publicados em {comAcervo} seleções,
                cada um com a fonte de onde veio. O acervo segue em curadoria.
              </p>
            </div>

            {/* Prévia fiel: as 11 seleções, com quem já tem material em destaque. */}
            <div className="lg:pt-4">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-2">
                {SELECOES.map((selecao) => {
                  const total = contagem.get(selecao.slug) ?? 0;
                  return (
                    <li key={selecao.slug}>
                      <Link
                        href={`/selecoes/${selecao.slug}`}
                        className={`flex items-baseline gap-2 py-1.5 transition-colors ${
                          total > 0
                            ? "text-oliva-400 hover:text-papel"
                            : "text-grafite-600 hover:text-grafite-300"
                        }`}
                      >
                        <span className="display text-[2.6rem] leading-none sm:text-5xl">
                          {selecao.sigla}
                        </span>
                        {total > 0 && (
                          <span className="text-sm text-grafite-300">{total}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 text-sm text-grafite-500">
                Em verde, as seleções que já têm documentos publicados.
              </p>
            </div>
          </div>
        </div>

        {/* Painéis por força, empilhados no celular e sempre com título visível. */}
        <div className="border-t border-grafite-700">
          <div className="mx-auto grid max-w-6xl lg:grid-cols-4">
            {PAINEIS.map((forca) => (
              <Painel key={forca} forca={forca} />
            ))}
          </div>
        </div>
        <div className="border-t border-grafite-700">
          <div className="mx-auto max-w-6xl px-5 py-6 sm:px-7">
            <p className="text-[15px] text-grafite-300">
              A EFOMM forma para a{" "}
              <Link href="/selecoes/efomm" className="text-oliva-400 hover:text-papel">
                Marinha Mercante
              </Link>{" "}
              — carreira civil, distinta da Marinha do Brasil.
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona: aqui a numeração é legítima, porque é uma sequência. */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <h2 className="display text-3xl sm:text-4xl">Como funciona</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {PASSOS.map((passo, i) => (
            <li key={passo.titulo} className="regua pt-5">
              <span className="display text-2xl text-oliva-600">{i + 1}</span>
              <h3 className="mt-2 text-xl font-semibold">{passo.titulo}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-grafite-600">
                {passo.texto}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Prévia do acervo: documentos reais, não números inventados. */}
      <section className="bg-papel-fundo">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display text-3xl sm:text-4xl">No acervo agora</h2>
            <Link
              href="/acervo"
              className="text-[17px] font-medium text-oliva-700 underline underline-offset-4 hover:text-grafite-900"
            >
              Ver todos os {materiais.length} documentos
            </Link>
          </div>
          <ul className="mt-8 grid border-t border-l border-grafite-200 sm:grid-cols-2 lg:grid-cols-3">
            {materiais.slice(0, 6).map((material) => (
              <li key={material.id}>
                <Link
                  href={`/material/${material.id}`}
                  className="flex h-full flex-col justify-between gap-4 border-r border-b border-grafite-200 bg-papel p-5 transition-colors hover:bg-oliva-100"
                >
                  <span className="text-[17px] leading-snug font-medium">
                    {material.titulo}
                  </span>
                  <span className="text-sm text-grafite-500">
                    {material.fonte.rotulo}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <h2 className="display text-3xl sm:text-4xl">Perguntas frequentes</h2>
        <dl className="mt-10">
          {PERGUNTAS.map((item) => (
            <div key={item.pergunta} className="regua py-6">
              <dt className="text-xl font-semibold">{item.pergunta}</dt>
              <dd className="mt-2 leading-relaxed text-grafite-600">{item.resposta}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
