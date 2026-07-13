create type story_category as enum ('research','treatments','legislation','longevity','industry');
create type story_status as enum ('pending_review','published','rejected');

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  dek text not null,
  body text not null,
  category story_category not null,
  evidence_tier smallint not null check (evidence_tier in (1,2)),
  status story_status not null default 'pending_review',
  hero_image_url text,
  hero_image_alt text,
  image_flagged boolean not null default false,
  sources jsonb not null default '[]'::jsonb,
  key_takeaways jsonb not null default '[]'::jsonb,
  faq jsonb,
  related_treatments jsonb not null default '[]'::jsonb,
  meta_description text not null,
  pipeline_log jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index stories_status_published_idx on public.stories (status, published_at desc);
create index stories_category_idx on public.stories (category);
create index stories_related_treatments_idx on public.stories using gin (related_treatments);

create table public.treatments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null,
  what_it_is text not null,
  what_to_expect text not null,
  evidence_summary text not null,
  risks text not null,
  typical_cost_range text not null,
  faq jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  confirmed boolean not null default false,
  confirm_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create table public.pipeline_runs (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz not null default now(),
  category story_category not null,
  status text not null check (status in ('success','failed')),
  error text,
  story_id uuid references public.stories(id) on delete set null
);

alter table public.stories enable row level security;
alter table public.treatments enable row level security;
alter table public.subscribers enable row level security;
alter table public.pipeline_runs enable row level security;

-- Anonymous readers see only published stories and the directory.
create policy "anon read published stories" on public.stories
  for select using (status = 'published');
create policy "anon read treatments" on public.treatments
  for select using (true);
-- subscribers and pipeline_runs: NO anon policies; server uses the secret key (bypasses RLS).

insert into storage.buckets (id, name, public)
values ('story-images','story-images', true)
on conflict (id) do nothing;

create policy "anon read story images" on storage.objects
  for select using (bucket_id = 'story-images');
