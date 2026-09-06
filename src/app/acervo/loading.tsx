/** Esqueleto do catálogo enquanto os resultados chegam. */
export default function Carregando() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="h-12 w-48 rounded-sm bg-grafite-100" />
      <div className="mt-3 h-5 w-full max-w-2xl rounded-sm bg-grafite-100" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
        <div className="h-64 rounded-sm bg-grafite-100" />
        <div>
          <p className="text-[15px] text-grafite-500">Carregando documentos…</p>
          <ul className="mt-4 space-y-px">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="regua py-5">
                <div className="h-5 w-3/4 rounded-sm bg-grafite-100" />
                <div className="mt-3 h-4 w-1/2 rounded-sm bg-grafite-100" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
