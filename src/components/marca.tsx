/**
 * Logotipo. O sinal são três divisas ascendentes — vocabulário de graduação
 * militar — seguidas do nome em condensado.
 */
export function Marca({ tom = "claro" }: { tom?: "claro" | "escuro" }) {
  const cor = tom === "claro" ? "text-papel" : "text-grafite-900";
  const divisa = tom === "claro" ? "text-oliva-400" : "text-oliva-600";
  return (
    <span className={`flex items-center gap-2.5 ${cor}`}>
      <svg
        viewBox="0 0 20 16"
        aria-hidden="true"
        className={`h-4 w-5 shrink-0 ${divisa}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
      >
        <path d="M2 13 L10 7 L18 13" />
        <path d="M2 8.5 L10 2.5 L18 8.5" opacity="0.55" />
      </svg>
      <span className="display text-[16px] tracking-[0.05em] uppercase sm:text-[19px] sm:tracking-[0.06em]">
        Campo de Treino
      </span>
    </span>
  );
}
