import Link from "next/link";
import { Dado, Etiqueta } from "@/components/etiqueta";
import { buscarSelecao } from "@/lib/selecoes";
import { formatarTamanho, rotuloEdicao, rotuloTipo } from "@/lib/texto";
import type { Material } from "@/lib/tipos";

/**
 * Ícone por tipo de documento. Vem junto do texto do tipo: o tipo nunca é
 * distinguido só por cor ou só por forma.
 */
function IconeTipo({ tipo }: { tipo: Material["tipo"] }) {
  const traco =
    tipo === "gabarito"
      ? "M4 9.5 L7.5 13 L14 5"
      : tipo === "edital"
        ? "M4 4 h10 M4 8 h10 M4 12 h6"
        : tipo === "informacao"
          ? "M9 5 v0.5 M9 8 v5"
          : "M4 4 h10 M4 8 h10 M4 12 h10";
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-grafite-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d={traco} />
    </svg>
  );
}

function LinhaMaterial({ material }: { material: Material }) {
  const selecao = buscarSelecao(material.selecao);
  const tamanho = formatarTamanho(material.bytes);
  const hospedado = material.situacaoUso === "hospedagem_conferida";

  return (
    <li className="regua first:border-t-0">
      <Link
        href={`/material/${material.id}`}
        className="group block px-1 py-4 transition-colors hover:bg-oliva-100/60"
      >
        <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
          <span className="flex items-center gap-1.5">
            <IconeTipo tipo={material.tipo} />
            <Etiqueta tom="neutro">{rotuloTipo(material.tipo)}</Etiqueta>
          </span>
          <h3 className="min-w-0 flex-1 text-[17px] leading-snug font-medium text-grafite-900 group-hover:text-oliva-700">
            {material.titulo}
          </h3>
          <Etiqueta tom={hospedado ? "disponivel" : "referencia"}>
            {hospedado ? "Arquivo aqui" : "Na fonte"}
          </Etiqueta>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 pl-1">
          {selecao && <Dado rotulo="Seleção">{selecao.sigla}</Dado>}
          <Dado rotulo="Edição">{rotuloEdicao(material.edicao)}</Dado>
          {material.fase && <Dado rotulo="Fase">{material.fase}</Dado>}
          {material.caderno && <Dado rotulo="Caderno">{material.caderno}</Dado>}
          {material.paginas !== null && (
            <Dado rotulo="Páginas">{material.paginas}</Dado>
          )}
          {tamanho && <Dado rotulo="Tamanho">{tamanho}</Dado>}
          <Dado rotulo="Fonte">{material.fonte.rotulo}</Dado>
          {material.gabaritoId && (
            <span className="text-[14px] font-medium text-oliva-700">
              Gabarito disponível
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}

export function ListaMateriais({ materiais }: { materiais: Material[] }) {
  return (
    <ul className="border-b border-grafite-200">
      {materiais.map((material) => (
        <LinhaMaterial key={material.id} material={material} />
      ))}
    </ul>
  );
}
