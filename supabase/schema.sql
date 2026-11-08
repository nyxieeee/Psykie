-- ============================================================================
-- Psykie — Complete Database Schema & Security
-- ============================================================================
-- Paste into the Supabase SQL editor (or run via migration).
-- Safe to run multiple times: uses IF NOT EXISTS and non-destructive alters.
--
-- Security:
--   * Row Level Security (RLS) enabled and FORCED on every table.
--   * Authenticated users can only select, insert, update, or delete their own rows.
--   * Signed-out (anon) access is strictly revoked.
--   * user_id defaults to auth.uid().
--   * All tables reference auth.users(id) ON DELETE CASCADE, so deleting an account
--     completely purges all associated records automatically.
--   * Secure RPC function delete_user_account() for one-click account deletion.
-- ============================================================================

create extension if not exists pgcrypto;

-- ── 1. User Profiles ────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  role text check (role in ('student', 'professional', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- ── 2. Study Notes ──────────────────────────────────────────────────────────
create table if not exists public.notes (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  file_name text not null default '',
  file_size text not null default '',
  category text not null default 'General Psychology',
  date text not null default 'Today',
  summary text not null default '',
  key_topics text[] not null default '{}',
  key_concepts text[] not null default '{}',
  important_terms text[] not null default '{}',
  flashcards_generated boolean not null default false,
  drawing jsonb,
  kind text not null default 'text' check (kind in ('text', 'handwriting')),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.notes enable row level security;
alter table public.notes add column if not exists drawing jsonb;
alter table public.notes add column if not exists kind text not null default 'text';
alter table public.notes add column if not exists is_pinned boolean not null default false;

-- ── 3. Study Materials (StudyBox / Library) ──────────────────────────────────
create table if not exists public.study_materials (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'General Psychology',
  source_name text not null default '',
  text text not null default '',
  summary text,
  kind text not null default 'text',
  tags text[] not null default '{}',
  favorite boolean not null default false,
  file_id text,
  reviewer jsonb,
  folder_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.study_materials enable row level security;

-- ── 4. Study Folders ────────────────────────────────────────────────────────
create table if not exists public.study_folders (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.study_folders enable row level security;

-- ── 5. Flashcard Decks & Cards ──────────────────────────────────────────────
create table if not exists public.decks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'General Psychology',
  description text,
  cards_count integer not null default 0,
  last_studied timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.decks enable row level security;

create table if not exists public.flashcards (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  deck_id text not null references public.decks(id) on delete cascade,
  question text not null,
  answer text not null,
  category text not null default 'General Psychology',
  interval integer not null default 0,
  repetition integer not null default 0,
  ease_factor numeric not null default 2.5,
  due_date date not null default current_date,
  last_reviewed timestamptz,
  status text not null default 'learning' check (status in ('learning', 'review', 'mastered')),
  created_at timestamptz not null default now()
);
alter table public.flashcards enable row level security;

-- ── 6. Quizzes ──────────────────────────────────────────────────────────────
create table if not exists public.quizzes (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'General Psychology',
  difficulty text not null default 'medium',
  style text not null default 'multiple-choice',
  mode text not null default 'study',
  questions_count integer not null default 0,
  passing_score integer not null default 70,
  score integer,
  timer_minutes integer not null default 0,
  question_seconds integer not null default 0,
  shuffle_questions boolean not null default false,
  shuffle_answers boolean not null default false,
  source_name text,
  questions jsonb not null default '[]'::jsonb,
  user_answers jsonb,
  created_at timestamptz not null default now()
);
alter table public.quizzes enable row level security;

-- ── 7. Deadlines & Goals ────────────────────────────────────────────────────
create table if not exists public.deadlines (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null,
  day text not null,
  title text not null,
  time text not null default '11:59 PM',
  color text not null default '#da26c6',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.deadlines enable row level security;

-- ── 8. Activity Log ─────────────────────────────────────────────────────────
create table if not exists public.activities (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  meta text not null,
  category text not null check (category in ('cards', 'quiz', 'note', 'mindy')),
  timestamp timestamptz not null default now()
);
alter table public.activities enable row level security;

-- ── 9. Mindy AI Chat Messages ───────────────────────────────────────────────
create table if not exists public.chat_messages (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  session_id text,
  session_title text,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;

-- ── 10. Research History ────────────────────────────────────────────────────
create table if not exists public.research_history (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  query text not null,
  results jsonb not null default '[]'::jsonb,
  notice text,
  created_at timestamptz not null default now()
);
alter table public.research_history enable row level security;

-- ── 11. Workspace Cloud Backups ─────────────────────────────────────────────
create table if not exists public.workspace_backups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object' and octet_length(snapshot::text) <= 20000000),
  updated_at timestamptz not null default now()
);
alter table public.workspace_backups enable row level security;

-- ── 12. AI Rate Limiting & Usage Windows ────────────────────────────────────
create table if not exists public.ai_usage_windows (
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null check (bucket in ('minute','day')),
  window_start timestamptz not null,
  used integer not null default 0,
  primary key (user_id, bucket)
);
alter table public.ai_usage_windows enable row level security;

-- ── 13. Secure RPC: User Account Deletion ────────────────────────────────────
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  account_id uuid := auth.uid();
begin
  if account_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Deleting from auth.users cascades to all tables with references auth.users(id) ON DELETE CASCADE
  delete from auth.users where id = account_id;
end;
$$;

revoke all on function public.delete_user_account() from public, anon;
grant execute on function public.delete_user_account() to authenticated;

-- ── 14. Performance Indexes ─────────────────────────────────────────────────
create index if not exists notes_user_updated_idx on public.notes (user_id, updated_at desc);
create index if not exists study_materials_user_updated_idx on public.study_materials (user_id, updated_at desc);
create index if not exists study_folders_user_idx on public.study_folders (user_id, created_at);
create index if not exists decks_user_idx on public.decks (user_id, updated_at desc);
create index if not exists flashcards_deck_idx on public.flashcards (deck_id, due_date);
create index if not exists flashcards_user_idx on public.flashcards (user_id, status);
create index if not exists quizzes_user_idx on public.quizzes (user_id, created_at desc);
create index if not exists deadlines_user_idx on public.deadlines (user_id, completed);
create index if not exists activities_user_idx on public.activities (user_id, timestamp desc);
create index if not exists chat_messages_user_idx on public.chat_messages (user_id, created_at);
create index if not exists research_history_user_idx on public.research_history (user_id, created_at desc);

-- ── 15. Enforce Row Level Security on All Tables ────────────────────────────
do $$
declare
  t text;
  tables text[] := array[
    'profiles', 'notes', 'study_materials', 'study_folders', 'decks',
    'flashcards', 'quizzes', 'deadlines', 'activities', 'chat_messages',
    'research_history', 'workspace_backups'
  ];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);

    -- Default user_id to signed-in user if column exists
    if t <> 'workspace_backups' and t <> 'profiles' then
      execute format('alter table public.%I alter column user_id set default auth.uid()', t);
    end if;

    -- Revoke open access, grant row CRUD to authenticated only
    execute format('revoke all on table public.%I from anon, public', t);
    execute format('revoke all on table public.%I from authenticated', t);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', t);

    -- Clean old policies
    execute format('drop policy if exists "Users manage their own rows" on public.%I', t);
    execute format('drop policy if exists "Read own rows" on public.%I', t);
    execute format('drop policy if exists "Add own rows" on public.%I', t);
    execute format('drop policy if exists "Change own rows" on public.%I', t);
    execute format('drop policy if exists "Delete own rows" on public.%I', t);

    -- Per-action policies
    if t = 'profiles' then
      execute format('drop policy if exists "Read own profile" on public.profiles');
      execute format('drop policy if exists "Update own profile" on public.profiles');
      execute format('create policy "Read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id)');
      execute format('create policy "Update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id)');
    elsif t = 'workspace_backups' then
      execute format('drop policy if exists "Read own workspace backup" on public.workspace_backups');
      execute format('drop policy if exists "Create own workspace backup" on public.workspace_backups');
      execute format('drop policy if exists "Update own workspace backup" on public.workspace_backups');
      execute format('drop policy if exists "Delete own workspace backup" on public.workspace_backups');
      execute format('create policy "Read own workspace backup" on public.workspace_backups for select to authenticated using ((select auth.uid()) = user_id)');
      execute format('create policy "Create own workspace backup" on public.workspace_backups for insert to authenticated with check ((select auth.uid()) = user_id)');
      execute format('create policy "Update own workspace backup" on public.workspace_backups for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)');
      execute format('create policy "Delete own workspace backup" on public.workspace_backups for delete to authenticated using ((select auth.uid()) = user_id)');
    else
      execute format('create policy "Read own rows" on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t);
      execute format('create policy "Add own rows" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t);
      execute format('create policy "Change own rows" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
      execute format('create policy "Delete own rows" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t);
    end if;
  end loop;
end $$;

-- ── 16. Storage Buckets and Policies ────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit)
values ('workspace-backups', 'workspace-backups', false, 20971520)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit)
values ('study-documents', 'study-documents', false, 15728640)
on conflict (id) do nothing;

do $$
begin
  drop policy if exists "Read own backup files" on storage.objects;
  drop policy if exists "Create own backup files" on storage.objects;
  drop policy if exists "Delete own backup files" on storage.objects;
  create policy "Read own backup files" on storage.objects for select to authenticated
    using (bucket_id in ('workspace-backups', 'study-documents') and (storage.foldername(name))[1] = (select auth.uid())::text);
  create policy "Create own backup files" on storage.objects for insert to authenticated
    with check (bucket_id in ('workspace-backups', 'study-documents') and (storage.foldername(name))[1] = (select auth.uid())::text);
  create policy "Delete own backup files" on storage.objects for delete to authenticated
    using (bucket_id in ('workspace-backups', 'study-documents') and (storage.foldername(name))[1] = (select auth.uid())::text);
end $$;

-- ── 17. Realtime Publication ────────────────────────────────────────────────
do $$
declare
  t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array['notes', 'study_materials', 'study_folders', 'decks', 'flashcards', 'quizzes', 'deadlines'] loop
      if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
      ) then
        execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
    end loop;
  end if;
end $$;
