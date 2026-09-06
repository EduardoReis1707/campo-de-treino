"use client";

import { useRef, useState } from "react";
import { PARAMS } from "@/lib/consulta-url";
import type { Filtros } from "@/lib/acervo";
import { rotuloEdicao, rotuloTipo } from "@/lib/texto";
import type { Selecao, TipoMaterial } from "@/lib/tipos";

type Opcoes = {
  selecoes: Selecao[];
  edicoes: string[];
  tipos: TipoMaterial[];
  disciplinas: string[];
};

function Grupo({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="regua pt-4">
      <legend className="mb-2 text-[15px] font-semibold text-grafite-900">
        {titulo}
      </legend>
      <div className="space-y-1.5">{children}</div>
    </fieldset>
  );
}

function Caixa({
  name,
  value,
  rotulo,
  marcado,
}: {
  name: string;
  value: string;
  rotulo: string;
  marcado: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[15px] text-grafite-600 hover:text-grafite-900">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={marcado}
        className="size-4 shrink-0 accent-oliva-600"
      />
      {rotulo}
    </label>
  );
}

/**
 * Filtros do catálogo. É um formulário GET: o estado vive na URL, então a
 * página funciona com link compartilhado, botão voltar e sem JavaScript.
 * Com JavaScript, marcar uma caixa já reenvia o formulário.
 */
export function FiltrosAcervo({
  filtros,
  opcoes,
  totalAtivos,
}: {
  filtros: Filtros;
  opcoes: Opcoes;
  totalAtivos: number;
}) {
  const [aberto, setAberto] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  /** Reenvia ao marcar uma caixa ou trocar a ordenação — nunca a cada tecla digitada. */
  const enviarAoMudar = (evento: React.ChangeEvent<HTMLFormElement>) => {
    const alvo = evento.target;
    const ehControleDeFiltro =
      alvo instanceof HTMLSelectElement ||
      (alvo instanceof HTMLInputElement && alvo.type === "checkbox");
    if (ehControleDeFiltro) form.current?.requestSubmit();
  };

  return (
    <form
      ref={form}
      action="/acervo"
      method="get"
      className="lg:sticky lg:top-20"
      onChange={enviarAoMudar}
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="busca" className="sr-only">
            Buscar no acervo
          </label>
          <input
            id="busca"
            type="search"
            name={PARAMS.busca}
            defaultValue={filtros.busca}
            placeholder="Buscar por sigla, matéria ou ano"
            className="w-full rounded-sm border border-grafite-300 bg-white px-3.5 py-2.5 text-[16px] text-grafite-900 placeholder:text-grafite-300"
          />
        </div>
        <button
          type="submit"
          className="rounded-sm bg-grafite-900 px-4 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
        >
          Buscar
        </button>
      </div>

      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls="painel-filtros"
        className="mt-3 w-full rounded-sm border border-grafite-300 px-3.5 py-2.5 text-left text-[15px] font-medium text-grafite-700 lg:hidden"
      >
        {aberto ? "Ocultar filtros" : "Mostrar filtros"}
        {totalAtivos > 0 && (
          <span className="ml-2 rounded-sm bg-oliva-100 px-1.5 py-0.5 text-[13px] text-oliva-700">
            {totalAtivos}
          </span>
        )}
      </button>

      <div
        id="painel-filtros"
        className={`${aberto ? "block" : "hidden"} mt-5 space-y-5 lg:block`}
      >
        <div className="regua pt-4">
          <label
            htmlFor="ordem"
            className="mb-2 block text-[15px] font-semibold text-grafite-900"
          >
            Ordenar
          </label>
          <select
            id="ordem"
            name={PARAMS.ordem}
            defaultValue={filtros.ordenacao}
            className="w-full rounded-sm border border-grafite-300 bg-white px-3 py-2 text-[15px]"
          >
            <option value="recentes">Edição mais recente</option>
            <option value="antigos">Edição mais antiga</option>
            <option value="titulo">Título (A–Z)</option>
          </select>
        </div>

        <Grupo titulo="Seleção">
          {opcoes.selecoes.map((s) => (
            <Caixa
              key={s.slug}
              name={PARAMS.selecao}
              value={s.slug}
              rotulo={s.sigla}
              marcado={filtros.selecoes.includes(s.slug)}
            />
          ))}
        </Grupo>

        <Grupo titulo="Tipo de material">
          {opcoes.tipos.map((t) => (
            <Caixa
              key={t}
              name={PARAMS.tipo}
              value={t}
              rotulo={rotuloTipo(t)}
              marcado={filtros.tipos.includes(t)}
            />
          ))}
        </Grupo>

        <Grupo titulo="Edição">
          {opcoes.edicoes.map((e) => (
            <Caixa
              key={e}
              name={PARAMS.edicao}
              value={e}
              rotulo={rotuloEdicao(e)}
              marcado={filtros.edicoes.includes(e)}
            />
          ))}
        </Grupo>

        {opcoes.disciplinas.length > 0 && (
          <Grupo titulo="Disciplina">
            {opcoes.disciplinas.map((d) => (
              <Caixa
                key={d}
                name={PARAMS.disciplina}
                value={d}
                rotulo={d}
                marcado={filtros.disciplinas.includes(d)}
              />
            ))}
          </Grupo>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            className="rounded-sm bg-grafite-900 px-4 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
          >
            Aplicar filtros
          </button>
          {totalAtivos > 0 && (
            <a
              href="/acervo"
              className="rounded-sm border border-grafite-300 px-4 py-2.5 text-[15px] font-medium text-grafite-700 hover:border-grafite-500"
            >
              Limpar filtros
            </a>
          )}
        </div>
      </div>
    </form>
  );
}
