"use client";

import { useState } from "react";

/**
 * Visualização do PDF sob demanda.
 *
 * O arquivo só é carregado quando a pessoa pede — em conexão de celular, abrir
 * um caderno de questões inteiro sem querer custa caro. O visualizador é o do
 * próprio navegador, com seus controles; quando ele não abre, os links de
 * origem e download continuam valendo.
 */
export function VisualizadorPdf({
  arquivo,
  titulo,
}: {
  arquivo: string;
  titulo: string;
}) {
  const [aberto, setAberto] = useState(false);

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="w-full rounded-sm border border-dashed border-grafite-300 bg-white px-5 py-10 text-center transition-colors hover:border-oliva-500 hover:bg-oliva-100"
      >
        <span className="display block text-xl text-grafite-900">
          Ver o documento aqui
        </span>
        <span className="mt-1 block text-[15px] text-grafite-600">
          O arquivo só é baixado quando você abre.
        </span>
      </button>
    );
  }

  return (
    <figure className="overflow-hidden rounded-sm border border-grafite-200 bg-white">
      <iframe
        src={arquivo}
        title={`Documento: ${titulo}`}
        className="h-[70vh] min-h-96 w-full"
      />
      <figcaption className="border-t border-grafite-200 px-4 py-3 text-[14px] text-grafite-600">
        Não conseguiu ler aqui?{" "}
        <a
          href={arquivo}
          target="_blank"
          rel="noreferrer noopener"
          className="text-oliva-700 underline underline-offset-4 hover:text-grafite-900"
        >
          Abra o PDF em outra aba
        </a>
        .
      </figcaption>
    </figure>
  );
}
