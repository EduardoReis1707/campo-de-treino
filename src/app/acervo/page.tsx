import type { Metadata } from "next";
import Link from "next/link";
import { FiltrosAcervo } from "@/components/filtros-acervo";
import { ListaMateriais } from "@/components/lista-materiais";
import {
  aplicarFiltros,
  lote,
  opcoesDeFiltro,
  paginar,
  selecoesComAcervo,
  todosMateriais,
} from "@/lib/acervo";
import { lerFiltros, temFiltroAtivo, urlDoAcervo } from "@/lib/consulta-url";

export const metadata: Metadata = {
  title: "Acervo",
  description:
    "Busque editais, provas anteriores e gabaritos das seleções militares por seleção, edição, tipo e disciplina.",
};

export default async function Acervo({ searchParams }: PageProps<"/acervo">) {
  const filtros = lerFiltros(await searchParams);
  const materiais = todosMateriais();
  const encontrados = aplicarFiltros(materiais, filtros);
  const pagina = paginar(encontrados, filtros.pagina);
  const opcoes = opcoesDeFiltro(materiais);
  const filtrado = temFiltroAtivo(filtros);

  const ativos =
    filtros.selecoes.length +
    filtros.edicoes.length +
    filtros.tipos.length +
    filtros.disciplinas.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header>
        <h1 className="display text-4xl sm:text-5xl">Acervo</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-grafite-600">
          {lote()} Cada documento indica a fonte de onde veio e se a cópia está
          aqui ou apenas no site de origem.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
        <aside>
          <h2 className="sr-only">Busca e filtros</h2>
          <FiltrosAcervo
            filtros={filtros}
            opcoes={{ ...opcoes, selecoes: selecoesComAcervo() }}
            totalAtivos={ativos}
          />
        </aside>

        <section aria-label="Resultados">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4">
            <p className="text-[15px] text-grafite-600" aria-live="polite">
              {pagina.total === 0
                ? "Nenhum documento encontrado"
                : `${pagina.total} ${pagina.total === 1 ? "documento" : "documentos"}`}
              {filtrado && pagina.total > 0 && " com os filtros aplicados"}
            </p>
            {pagina.totalPaginas > 1 && (
              <p className="text-[15px] text-grafite-500">
                Página {pagina.pagina} de {pagina.totalPaginas}
              </p>
            )}
          </div>

          {pagina.total === 0 ? (
            <div className="regua bg-white px-5 py-12 text-center">
              <p className="display text-2xl">Nada encontrado por aqui</p>
              <p className="mx-auto mt-3 max-w-md leading-relaxed text-grafite-600">
                O acervo ainda está em curadoria e pode não ter esta edição.
                Tente menos filtros, um termo mais curto, ou veja tudo o que já
                foi publicado.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/acervo"
                  className="rounded-sm bg-grafite-900 px-5 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
                >
                  Limpar filtros
                </Link>
                <Link
                  href="/selecoes"
                  className="rounded-sm border border-grafite-300 px-5 py-2.5 text-[15px] font-medium text-grafite-700 hover:border-grafite-500"
                >
                  Navegar por seleção
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ListaMateriais materiais={pagina.itens} />
              {pagina.totalPaginas > 1 && (
                <nav
                  aria-label="Paginação dos resultados"
                  className="mt-8 flex items-center justify-between gap-4"
                >
                  {pagina.pagina > 1 ? (
                    <Link
                      href={urlDoAcervo(filtros, { pagina: pagina.pagina - 1 })}
                      className="rounded-sm border border-grafite-300 px-4 py-2.5 text-[15px] font-medium hover:border-grafite-500"
                    >
                      Página anterior
                    </Link>
                  ) : (
                    <span />
                  )}
                  {pagina.pagina < pagina.totalPaginas && (
                    <Link
                      href={urlDoAcervo(filtros, { pagina: pagina.pagina + 1 })}
                      className="rounded-sm border border-grafite-300 px-4 py-2.5 text-[15px] font-medium hover:border-grafite-500"
                    >
                      Próxima página
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
