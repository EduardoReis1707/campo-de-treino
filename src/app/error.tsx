"use client";

import Link from "next/link";

/**
 * Erro inesperado. Diz o que aconteceu e o que fazer, sem pedir desculpas nem
 * despejar detalhes técnicos na tela de quem só quer achar uma prova.
 */
export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="display text-3xl sm:text-4xl">
        Esta página não carregou
      </h1>
      <p className="mt-4 leading-relaxed text-grafite-600">
        Algo falhou ao montar o conteúdo. Tentar de novo costuma resolver; se
        insistir, o acervo continua acessível pela busca.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm bg-grafite-900 px-5 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
        >
          Tentar de novo
        </button>
        <Link
          href="/acervo"
          className="rounded-sm border border-grafite-300 px-5 py-2.5 text-[15px] font-medium text-grafite-700 hover:border-grafite-500"
        >
          Ir para o acervo
        </Link>
      </div>
    </div>
  );
}
