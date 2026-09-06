import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Etiqueta } from "@/components/etiqueta";
import { ListaMateriais } from "@/components/lista-materiais";
import { VisualizadorPdf } from "@/components/visualizador-pdf";
import {
  buscarMaterial,
  gabaritoDe,
  provasDe,
  relacionados,
  todosMateriais,
} from "@/lib/acervo";
import { buscarSelecao } from "@/lib/selecoes";
import {
  formatarData,
  formatarTamanho,
  rotuloEdicao,
  rotuloSituacao,
  rotuloTipo,
} from "@/lib/texto";
import type { Material } from "@/lib/tipos";

export function generateStaticParams() {
  return todosMateriais().map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/material/[id]">): Promise<Metadata> {
  const { id } = await params;
  const material = buscarMaterial(id);
  if (!material) return {};
  const selecao = buscarSelecao(material.selecao);
  return {
    title: material.titulo,
    description: `${rotuloTipo(material.tipo)} de ${selecao?.nome ?? material.selecao}, edição ${rotuloEdicao(material.edicao)}. Fonte: ${material.fonte.rotulo}.`,
  };
}

function Ficha({ material }: { material: Material }) {
  const selecao = buscarSelecao(material.selecao);
  const tamanho = formatarTamanho(material.bytes);

  const linhas: { rotulo: string; valor: React.ReactNode }[] = [
    {
      rotulo: "Seleção",
      valor: selecao ? (
        <Link
          href={`/selecoes/${selecao.slug}`}
          className="text-oliva-700 underline underline-offset-4 hover:text-grafite-900"
        >
          {selecao.sigla} — {selecao.nome}
        </Link>
      ) : (
        material.selecao
      ),
    },
    { rotulo: "Edição", valor: rotuloEdicao(material.edicao) },
    { rotulo: "Tipo", valor: rotuloTipo(material.tipo) },
  ];

  if (material.anoAplicacao && material.anoIngresso) {
    linhas.push({
      rotulo: "Anos",
      valor: `Aplicação em ${material.anoAplicacao}, ingresso em ${material.anoIngresso}, conforme a fonte`,
    });
  }
  if (material.fase) linhas.push({ rotulo: "Fase", valor: material.fase });
  if (material.caderno) linhas.push({ rotulo: "Caderno", valor: material.caderno });
  if (material.disciplinas.length) {
    linhas.push({ rotulo: "Disciplinas", valor: material.disciplinas.join(", ") });
  }
  linhas.push({
    rotulo: "Páginas",
    valor: material.paginas ?? "Não informado",
  });
  linhas.push({ rotulo: "Tamanho", valor: tamanho ?? "Não informado" });
  linhas.push({
    rotulo: "Fonte",
    valor: (
      <a
        href={material.fonte.pagina || material.fonte.url}
        target="_blank"
        rel="noreferrer noopener"
        className="break-words text-oliva-700 underline underline-offset-4 hover:text-grafite-900"
      >
        {material.fonte.rotulo}
      </a>
    ),
  });
  linhas.push({
    rotulo: "Situação de uso",
    valor: rotuloSituacao(material.situacaoUso),
  });
  linhas.push({
    rotulo: "Conferido em",
    valor: formatarData(material.dataConferencia),
  });

  return (
    <dl className="text-[15px]">
      {linhas.map((linha) => (
        <div
          key={linha.rotulo}
          className="regua grid grid-cols-[7.5rem_1fr] gap-3 py-2.5 sm:grid-cols-[9rem_1fr]"
        >
          <dt className="text-grafite-500">{linha.rotulo}</dt>
          <dd className="text-grafite-900">{linha.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function PaginaMaterial({ params }: PageProps<"/material/[id]">) {
  const { id } = await params;
  const material = buscarMaterial(id);
  if (!material) notFound();

  const selecao = buscarSelecao(material.selecao);
  const gabarito = gabaritoDe(material);
  const provas = provasDe(material);
  const outros = relacionados(material);
  // "Hospedado" é o fato técnico (o arquivo abre aqui); a verificação de
  // permissão é um dado à parte, mostrado na etiqueta e na ficha.
  const hospedado = Boolean(material.arquivo);
  const permissaoAConfirmar = material.situacaoUso === "a_confirmar";
  const ehProva = material.tipo === "prova" || material.tipo === "prova_e_gabarito";
  const avisos = permissaoAConfirmar
    ? [
        "Esta cópia é de terceiros e foi hospedada por decisão da curadoria antes da confirmação da permissão de republicação.",
        ...material.notas,
      ]
    : material.notas;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <nav aria-label="Trilha" className="text-[15px] text-grafite-500">
        <Link href="/acervo" className="hover:text-grafite-900">
          Acervo
        </Link>
        <span className="px-2 text-grafite-300">/</span>
        {selecao && (
          <>
            <Link
              href={`/selecoes/${selecao.slug}`}
              className="hover:text-grafite-900"
            >
              {selecao.sigla}
            </Link>
            <span className="px-2 text-grafite-300">/</span>
          </>
        )}
        <span className="text-grafite-900">{rotuloEdicao(material.edicao)}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Etiqueta tom="tipo">{rotuloTipo(material.tipo)}</Etiqueta>
          <Etiqueta tom={hospedado ? "disponivel" : "referencia"}>
            {hospedado ? "Arquivo disponível aqui" : "Disponível na fonte"}
          </Etiqueta>
          {permissaoAConfirmar && (
            <Etiqueta tom="referencia">Permissão de uso a confirmar</Etiqueta>
          )}
        </div>
        <h1 className="display mt-4 text-4xl sm:text-5xl">{material.titulo}</h1>
      </header>

      {avisos.length > 0 && (
        <div className="mt-6 max-w-3xl rounded-sm bg-oliva-100 p-4">
          <h2 className="text-[15px] font-semibold text-oliva-700">
            Observação da curadoria
          </h2>
          <ul className="mt-1 space-y-1 text-[15px] leading-relaxed text-grafite-700">
            {avisos.map((nota) => (
              <li key={nota}>{nota}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div>
          {hospedado && material.arquivo ? (
            <>
              <VisualizadorPdf arquivo={material.arquivo} titulo={material.titulo} />
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={material.arquivo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-sm bg-grafite-900 px-5 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
                >
                  Abrir em nova aba
                </a>
                <a
                  href={material.arquivo}
                  download
                  className="rounded-sm border border-grafite-300 px-5 py-2.5 text-[15px] font-medium text-grafite-700 hover:border-grafite-500"
                >
                  Baixar o PDF
                </a>
                <a
                  href={material.fonte.pagina || material.fonte.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-sm border border-grafite-300 px-5 py-2.5 text-[15px] font-medium text-grafite-700 hover:border-grafite-500"
                >
                  Ir à fonte original
                </a>
              </div>
            </>
          ) : (
            <div className="rounded-sm border border-grafite-200 bg-white px-5 py-8">
              <h2 className="display text-2xl">
                Este arquivo não está hospedado aqui
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-grafite-600">
                A cópia que localizamos é de terceiros e a permissão para
                republicar ainda não foi verificada. Registramos os dados do
                documento e o caminho até a origem, onde ele pode ser aberto.
              </p>
              <a
                href={material.fonte.pagina || material.fonte.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-block rounded-sm bg-grafite-900 px-5 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
              >
                Abrir na fonte: {material.fonte.rotulo}
              </a>
            </div>
          )}

          {/* Vínculo prova ↔ gabarito, incluindo a ausência quando é o caso. */}
          <section className="mt-10">
            <h2 className="display text-2xl">
              {material.tipo === "gabarito" ? "Provas correspondentes" : "Gabarito"}
            </h2>
            {material.tipo === "gabarito" ? (
              provas.length > 0 ? (
                <div className="mt-3">
                  <ListaMateriais materiais={provas} />
                </div>
              ) : (
                <p className="mt-3 max-w-lg leading-relaxed text-grafite-600">
                  A prova correspondente ainda não está no acervo.
                </p>
              )
            ) : gabarito ? (
              <div className="mt-3">
                <ListaMateriais materiais={[gabarito]} />
              </div>
            ) : (
              <p className="mt-3 max-w-lg leading-relaxed text-grafite-600">
                {ehProva
                  ? "Não localizamos o gabarito desta prova. Quando ele for conferido, aparece aqui."
                  : "Não se aplica a este tipo de documento."}
              </p>
            )}
          </section>

          {outros.length > 0 && (
            <section className="mt-10">
              <h2 className="display text-2xl">
                Outros documentos desta edição
              </h2>
              <div className="mt-3">
                <ListaMateriais materiais={outros} />
              </div>
            </section>
          )}
        </div>

        <aside>
          <h2 className="display text-xl">Ficha do documento</h2>
          <div className="mt-3">
            <Ficha material={material} />
          </div>
          <p className="mt-5 text-[14px] leading-relaxed text-grafite-500">
            Encontrou algo errado neste documento?{" "}
            <Link
              href="/sobre#contato"
              className="text-oliva-700 underline underline-offset-4 hover:text-grafite-900"
            >
              Fale com a curadoria
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
