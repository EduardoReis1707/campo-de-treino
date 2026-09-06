import type { Metadata } from "next";
import Link from "next/link";
import { lote, todosMateriais } from "@/lib/acervo";

export const metadata: Metadata = {
  title: "Sobre, contato e privacidade",
  description:
    "O que é o Campo de Treino, como o acervo é conferido, como falar com a curadoria e quais dados o site coleta.",
};

export default function Sobre() {
  const materiais = todosMateriais();
  const hospedados = materiais.filter((m) => m.arquivo).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="display text-4xl sm:text-5xl">Sobre o Campo de Treino</h1>

      <div className="mt-8 space-y-10 leading-relaxed text-grafite-700">
        <section>
          <p>
            Campo de Treino reúne editais, provas anteriores e gabaritos das
            seleções militares brasileiras em um lugar só, com a fonte de cada
            documento à vista. O acesso é gratuito e não exige cadastro.
          </p>
          <p className="mt-4">
            A plataforma é independente. Não temos vínculo com as Forças Armadas,
            com as instituições de ensino nem com as bancas organizadoras, e não
            representamos nenhuma delas. Para inscrição, prazos e requisitos, o
            edital vigente publicado pela instituição é a única referência
            válida.
          </p>
        </section>

        <section>
          <h2 className="display text-2xl text-grafite-900">Como o acervo é montado</h2>
          <p className="mt-3">
            Publicamos por lotes. Cada documento passa por uma conferência antes
            de entrar: de onde veio, a que edição pertence e se a cópia pode ser
            hospedada aqui. {lote()}
          </p>
          <p className="mt-4">
            Hoje há {materiais.length} documentos publicados, dos quais{" "}
            {hospedados} têm cópia hospedada nesta plataforma. Os demais aparecem
            apenas com os dados do documento e o caminho até a origem — quando a
            cópia é de terceiros e a permissão para republicar não foi
            verificada, não hospedamos o arquivo.
          </p>
          <p className="mt-4">
            O acervo não está completo e não pretende parecer completo. Faltam
            seleções, edições e retificações. Anos podem indicar aplicação ou
            ingresso, conforme a fonte; quando os dois aparecem, a ficha do
            documento diz qual é qual.
          </p>
        </section>

        <section id="contato" className="scroll-mt-24">
          <h2 className="display text-2xl text-grafite-900">Contato</h2>
          <p className="mt-3">
            Encontrou um documento trocado, um vínculo errado entre prova e
            gabarito, ou um material que não deveria estar aqui? A curadoria
            quer saber.
          </p>
          <p className="mt-4 rounded-sm bg-oliva-100 p-4 text-grafite-700">
            O canal de contato ainda será definido e publicado aqui antes de o
            site ir ao ar. Enquanto isso, nenhum formulário é exibido — preferimos
            não oferecer um botão que não funciona.
          </p>
        </section>

        <section>
          <h2 className="display text-2xl text-grafite-900">Privacidade</h2>
          <p className="mt-3">
            Navegar pelo acervo não exige conta, login nem cadastro, e o site não
            pede dados pessoais para mostrar um documento. Não usamos formulários
            de captura nem exibimos anúncios.
          </p>
          <p className="mt-4">
            As contas existem apenas para a equipe de curadoria, em uma área
            separada do acervo público. Se no futuro passarmos a medir uso do
            site, esta página será atualizada antes, dizendo o que é medido e por
            quê.
          </p>
        </section>

        <section>
          <h2 className="display text-2xl text-grafite-900">Direitos de uso</h2>
          <p className="mt-3">
            Editais, provas e gabaritos são documentos das instituições e bancas
            que os publicaram. Reunimos e organizamos essas referências para
            estudo, sem alterar o conteúdo dos arquivos. Se você é responsável
            por um material e quer que ele saia daqui ou apareça de outra forma,
            entre em contato.
          </p>
        </section>
      </div>

      <p className="mt-12">
        <Link
          href="/acervo"
          className="inline-block rounded-sm bg-grafite-900 px-5 py-2.5 text-[15px] font-medium text-papel hover:bg-grafite-700"
        >
          Ir para o acervo
        </Link>
      </p>
    </div>
  );
}
