begin;
create table public.ai_usage_windows (
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null check (bucket in ('minute','day')),
  window_start timestamptz not null,
  used integer not null default 0,
  primary key (user_id, bucket)
);
alter table public.ai_usage_windows enable row level security;
revoke all on public.ai_usage_windows from public, anon, authenticated;
create function public.consume_ai_request() returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  account_id uuid := auth.uid();
  current_bucket text;
  started timestamptz;
  request_limit integer;
  consumed integer;
begin
  if account_id is null then return false; end if;
  if not exists(select 1 from public.profiles where id = account_id and role in ('student','professional')) then return false; end if;
  perform pg_advisory_xact_lock(hashtextextended(account_id::text, 0));
  foreach current_bucket in array array['minute','day'] loop
    started := date_trunc(current_bucket, now() at time zone 'UTC') at time zone 'UTC';
    request_limit := case when current_bucket = 'minute' then 8 else 60 end;
    insert into public.ai_usage_windows as usage (user_id, bucket, window_start, used)
    values (account_id, current_bucket, started, 1)
    on conflict (user_id,bucket) do update
      set window_start = started, used = case when usage.window_start = started then usage.used + 1 else 1 end
      where usage.window_start <> started or usage.used < request_limit
    returning used into consumed;
    if not found then return false; end if;
  end loop;
  return true;
end;
$$;
revoke execute on function public.consume_ai_request() from public, anon;
grant execute on function public.consume_ai_request() to authenticated;
commit;
