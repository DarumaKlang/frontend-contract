create extension if not exists pgcrypto;

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Lease Agreement',
  data jsonb not null default '{}'::jsonb,
  html text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists contracts_set_updated_at on public.contracts;
create trigger contracts_set_updated_at
before update on public.contracts
for each row execute function public.set_updated_at();

alter table public.contracts enable row level security;

drop policy if exists "Users can read own contracts" on public.contracts;
drop policy if exists "Users can insert own contracts" on public.contracts;
drop policy if exists "Users can update own contracts" on public.contracts;
drop policy if exists "Users can delete own contracts" on public.contracts;

create policy "Users can read own contracts"
on public.contracts
for select
using (auth.uid() = user_id);

create policy "Users can insert own contracts"
on public.contracts
for insert
with check (auth.uid() = user_id);

create policy "Users can update own contracts"
on public.contracts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own contracts"
on public.contracts
for delete
using (auth.uid() = user_id);
