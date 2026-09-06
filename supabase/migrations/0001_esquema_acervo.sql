-- Campo de Treino — esquema do acervo e da curadoria.
--
-- ESTA MIGRAÇÃO AINDA NÃO FOI APLICADA. O marco 1 roda com o JSON gerado por
-- scripts/gerar-acervo.mjs; o esquema fica pronto aqui para o marco 2, que
-- traz administração, curadoria e upload de arquivos.
--
-- Decisões que este arquivo assume:
--   * permissão é aplicada no banco (RLS), não só na aplicação;
--   * rascunho não vaza: nem por consulta nem por acesso direto ao arquivo;
--   * toda alteração de material fica registrada.

create type public.papel_usuario as enum ('editor', 'administrador');
create type public.situacao_material as enum ('rascunho', 'em_revisao', 'publicado', 'arquivado');
create type public.tipo_material as enum ('edital', 'prova', 'gabarito', 'prova_e_gabarito', 'informacao');
create type public.situacao_uso as enum ('hospedagem_conferida', 'somente_referencia', 'a_confirmar');
create type public.tipo_vinculo as enum ('gabarito_de', 'retificacao_de', 'versao_de');
create type public.grupo_escolar as enum ('ensino_medio', 'pos_ensino_medio');

-- --------------------------------------------------------------------------
-- Equipe interna
-- --------------------------------------------------------------------------

create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  papel public.papel_usuario not null default 'editor',
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create function public.e_da_equipe() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfis p where p.id = auth.uid() and p.ativo);
$$;

create function public.e_administrador() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.perfis p
    where p.id = auth.uid() and p.ativo and p.papel = 'administrador'
  );
$$;

-- --------------------------------------------------------------------------
-- Catálogo
-- --------------------------------------------------------------------------

create table public.selecoes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sigla text not null,
  nome text not null,
  forcas text[] not null default '{}',
  grupo public.grupo_escolar not null,
  resumo text not null default '',
  escolaridade_exigida text,
  formacao_oferecida text,
  site_oficial text,
  observacoes text[] not null default '{}',
  atualizado_em timestamptz not null default now()
);

-- Uma edição do concurso. Ano de aplicação e de ingresso podem divergir.
create table public.edicoes (
  id uuid primary key default gen_random_uuid(),
  selecao_id uuid not null references public.selecoes (id) on delete cascade,
  rotulo text not null,
  ano_aplicacao int,
  ano_ingresso int,
  modalidade text,
  unique (selecao_id, rotulo, modalidade)
);

create table public.disciplinas (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique
);

create table public.assuntos (
  id uuid primary key default gen_random_uuid(),
  disciplina_id uuid not null references public.disciplinas (id) on delete cascade,
  nome text not null,
  unique (disciplina_id, nome)
);

-- Origem do documento e a permissão de uso conferida para ela.
create table public.fontes (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  pagina_origem text,
  rotulo text not null,
  oficial boolean not null default false,
  autor text,
  licenca text,
  autorizacao text,
  conferida_em date,
  conferida_por uuid references public.perfis (id)
);

