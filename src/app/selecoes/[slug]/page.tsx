import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListaMateriais } from "@/components/lista-materiais";
import { materiaisDaSelecao } from "@/lib/acervo";
import { urlDoAcervo } from "@/lib/consulta-url";
import { FILTROS_VAZIOS } from "@/lib/acervo";
import { SELECOES, buscarSelecao } from "@/lib/selecoes";
import { rotuloEdicao } from "@/lib/texto";

export function generateStaticParams() {
  return SELECOES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/selecoes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const selecao = buscarSelecao(slug);
  if (!selecao) return {};
  return {
    title: `${selecao.sigla} — ${selecao.nome}`,
    description: selecao.resumo,
  };
}

/** Valor conferido ou o aviso de que ainda não foi. */
function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  const ausente = !valor;
  return (
    <div className="regua py-4">
      <dt className="text-[15px] text-grafite-500">{rotulo}</dt>
      <dd
        className={`mt-1 text-[17px] leading-snug ${ausente ? "text-grafite-500 italic" : "text-grafite-900"}`}
      >
        {ausente ? "A confirmar" : valor}
      </dd>
    </div>
  );
}

export default async function PaginaSelecao({ params }: PageProps<"/selecoes/[slug]">) {
  const { slug } = await params;
  const selecao = buscarSelecao(slug);
  if (!selecao) notFound();

  const materiais = materiaisDaSelecao(slug);
  const edicoes = [...new Set(materiais.map((m) => m.edicao))].sort((a, b) =>
    b.localeCompare(a),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <nav aria-label="Trilha" className="text-[15px] text-grafite-500">
        <Link href="/selecoes" className="hover:text-grafite-900">
          Seleções
        </Link>
        <span className="px-2 text-grafite-300">/</span>
        <span className="text-grafite-900">{selecao.sigla}</span>
      </nav>

      <header className="mt-4 flex max-w-3xl gap-5">
        {selecao.brasao && (
          // eslint-disable-next-line @next/next/no-img-element -- brasão vem em svg/png/gif variados, sem necessidade de otimização.
          <img
            src={selecao.brasao.arquivo}
            alt={`Brasão da ${selecao.nome}`}
            width={72}
            height={72}
            className="mt-1 h-18 w-18 shrink-0 object-contain"
          />
        )}
        <div>
          <h1 className="display text-4xl sm:text-5xl">{selecao.sigla}</h1>
          <p className="mt-2 text-2xl leading-snug text-grafite-700">{selecao.nome}</p>
          <p className="mt-4 leading-relaxed text-grafite-600">{selecao.resumo}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {selecao.forcas.map((forca) => (
              <span
                key={forca}
                className="rounded-sm bg-grafite-100 px-2.5 py-1 text-[14px] text-grafite-600"
              >
                {forca}
              </span>
            ))}
          </div>
          {selecao.brasao && (
            <p className="mt-3 text-[12px] text-grafite-400">
              Brasão:{" "}
              <a
                href={selecao.brasao.fonte}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2 hover:text-grafite-600"
              >
                {selecao.brasao.credito}
              </a>
            </p>
          )}
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-12">
        <aside>
          <h2 className="display text-xl">A seleção</h2>
          <dl className="mt-3">
            <Campo rotulo="Escolaridade exigida" valor={selecao.escolaridadeExigida} />
            <Campo rotulo="Formação oferecida" valor={selecao.formacaoOferecida} />
            <div className="regua py-4">
              <dt className="text-[15px] text-grafite-500">Site oficial</dt>
              <dd className="mt-1 text-[17px] leading-snug">
                {selecao.siteOficial ? (
                  <a
                    href={selecao.siteOficial}
                    className="break-words text-oliva-700 underline underline-offset-4 hover:text-grafite-900"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {selecao.siteOficial.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <span className="text-grafite-500 italic">
                    A confirmar — esta curadoria ainda não verificou o endereço.
                  </span>
                )}
              </dd>
            </div>
          </dl>
          {selecao.observacoes.length > 0 && (
            <div className="mt-6 rounded-sm bg-oliva-100 p-4">
              <h3 className="text-[15px] font-semibold text-oliva-700">Atenção</h3>
              <ul className="mt-2 space-y-2 text-[15px] leading-relaxed text-grafite-700">
                {selecao.observacoes.map((obs) => (
                  <li key={obs}>{obs}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="display text-2xl sm:text-3xl">Documentos</h2>
            {materiais.length > 0 && (
              <Link
                href={urlDoAcervo(FILTROS_VAZIOS, { selecoes: [slug] })}
                className="text-[15px] font-medium text-oliva-700 underline underline-offset-4 hover:text-grafite-900"
              >
                Filtrar no acervo
              </Link>
            )}
          </div>

          {materiais.length === 0 ? (
            <div className="regua mt-5 bg-white px-5 py-12 text-center">
              <p className="display text-2xl">Ainda não há documentos aqui</p>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-grafite-600">
                Esta seleção está na fila de curadoria. Publicamos por lotes, só
                depois de conferir a fonte e a situação de uso de cada arquivo.
              </p>
              <Link
                href="/acervo"
                className="mt-6 inline-block rounded-sm bg-grafite-900 px-5 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
              >
                Ver o que já está publicado
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-10">
              {edicoes.map((edicao) => (
                <div key={edicao}>
                  <h3 className="display text-xl text-grafite-700">
                    Edição {rotuloEdicao(edicao)}
                  </h3>
                  <div className="mt-2">
                    <ListaMateriais
                      materiais={materiais.filter((m) => m.edicao === edicao)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
