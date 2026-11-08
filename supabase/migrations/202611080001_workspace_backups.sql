begin;
create table if not exists public.workspace_backups (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object' and octet_length(snapshot::text) <= 20000000),
  updated_at timestamptz not null default now()
);
alter table public.workspace_backups enable row level security;
revoke all on public.workspace_backups from anon, public;
grant select, insert, update, delete on public.workspace_backups to authenticated;
create policy "Read own workspace backup" on public.workspace_backups for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own workspace backup" on public.workspace_backups for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own workspace backup" on public.workspace_backups for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own workspace backup" on public.workspace_backups for delete to authenticated using ((select auth.uid()) = user_id);
insert into storage.buckets (id,name,public,file_size_limit) values ('workspace-backups','workspace-backups',false,10485760) on conflict (id) do nothing;
create policy "Read own backup files" on storage.objects for select to authenticated using (bucket_id='workspace-backups' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Create own backup files" on storage.objects for insert to authenticated with check (bucket_id='workspace-backups' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Delete own backup files" on storage.objects for delete to authenticated using (bucket_id='workspace-backups' and (storage.foldername(name))[1]=(select auth.uid())::text);
commit;
