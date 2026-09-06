import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sem conexão",
  description: "Esta página do acervo precisa de internet para carregar.",
};

export default function Offline() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="display text-3xl sm:text-4xl">Sem conexão no momento</h1>
      <p className="mt-4 leading-relaxed text-grafite-600">
        Esta página ainda não tinha sido aberta neste aparelho, então não há
        cópia guardada para mostrar. Quando a internet voltar, ela carrega
        normalmente.
      </p>
      <p className="mt-4 leading-relaxed text-grafite-600">
        O Campo de Treino guarda apenas as páginas que você já visitou. Os PDFs
        do acervo não ficam disponíveis offline.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-sm bg-grafite-900 px-5 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
      >
        Tentar o início
      </Link>
    </div>
  );
}
