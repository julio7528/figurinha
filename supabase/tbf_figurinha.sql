create table if not exists public.tbf_figurinha (
  id uuid primary key default gen_random_uuid(),
  action_key text not null unique,
  action_type text not null check (action_type in ('team_flag', 'sticker_status')),
  team_id text not null,
  is_flagged boolean,
  sticker_key text,
  sticker_type text check (sticker_type is null or sticker_type = 'player'),
  sticker_number integer,
  status text check (status is null or status in ('tem', 'rep', 'nao')),
  updated_at timestamp with time zone default now(),
  check (
    (
      action_type = 'team_flag'
      and is_flagged is not null
      and sticker_key is null
      and sticker_type is null
      and sticker_number is null
      and status is null
    )
    or
    (
      action_type = 'sticker_status'
      and is_flagged is null
      and sticker_key is not null
      and sticker_type is not null
      and status is not null
    )
  )
);

create index if not exists tbf_figurinha_team_id_idx
on public.tbf_figurinha (team_id);

create index if not exists tbf_figurinha_action_type_idx
on public.tbf_figurinha (action_type);

alter table public.tbf_figurinha enable row level security;

drop policy if exists "Allow read tbf_figurinha" on public.tbf_figurinha;
drop policy if exists "Allow insert tbf_figurinha" on public.tbf_figurinha;
drop policy if exists "Allow update tbf_figurinha" on public.tbf_figurinha;

create policy "Allow read tbf_figurinha"
on public.tbf_figurinha
for select
to anon
using (true);

create policy "Allow insert tbf_figurinha"
on public.tbf_figurinha
for insert
to anon
with check (true);

create policy "Allow update tbf_figurinha"
on public.tbf_figurinha
for update
to anon
using (true)
with check (true);