create table public.materiais (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  selecao_id uuid not null references public.selecoes (id) on delete restrict,
  edicao_id uuid references public.edicoes (id) on delete set null,
  fonte_id uuid references public.fontes (id) on delete set null,
  titulo text not null,
  tipo public.tipo_material not null,
  fase text,
  caderno text,
  paginas int,
  bytes bigint,
  sha256 text,
  situacao public.situacao_material not null default 'rascunho',
  situacao_uso public.situacao_uso not null default 'a_confirmar',
  -- Caminho no bucket privado; a leitura pública passa por URL assinada.
  arquivo_caminho text,
  notas text[] not null default '{}',
  data_conferencia date,
  publicado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  -- Um material publicado precisa ter fonte e data de conferência registradas,
  -- mesmo quando a permissão de uso (situacao_uso) ainda está a confirmar —
  -- decisão do produto em 06/09/2026: cópia de terceiros pode ser hospedada
  -- antes de a permissão ser confirmada, desde que a curadoria saiba a fonte.
  constraint publicado_tem_procedencia check (
    situacao <> 'publicado'
    or (fonte_id is not null and data_conferencia is not null)
  ),
  -- Arquivo só é hospedado com a fonte pelo menos verificada como sendo
  -- oficial ou uma cópia identificada; nunca com situação "a_confirmar" no
  -- sentido de fonte desconhecida (esse enum não cobre "fonte desconhecida" —
  -- a_confirmar aqui é sempre "sabemos de onde veio, falta confirmar direito
  -- de republicar").
  constraint arquivo_precisa_de_fonte check (
    arquivo_caminho is null or fonte_id is not null
  )
);

create index materiais_publicados_idx
  on public.materiais (selecao_id, tipo)
  where situacao = 'publicado';

create table public.materiais_disciplinas (
  material_id uuid not null references public.materiais (id) on delete cascade,
  disciplina_id uuid not null references public.disciplinas (id) on delete cascade,
  primary key (material_id, disciplina_id)
);

create table public.materiais_assuntos (
  material_id uuid not null references public.materiais (id) on delete cascade,
  assunto_id uuid not null references public.assuntos (id) on delete cascade,
  primary key (material_id, assunto_id)
);

-- Prova ↔ gabarito, retificação ↔ edital, versões/cadernos de uma mesma prova.
create table public.vinculos (
  id uuid primary key default gen_random_uuid(),
  origem_id uuid not null references public.materiais (id) on delete cascade,
  destino_id uuid not null references public.materiais (id) on delete cascade,
  tipo public.tipo_vinculo not null,
  observacao text,
  unique (origem_id, destino_id, tipo),
  constraint sem_autovinculo check (origem_id <> destino_id)
);

-- --------------------------------------------------------------------------
-- Curadoria: histórico e relatos
-- --------------------------------------------------------------------------

create table public.alteracoes (
  id bigserial primary key,
  material_id uuid references public.materiais (id) on delete set null,
  autor_id uuid references public.perfis (id) on delete set null,
  acao text not null,
  antes jsonb,
  depois jsonb,
  criado_em timestamptz not null default now()
);

create table public.relatos (
  id bigserial primary key,
  material_id uuid references public.materiais (id) on delete set null,
  categoria text not null,
  comentario text not null,
  resolvido boolean not null default false,
  resolvido_por uuid references public.perfis (id),
  criado_em timestamptz not null default now()
);

-- --------------------------------------------------------------------------
-- Permissões
-- --------------------------------------------------------------------------

alter table public.perfis enable row level security;
alter table public.selecoes enable row level security;
alter table public.edicoes enable row level security;
alter table public.disciplinas enable row level security;
alter table public.assuntos enable row level security;
alter table public.fontes enable row level security;
alter table public.materiais enable row level security;
alter table public.materiais_disciplinas enable row level security;
alter table public.materiais_assuntos enable row level security;
alter table public.vinculos enable row level security;
alter table public.alteracoes enable row level security;
alter table public.relatos enable row level security;

-- Visitante lê o catálogo, mas só enxerga material publicado.
create policy "catalogo publico" on public.selecoes for select using (true);
create policy "catalogo publico" on public.edicoes for select using (true);
create policy "catalogo publico" on public.disciplinas for select using (true);
create policy "catalogo publico" on public.assuntos for select using (true);
create policy "catalogo publico" on public.fontes for select using (true);

create policy "somente material publicado" on public.materiais
  for select using (situacao = 'publicado' or public.e_da_equipe());

create policy "vinculos de material publicado" on public.vinculos
  for select using (
    public.e_da_equipe()
    or exists (
      select 1 from public.materiais m
      where m.id = vinculos.origem_id and m.situacao = 'publicado'
    )
  );

create policy "disciplinas de material publicado" on public.materiais_disciplinas
  for select using (
    public.e_da_equipe()
    or exists (
      select 1 from public.materiais m
      where m.id = materiais_disciplinas.material_id and m.situacao = 'publicado'
    )
  );

create policy "assuntos de material publicado" on public.materiais_assuntos
  for select using (
    public.e_da_equipe()
    or exists (
      select 1 from public.materiais m
      where m.id = materiais_assuntos.material_id and m.situacao = 'publicado'
    )
  );

-- Editor cadastra e revisa; publicar e arquivar é do administrador.
create policy "equipe cadastra" on public.materiais
  for insert to authenticated with check (public.e_da_equipe());

create policy "equipe edita rascunho" on public.materiais
  for update to authenticated
  using (public.e_da_equipe())
  with check (
    public.e_administrador()
    or situacao in ('rascunho', 'em_revisao')
  );

create policy "so administrador remove" on public.materiais
  for delete to authenticated using (public.e_administrador());

-- Relato de problema é anônimo na entrada e interno na leitura.
create policy "qualquer um relata" on public.relatos for insert with check (true);
create policy "equipe le relatos" on public.relatos
  for select to authenticated using (public.e_da_equipe());
create policy "equipe resolve relatos" on public.relatos
  for update to authenticated using (public.e_da_equipe());

create policy "equipe le historico" on public.alteracoes
  for select to authenticated using (public.e_da_equipe());

create policy "cada um le seu perfil" on public.perfis
  for select to authenticated using (id = auth.uid() or public.e_administrador());
create policy "administrador gerencia perfis" on public.perfis
  for all to authenticated using (public.e_administrador()) with check (public.e_administrador());

-- --------------------------------------------------------------------------
-- Arquivos
-- --------------------------------------------------------------------------
-- Bucket privado: nem rascunho nem publicado ficam acessíveis por URL direta.
-- A aplicação serve o PDF publicado por URL assinada de curta duração.

insert into storage.buckets (id, name, public)
values ('acervo', 'acervo', false)
on conflict (id) do nothing;

create policy "equipe envia arquivo" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'acervo' and public.e_da_equipe());

create policy "equipe le arquivo" on storage.objects
  for select to authenticated
  using (bucket_id = 'acervo' and public.e_da_equipe());

create policy "administrador remove arquivo" on storage.objects
  for delete to authenticated
  using (bucket_id = 'acervo' and public.e_administrador());
