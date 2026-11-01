-- Apply once in the Supabase SQL editor or with `supabase db push`.
begin;
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  role text check (role in ('student', 'professional')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, avatar_url, role) on public.profiles to authenticated;
create policy "Read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create function public.psykie_lock_account_type() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.id is distinct from old.id or new.created_at is distinct from old.created_at then
    raise exception 'Account identity cannot be changed';
  end if;
  if old.role is not null and new.role is distinct from old.role then
    raise exception 'Account type has already been selected';
  end if;
  return new;
end;
$$;
create trigger psykie_lock_account_type before update on public.profiles for each row execute function public.psykie_lock_account_type();

create function public.psykie_create_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'avatar_url',
    case when new.raw_app_meta_data->>'provider' = 'email' and new.raw_user_meta_data->>'signup_role' in ('student','professional')
      then new.raw_user_meta_data->>'signup_role' else null end
  );
  return new;
end;
$$;
create trigger psykie_create_profile after insert on auth.users for each row execute function public.psykie_create_profile();

-- Existing Supabase users are asked to choose an account type on their next login.
insert into public.profiles (id, display_name, avatar_url)
select id, coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''), raw_user_meta_data->>'avatar_url' from auth.users
on conflict (id) do nothing;
revoke execute on function public.psykie_create_profile() from public, anon, authenticated;
revoke execute on function public.psykie_lock_account_type() from public, anon, authenticated;
commit;
