import type { ReactNode } from "react";

type Tom = "tipo" | "disponivel" | "referencia" | "neutro";

const TONS: Record<Tom, string> = {
  tipo: "bg-grafite-900 text-papel",
  disponivel: "bg-oliva-100 text-oliva-700",
  referencia: "border border-grafite-300 text-grafite-600",
  neutro: "bg-grafite-100 text-grafite-600",
};

/** Marcador curto de estado ou categoria. */
export function Etiqueta({
  tom = "neutro",
  children,
}: {
  tom?: Tom;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-sm px-2 py-0.5 text-[13px] leading-5 font-medium ${TONS[tom]}`}
    >
      {children}
    </span>
  );
}

/** Par rótulo/valor usado nas linhas de metadados dos documentos. */
export function Dado({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <span className="text-[14px] text-grafite-500">
      <span className="text-grafite-300">{rotulo}</span>{" "}
      <span className="text-grafite-600">{children}</span>
    </span>
  );
}
