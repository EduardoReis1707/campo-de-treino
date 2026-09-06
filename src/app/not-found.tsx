import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="display text-6xl text-oliva-600">404</p>
      <h1 className="display mt-4 text-3xl sm:text-4xl">
        Esta página não existe
      </h1>
      <p className="mt-4 leading-relaxed text-grafite-600">
        O endereço pode ter mudado, ou o documento ainda não foi publicado. O
        acervo cresce por lotes conferidos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/acervo"
          className="rounded-sm bg-grafite-900 px-5 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
        >
          Buscar no acervo
        </Link>
        <Link
          href="/"
          className="rounded-sm border border-grafite-300 px-5 py-2.5 text-[15px] font-medium text-grafite-700 hover:border-grafite-500"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
