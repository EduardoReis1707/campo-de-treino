import Link from "next/link";

/**
 * Rodapé. Além dos links, deixa explícito que a plataforma é independente —
 * exigência do PRD para não sugerir vínculo com as instituições.
 */
export function Rodape() {
  return (
    <footer className="mt-20 bg-grafite-900 text-grafite-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6">
        <div className="max-w-md">
          <p className="display text-2xl text-papel">Campo de Treino</p>
          <p className="mt-3 text-[15px] leading-relaxed">
            Plataforma educacional independente. Não temos vínculo com as Forças
            Armadas, com as instituições de ensino nem com as bancas
            organizadoras. Cada documento traz a fonte de onde veio; o edital da
            edição continua sendo a referência oficial.
          </p>
        </div>
        <div className="sm:justify-self-end">
          <nav aria-label="Rodapé">
            <ul className="space-y-2 text-[15px]">
              <li>
                <Link href="/acervo" className="hover:text-papel">
                  Acervo
                </Link>
              </li>
              <li>
                <Link href="/selecoes" className="hover:text-papel">
                  Seleções
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-papel">
                  Sobre, contato e privacidade
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-grafite-700">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-grafite-300 sm:px-6">
          Nome provisório. Acervo em curadoria — publicamos apenas o que já foi
          conferido.
        </p>
      </div>
    </footer>
  );
}
