import Link from "next/link";
import { Marca } from "@/components/marca";

const NAVEGACAO = [
  { href: "/", rotulo: "Início" },
  { href: "/selecoes", rotulo: "Seleções" },
  { href: "/acervo", rotulo: "Acervo" },
];

/**
 * Topo do site. Os três destinos ficam sempre visíveis, inclusive no celular —
 * sem menu escondido atrás de um botão.
 */
export function Cabecalho() {
  return (
    <header className="sticky top-0 z-40 bg-grafite-900 text-papel">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="Campo de Treino, página inicial">
          <Marca />
        </Link>
        <nav aria-label="Principal">
          <ul className="flex items-center gap-0.5 text-[14px] sm:gap-2 sm:text-[15px]">
            {NAVEGACAO.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded px-2 py-1.5 text-grafite-200 transition-colors hover:bg-grafite-700 hover:text-papel sm:px-3"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
