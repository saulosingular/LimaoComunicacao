-- ============================================================
-- ComunicacaoVisual — Schema Supabase (Multi-Empresa / SaaS)
-- Gerado em: 2026-03-03
-- ============================================================
-- Ordem de criação respeita dependências (FK ordering)
-- RLS habilitado em todas as tabelas de negócio
-- ============================================================

-- ============================================================
-- BLOCO 0 — EXTENSÕES
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- BLOCO 1 — EMPRESAS (Tenant raiz do SaaS)
-- ============================================================
create table public.empresas (
  id          uuid primary key default uuid_generate_v4(),
  nome        text not null,
  cnpj        text unique,
  email       text,
  telefone    text,
  logo_url    text,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.empresas is 'Tenants do SaaS — cada empresa cadastrada na plataforma.';


-- ============================================================
-- BLOCO 2 — USUÁRIOS (Tabela auxiliar ligada ao auth.users)
-- ============================================================
create table public.usuarios (
  id          uuid primary key references auth.users(id) on delete cascade,
  empresa_id  uuid not null references public.empresas(id) on delete cascade,
  nome        text not null,
  cargo       text not null check (cargo in ('ADMIN', 'COMERCIAL', 'PRODUCAO', 'FINANCEIRO', 'VISUALIZADOR')),
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.usuarios is 'Perfil e cargo dos usuários, vinculado ao auth.users do Supabase.';

create index idx_usuarios_empresa on public.usuarios(empresa_id);


-- ============================================================
-- BLOCO 3 — CLIENTES
-- ============================================================
create table public.clientes (
  id            uuid primary key default uuid_generate_v4(),
  empresa_id    uuid not null references public.empresas(id) on delete cascade,
  nome          text not null,
  whatsapp      text,
  email         text,
  cpf_cnpj      text,
  tipo_pessoa   text check (tipo_pessoa in ('PF', 'PJ')),
  -- Endereço
  logradouro    text,
  numero        text,
  complemento   text,
  bairro        text,
  cidade        text,
  estado        char(2),
  cep           text,
  -- Origem / CRM
  origem        text,  -- Ex: 'Instagram', 'Indicação', 'Google'
  observacoes   text,
  ativo         boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.clientes is 'Carteira de clientes da empresa (PF ou PJ).';

create index idx_clientes_empresa on public.clientes(empresa_id);
create index idx_clientes_nome    on public.clientes(empresa_id, nome);


-- ============================================================
-- BLOCO 4 — CATEGORIAS DE MATÉRIA PRIMA
-- ============================================================
create table public.categorias_materia_prima (
  id         uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  nome       text not null,
  cor        text,  -- Cor CSS para UI (ex: '#3b82f6')
  criado_em  timestamptz not null default now()
);

comment on table public.categorias_materia_prima is 'Categorias configuráveis de matéria prima por empresa (ACM, Adesivo, Tinta…).';

-- Categorias padrão são inseridas via trigger ou seed na criação da empresa
create index idx_catmp_empresa on public.categorias_materia_prima(empresa_id);


-- ============================================================
-- BLOCO 5 — MATÉRIA PRIMA
-- ============================================================
create table public.materias_primas (
  id           uuid primary key default uuid_generate_v4(),
  empresa_id   uuid not null references public.empresas(id) on delete cascade,
  categoria_id uuid not null references public.categorias_materia_prima(id) on delete restrict,
  nome         text not null,
  descricao    text,
  preco_unidade numeric(12, 4) not null default 0,
  qtde_estoque  numeric(12, 3) not null default 0,
  unidade_medida text not null default 'UN' check (unidade_medida in ('UN', 'M2', 'ML', 'KG', 'L', 'ROLO')),
  ativo         boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.materias_primas is 'Catálogo de matéria prima com estoque e preço por unidade de medida.';

create index idx_mp_empresa    on public.materias_primas(empresa_id);
create index idx_mp_categoria  on public.materias_primas(categoria_id);


-- ============================================================
-- BLOCO 6 — TEMPLATES DE SERVIÇO
-- ============================================================
create table public.templates (
  id               uuid primary key default uuid_generate_v4(),
  empresa_id       uuid not null references public.empresas(id) on delete cascade,
  nome             text not null,
  formula_calculo  text not null check (formula_calculo in ('UN', 'M2', 'ML', 'QTDE')),
  valor_base_venda numeric(12, 2) not null default 0,
  ativo            boolean not null default true,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

comment on table public.templates is 'Templates de serviço configuráveis (Adesivo, ACM, Letra Caixa…).';

create index idx_templates_empresa on public.templates(empresa_id);


-- Add-ons: relacionamento N:N entre templates (um template pode sugerir outros como complemento)
create table public.template_addons (
  template_id uuid not null references public.templates(id) on delete cascade,
  addon_id    uuid not null references public.templates(id) on delete cascade,
  primary key (template_id, addon_id),
  constraint no_self_addon check (template_id <> addon_id)
);

comment on table public.template_addons is 'Add-ons sugeridos entre templates (ex: Fachada ACM sugere Adesivo Impresso).';


-- ============================================================
-- BLOCO 7 — SEÇÕES DE TEMPLATE
-- ============================================================
create table public.template_secoes (
  id          uuid primary key default uuid_generate_v4(),
  template_id uuid not null references public.templates(id) on delete cascade,
  nome        text not null,
  ordem       smallint not null default 0,
  criado_em   timestamptz not null default now()
);

comment on table public.template_secoes is 'Seções agrupadas dentro de cada template.';

create index idx_secoes_template on public.template_secoes(template_id);


-- ============================================================
-- BLOCO 8 — CAMPOS DE TEMPLATE
-- ============================================================
create table public.template_campos (
  id              uuid primary key default uuid_generate_v4(),
  secao_id        uuid not null references public.template_secoes(id) on delete cascade,
  titulo          text not null,
  tipo_calculo    text not null check (tipo_calculo in ('UN', 'M2', 'ML', 'QTDE', 'MULTIPLICA_TOTAL')),
  tipo_entrada    text not null check (tipo_entrada in ('SELECAO_GRUPO', 'ENTRADA_MANUAL', 'SIM_NAO', 'LISTA_OPCOES', 'TEMPLATE')),
  -- Depende do tipo_entrada
  categoria_mp_id uuid references public.categorias_materia_prima(id) on delete set null,  -- se SELECAO_GRUPO
  template_ref_id uuid references public.templates(id) on delete set null,                  -- se TEMPLATE (nested)
  valor_venda_adicional numeric(12, 2),                                                     -- se SIM_NAO ou ENTRADA_MANUAL
  -- Condicao de visibilidade
  cond_campo_referencia text,    -- titulo do campo que controla a visibilidade
  cond_valor_esperado   text,    -- valor que deve estar selecionado para mostrar este campo
  ordem               smallint not null default 0,
  criado_em           timestamptz not null default now()
);

comment on table public.template_campos is 'Campos configuráveis dentro de cada seção de template.';

create index idx_campos_secao on public.template_campos(secao_id);


-- ============================================================
-- BLOCO 9 — OPÇÕES DE LISTA DOS CAMPOS
-- ============================================================
create table public.template_campo_opcoes (
  id             uuid primary key default uuid_generate_v4(),
  campo_id       uuid not null references public.template_campos(id) on delete cascade,
  nome           text not null,
  valor_adicional numeric(12, 2) not null default 0,
  ordem          smallint not null default 0,
  criado_em      timestamptz not null default now()
);

comment on table public.template_campo_opcoes is 'Opções de seleção para campos do tipo LISTA_OPCOES.';

create index idx_opcoes_campo on public.template_campo_opcoes(campo_id);


-- ============================================================
-- BLOCO 10 — STATUS DE ORÇAMENTO / OS (Configuráveis)
-- ============================================================
create table public.status_orcamento (
  id         uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  codigo     text not null,          -- Ex: 'RASCUNHO', 'APROVADO'
  label      text not null,          -- Ex: 'Rascunho / Em Digitação'
  cor        text not null,          -- Cor CSS Ex: '#94a3b8'
  ordem      smallint not null default 0,
  criado_em  timestamptz not null default now(),
  unique (empresa_id, codigo)
);

comment on table public.status_orcamento is 'Status configuráveis do funil de OS por empresa (usados no Kanban).';

create index idx_status_empresa on public.status_orcamento(empresa_id);


-- ============================================================
-- BLOCO 11 — TIPOS DE FOLLOW-UP (Cadências)
-- ============================================================
create table public.tipos_followup (
  id         uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  nome       text not null,
  descricao  text,
  criado_em  timestamptz not null default now()
);

comment on table public.tipos_followup is 'Cadências de follow-up configuráveis por empresa (ex: Ativo 3/7/15 dias).';

create index idx_tfollowup_empresa on public.tipos_followup(empresa_id);


-- ============================================================
-- BLOCO 12 — ORÇAMENTOS / ORDENS DE SERVIÇO
-- ============================================================
create table public.orcamentos (
  id                   uuid primary key default uuid_generate_v4(),
  empresa_id           uuid not null references public.empresas(id) on delete cascade,
  cliente_id           uuid references public.clientes(id) on delete set null,
  criado_por           uuid references public.usuarios(id) on delete set null,
  -- Identificação
  numero_os            integer not null,    -- sequencial por empresa
  versao_os            char(1) not null default 'A',  -- A, B, C...
  -- Dados principais
  status_codigo        text not null,       -- FK lógica para status_orcamento.codigo
  arquivado            boolean not null default false,
  -- Datas
  data_criacao         date not null default current_date,
  data_validade        date not null,
  data_entrega         date,
  -- Financeiro
  valor_total          numeric(14, 2) not null default 0,
  condicao_pagamento   text,
  prazo_pagamento      text,
  -- Comercial / Origem
  origem_cliente       text,
  -- Follow-up
  tipo_followup_id     uuid references public.tipos_followup(id) on delete set null,
  followup_realizado   boolean not null default false,
  -- Metadados
  criado_em            timestamptz not null default now(),
  atualizado_em        timestamptz not null default now(),
  -- Garante unicidade do par (empresa, numero, versao)
  unique (empresa_id, numero_os, versao_os)
);

comment on table public.orcamentos is 'Orçamentos / Ordens de Serviço da empresa, com versionamento por letra.';

create index idx_orcamentos_empresa    on public.orcamentos(empresa_id);
create index idx_orcamentos_cliente    on public.orcamentos(cliente_id);
create index idx_orcamentos_status     on public.orcamentos(empresa_id, status_codigo);
create index idx_orcamentos_data       on public.orcamentos(empresa_id, data_criacao desc);


-- ============================================================
-- BLOCO 13 — ITENS DO ORÇAMENTO
-- ============================================================
create table public.orcamento_itens (
  id               uuid primary key default uuid_generate_v4(),
  orcamento_id     uuid not null references public.orcamentos(id) on delete cascade,
  template_id      uuid references public.templates(id) on delete set null,
  -- Snapshot do template na hora da venda
  nome_template    text not null,          -- Nome do template capturado no momento
  sequencia        smallint not null default 0,
  quantidade       numeric(12, 3) not null default 1,
  largura          numeric(10, 4),         -- Metros (M2 ou ML)
  altura           numeric(10, 4),         -- Metros (apenas M2)
  descricao        text,                   -- Detalhamento rico do serviço
  observacao       text,                   -- Notas internas / para o cliente
  -- Respostas do formulário (JSONB — chave: id do campo, valor: escolha do usuário)
  respostas        jsonb not null default '{}',
  -- Anexos (array de URLs do Supabase Storage)
  anexos           text[] not null default '{}',
  -- Financeiro calculado
  valor_total_item numeric(14, 2) not null default 0,
  criado_em        timestamptz not null default now()
);

comment on table public.orcamento_itens is 'Itens do orçamento, com respostas do template salvas como JSONB.';

create index idx_oit_orcamento on public.orcamento_itens(orcamento_id);
create index idx_oit_respostas  on public.orcamento_itens using gin(respostas);  -- Suporta consultas JSONB


-- ============================================================
-- BLOCO 14 — SUBITENS DO ORÇAMENTO (Add-ons e templates aninhados)
-- ============================================================
create table public.orcamento_subitens (
  id               uuid primary key default uuid_generate_v4(),
  item_id          uuid not null references public.orcamento_itens(id) on delete cascade,
  template_id      uuid references public.templates(id) on delete set null,
  nome             text not null,
  quantidade       numeric(12, 3) not null default 1,
  largura          numeric(10, 4),
  altura           numeric(10, 4),
  respostas        jsonb not null default '{}',
  valor_item       numeric(14, 2) not null default 0,
  criado_em        timestamptz not null default now()
);

comment on table public.orcamento_subitens is 'Subitens de um item (add-ons, templates aninhados do tipo TEMPLATE).';

create index idx_osubitem_item on public.orcamento_subitens(item_id);


-- ============================================================
-- BLOCO 15 — FOLLOW-UPS (Log de contatos por OS)
-- ============================================================
create table public.followups (
  id           uuid primary key default uuid_generate_v4(),
  orcamento_id uuid not null references public.orcamentos(id) on delete cascade,
  realizado_por uuid references public.usuarios(id) on delete set null,
  data_contato  date not null,
  tipo          text not null,          -- Ex: 'Ligação', 'WhatsApp', 'Email', 'Visita'
  observacao    text,
  criado_em     timestamptz not null default now()
);

comment on table public.followups is 'Histórico de follow-ups realizados por orçamento/OS.';

create index idx_followup_orcamento on public.followups(orcamento_id);
create index idx_followup_data      on public.followups(data_contato desc);


-- ============================================================
-- BLOCO 16 — HISTÓRICO DE STATUS (Auditoria)
-- ============================================================
create table public.orcamento_historico_status (
  id              uuid primary key default uuid_generate_v4(),
  orcamento_id    uuid not null references public.orcamentos(id) on delete cascade,
  alterado_por    uuid references public.usuarios(id) on delete set null,
  status_anterior text,
  status_novo     text not null,
  observacao      text,
  alterado_em     timestamptz not null default now()
);

comment on table public.orcamento_historico_status is 'Auditoria de todas as mudanças de status de uma OS.';

create index idx_hist_orcamento on public.orcamento_historico_status(orcamento_id);
create index idx_hist_data      on public.orcamento_historico_status(alterado_em desc);


-- ============================================================
-- BLOCO 17 — CONFIGURAÇÕES DA EMPRESA (Chave-Valor genérico)
-- ============================================================
create table public.configuracoes_empresa (
  id         uuid primary key default uuid_generate_v4(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  chave      text not null,           -- Ex: 'META_MENSAL', 'DIAS_VALIDADE_ORCAMENTO'
  valor      text not null,           -- Sempre texto; converter no frontend
  mes_ref    char(7),                 -- Opcional: 'YYYY-MM' para metas mensais
  criado_em  timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (empresa_id, chave, mes_ref)
);

comment on table public.configuracoes_empresa is
  'Configurações flexíveis por empresa — metas mensais, prazos-padrão, etc. '
  'Exemplo: chave=META_MENSAL, valor=20000, mes_ref=2026-03.';

create index idx_config_empresa on public.configuracoes_empresa(empresa_id, chave);


-- ============================================================
-- BLOCO 18 — TRIGGERS: updated_at automático
-- ============================================================
create or replace function public.fn_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

-- Aplica trigger em todas as tabelas com atualizado_em
create trigger trg_empresas_updated_at
  before update on public.empresas
  for each row execute function public.fn_set_updated_at();

create trigger trg_usuarios_updated_at
  before update on public.usuarios
  for each row execute function public.fn_set_updated_at();

create trigger trg_clientes_updated_at
  before update on public.clientes
  for each row execute function public.fn_set_updated_at();

create trigger trg_mp_updated_at
  before update on public.materias_primas
  for each row execute function public.fn_set_updated_at();

create trigger trg_templates_updated_at
  before update on public.templates
  for each row execute function public.fn_set_updated_at();

create trigger trg_orcamentos_updated_at
  before update on public.orcamentos
  for each row execute function public.fn_set_updated_at();

create trigger trg_config_updated_at
  before update on public.configuracoes_empresa
  for each row execute function public.fn_set_updated_at();


-- ============================================================
-- BLOCO 19 — TRIGGER: número de OS sequencial por empresa
-- ============================================================
create or replace function public.fn_set_numero_os()
returns trigger language plpgsql as $$
declare
  v_proximo integer;
begin
  select coalesce(max(numero_os), 0) + 1
    into v_proximo
    from public.orcamentos
   where empresa_id = new.empresa_id
     and versao_os  = 'A';           -- Só conta versões originais (não revisões)

  new.numero_os := v_proximo;
  return new;
end;
$$;

create trigger trg_orcamento_numero_os
  before insert on public.orcamentos
  for each row
  when (new.numero_os is null or new.numero_os = 0)
  execute function public.fn_set_numero_os();


-- ============================================================
-- BLOCO 20 — ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Princípio: usuário só acessa dados da SUA empresa.
-- A função helper abaixo retorna o empresa_id do usuário logado.

create or replace function public.fn_empresa_id_do_usuario()
returns uuid language sql stable security definer as $$
  select empresa_id
    from public.usuarios
   where id = auth.uid()
$$;

-- ---- Habilitar RLS ----
alter table public.empresas                  enable row level security;
alter table public.usuarios                  enable row level security;
alter table public.clientes                  enable row level security;
alter table public.categorias_materia_prima  enable row level security;
alter table public.materias_primas           enable row level security;
alter table public.templates                 enable row level security;
alter table public.template_addons           enable row level security;
alter table public.template_secoes           enable row level security;
alter table public.template_campos           enable row level security;
alter table public.template_campo_opcoes     enable row level security;
alter table public.status_orcamento          enable row level security;
alter table public.tipos_followup            enable row level security;
alter table public.orcamentos                enable row level security;
alter table public.orcamento_itens           enable row level security;
alter table public.orcamento_subitens        enable row level security;
alter table public.followups                 enable row level security;
alter table public.orcamento_historico_status enable row level security;
alter table public.configuracoes_empresa     enable row level security;

-- ---- Políticas: usuário acessa apenas dados da sua empresa ----

-- empresas: cada usuário vê apenas a sua
create policy "empresa_proprio_tenant"
  on public.empresas for all
  using (id = public.fn_empresa_id_do_usuario());

-- Macro para demais tabelas com empresa_id direto
create policy "usuarios_proprio_tenant"        on public.usuarios                  for all using (empresa_id = public.fn_empresa_id_do_usuario());
create policy "clientes_proprio_tenant"        on public.clientes                  for all using (empresa_id = public.fn_empresa_id_do_usuario());
create policy "catmp_proprio_tenant"           on public.categorias_materia_prima  for all using (empresa_id = public.fn_empresa_id_do_usuario());
create policy "mp_proprio_tenant"              on public.materias_primas           for all using (empresa_id = public.fn_empresa_id_do_usuario());
create policy "templates_proprio_tenant"       on public.templates                 for all using (empresa_id = public.fn_empresa_id_do_usuario());
create policy "status_proprio_tenant"          on public.status_orcamento          for all using (empresa_id = public.fn_empresa_id_do_usuario());
create policy "tfollowup_proprio_tenant"       on public.tipos_followup            for all using (empresa_id = public.fn_empresa_id_do_usuario());
create policy "orcamentos_proprio_tenant"      on public.orcamentos                for all using (empresa_id = public.fn_empresa_id_do_usuario());
create policy "config_proprio_tenant"          on public.configuracoes_empresa     for all using (empresa_id = public.fn_empresa_id_do_usuario());

-- Tabelas sem empresa_id direto — filtram via JOIN
create policy "template_addons_proprio_tenant"
  on public.template_addons for all
  using (
    template_id in (select id from public.templates where empresa_id = public.fn_empresa_id_do_usuario())
  );

create policy "template_secoes_proprio_tenant"
  on public.template_secoes for all
  using (
    template_id in (select id from public.templates where empresa_id = public.fn_empresa_id_do_usuario())
  );

create policy "template_campos_proprio_tenant"
  on public.template_campos for all
  using (
    secao_id in (
      select ts.id from public.template_secoes ts
      join public.templates t on t.id = ts.template_id
      where t.empresa_id = public.fn_empresa_id_do_usuario()
    )
  );

create policy "opcoes_proprio_tenant"
  on public.template_campo_opcoes for all
  using (
    campo_id in (
      select tc.id from public.template_campos tc
      join public.template_secoes ts on ts.id = tc.secao_id
      join public.templates t on t.id = ts.template_id
      where t.empresa_id = public.fn_empresa_id_do_usuario()
    )
  );

create policy "orcamento_itens_proprio_tenant"
  on public.orcamento_itens for all
  using (
    orcamento_id in (select id from public.orcamentos where empresa_id = public.fn_empresa_id_do_usuario())
  );

create policy "orcamento_subitens_proprio_tenant"
  on public.orcamento_subitens for all
  using (
    item_id in (
      select oi.id from public.orcamento_itens oi
      join public.orcamentos o on o.id = oi.orcamento_id
      where o.empresa_id = public.fn_empresa_id_do_usuario()
    )
  );

create policy "followups_proprio_tenant"
  on public.followups for all
  using (
    orcamento_id in (select id from public.orcamentos where empresa_id = public.fn_empresa_id_do_usuario())
  );

create policy "hist_status_proprio_tenant"
  on public.orcamento_historico_status for all
  using (
    orcamento_id in (select id from public.orcamentos where empresa_id = public.fn_empresa_id_do_usuario())
  );


-- ============================================================
-- BLOCO 21 — SEED: Categorias e Status padrão
-- ============================================================
-- Execute este bloco após criar a primeira empresa.
-- Substitua <EMPRESA_ID> pelo UUID real da empresa.

-- Exemplo de seed (descomente e ajuste):
/*
do $$
declare
  v_empresa uuid := '<EMPRESA_ID>';
begin

  -- Categorias de Matéria Prima
  insert into public.categorias_materia_prima (empresa_id, nome, cor) values
    (v_empresa, 'ACM',     '#1e40af'),
    (v_empresa, 'Adesivo', '#7c3aed'),
    (v_empresa, 'Tinta',   '#0891b2'),
    (v_empresa, 'Verniz',  '#059669'),
    (v_empresa, 'Fixação', '#d97706'),
    (v_empresa, 'PS',      '#be185d'),
    (v_empresa, 'Outro',   '#6b7280');

  -- Status do Funil de OS
  insert into public.status_orcamento (empresa_id, codigo, label, cor, ordem) values
    (v_empresa, 'RASCUNHO',   'Rascunho / Em Digitação',          '#94a3b8', 0),
    (v_empresa, 'CRIAÇÃO',    'Criação / Arte',                   '#c084fc', 1),
    (v_empresa, 'ENVIADO',    'Enviado ao Cliente',                '#3b82f6', 2),
    (v_empresa, 'APROVADO',   'Aprovado / Comercial',             '#10b981', 3),
    (v_empresa, 'PRODUCAO',   'Em Produção (Serralharia / Imps)', '#f59e0b', 4),
    (v_empresa, 'INSTALACAO', 'Em Instalação',                    '#14b8a6', 5),
    (v_empresa, 'CONCLUIDO',  'Finalizado / Entregue',            '#092147', 6),
    (v_empresa, 'REJEITADO',  'Perdido / Rejeitado',              '#ef4444', 7);

  -- Tipos de Follow-up padrão
  insert into public.tipos_followup (empresa_id, nome, descricao) values
    (v_empresa, 'Ativo Básico (3, 7 e 15 dias)',  'Cadência padrão de contato via IA/WhatsApp'),
    (v_empresa, 'Apenas IA Semanal',              'Apenas lembretes passivos 1x por semana');

  -- Meta mensal padrão (Março 2026)
  insert into public.configuracoes_empresa (empresa_id, chave, valor, mes_ref) values
    (v_empresa, 'META_MENSAL', '20000', '2026-03');

end;
$$;
*/


-- ============================================================
-- FIM DO SCHEMA
-- ============================================================

