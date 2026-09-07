import type { Metadata } from "next";
import Link from "next/link";
import { Etiqueta } from "@/components/etiqueta";
import { contarPorSelecao } from "@/lib/acervo";
import { GRUPOS, SELECOES } from "@/lib/selecoes";

export const metadata: Metadata = {
  title: "Seleções",
  description:
    "As seleções militares atendidas, separadas por momento de ingresso: ensino médio militar e ingresso após o ensino médio.",
};

export default function Selecoes() {
  const contagem = contarPorSelecao();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="max-w-2xl">
        <h1 className="display text-4xl sm:text-5xl">Seleções</h1>
        <p className="mt-3 leading-relaxed text-grafite-600">
          Separadas pelo momento de ingresso. Escolaridade exigida, formação
          oferecida e modalidades mudam a cada edição — o edital da edição é
          sempre a referência.
        </p>
      </header>

      {GRUPOS.map((grupo) => {
        const selecoes = SELECOES.filter((s) => s.grupo === grupo.grupo);
        return (
          <section key={grupo.grupo} className="mt-12">
            <h2 className="display text-2xl sm:text-3xl">{grupo.rotulo}</h2>
            <p className="mt-1 text-[15px] text-grafite-600">{grupo.descricao}</p>
            {/* Bordas nos próprios cartões: uma linha vazia da grade não vira bloco cinza. */}
            <ul className="mt-6 grid border-t border-l border-grafite-200 sm:grid-cols-2 lg:grid-cols-3">
              {selecoes.map((selecao) => {
                const total = contagem.get(selecao.slug) ?? 0;
                return (
                  <li key={selecao.slug}>
                    <Link
                      href={`/selecoes/${selecao.slug}`}
                      className="flex h-full flex-col gap-3 border-r border-b border-grafite-200 bg-white p-5 transition-colors hover:bg-oliva-100"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2.5">
                          {selecao.brasao && (
                            // eslint-disable-next-line @next/next/no-img-element -- brasão vem em svg/png/gif variados, sem necessidade de otimização.
                            <img
                              src={selecao.brasao.arquivo}
                              alt=""
                              width={32}
                              height={32}
                              className="h-8 w-8 shrink-0 object-contain"
                            />
                          )}
                          <span className="display text-3xl">{selecao.sigla}</span>
                        </span>
                        <Etiqueta tom={total > 0 ? "disponivel" : "referencia"}>
                          {total > 0
                            ? `${total} ${total === 1 ? "documento" : "documentos"}`
                            : "em curadoria"}
                        </Etiqueta>
                      </span>
                      <span className="text-[17px] leading-snug font-medium text-grafite-900">
                        {selecao.nome}
                      </span>
                      <span className="text-[15px] leading-relaxed text-grafite-600">
                        {selecao.resumo}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
