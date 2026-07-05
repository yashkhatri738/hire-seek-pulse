-- =============================================================================
-- HireNest — consolidated production schema migration
-- =============================================================================
-- Single, idempotent migration for the entire application schema: enums, tables,
-- the auth→profile sync trigger, updated_at triggers, indexes, realtime, and RLS.
--
-- SAFE TO RUN on a fresh database OR an existing one:
--   * enums are created only if missing (no error if they already exist),
--   * tables use CREATE TABLE IF NOT EXISTS,
--   * every column is (re)asserted with ADD COLUMN IF NOT EXISTS to heal drift,
--   * policies/triggers are DROP ... IF EXISTS then recreated,
--   * NO destructive DROP TABLE / data loss.
--
-- Apply via the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ENUMS  (idempotent — guarded against "already exists")
-- ─────────────────────────────────────────────────────────────────────────────
do $$ begin create type public.role_type as enum ('admin', 'applicant', 'employer'); exception when duplicate_object then null; end $$;
do $$ begin create type public.marital_status_type as enum ('single', 'married', 'divorced'); exception when duplicate_object then null; end $$;
do $$ begin create type public.gender_type as enum ('male', 'female', 'other'); exception when duplicate_object then null; end $$;
do $$ begin create type public.salary_currency_type as enum ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'NPR'); exception when duplicate_object then null; end $$;
do $$ begin create type public.salary_period_type as enum ('hourly', 'monthly', 'yearly'); exception when duplicate_object then null; end $$;
do $$ begin create type public.job_type_enum as enum ('remote', 'hybrid', 'on-site'); exception when duplicate_object then null; end $$;
do $$ begin create type public.work_type_enum as enum ('full-time', 'part-time', 'contract', 'temporary', 'freelance'); exception when duplicate_object then null; end $$;
do $$ begin create type public.job_level_enum as enum ('internship', 'entry level', 'junior', 'mid level', 'senior level', 'lead', 'manager', 'director', 'executive'); exception when duplicate_object then null; end $$;
do $$ begin create type public.min_education_enum as enum ('none', 'high school', 'undergraduate', 'masters', 'phd'); exception when duplicate_object then null; end $$;
do $$ begin create type public.application_status_type as enum ('applied', 'reviewing', 'shortlisted', 'rejected', 'selected'); exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TABLES  (create-if-not-exists, then heal columns)
-- ─────────────────────────────────────────────────────────────────────────────

-- Users profile (1:1 with auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  name varchar(255) not null,
  username varchar(255) unique not null,
  email varchar(255) unique not null,
  role public.role_type not null default 'applicant',
  phone_number varchar(255),
  avatar_url text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.users add column if not exists name varchar(255);
alter table public.users add column if not exists username varchar(255);
alter table public.users add column if not exists email varchar(255);
alter table public.users add column if not exists role public.role_type not null default 'applicant';
alter table public.users add column if not exists phone_number varchar(255);
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists deleted_at timestamptz;
alter table public.users add column if not exists created_at timestamptz not null default now();
alter table public.users add column if not exists updated_at timestamptz not null default now();

-- Employers profile (1:1 with users)
create table if not exists public.employers (
  id uuid references public.users on delete cascade primary key,
  name varchar(255),
  description text,
  avatar_url text,
  banner_image_url text,
  organization_type varchar(100),
  team_size varchar(50),
  year_of_establishment integer,
  website_url varchar(255),
  location varchar(255),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.employers add column if not exists name varchar(255);
alter table public.employers add column if not exists description text;
alter table public.employers add column if not exists avatar_url text;
alter table public.employers add column if not exists banner_image_url text;
alter table public.employers add column if not exists organization_type varchar(100);
alter table public.employers add column if not exists team_size varchar(50);
alter table public.employers add column if not exists year_of_establishment integer;
alter table public.employers add column if not exists website_url varchar(255);
alter table public.employers add column if not exists location varchar(255);
alter table public.employers add column if not exists deleted_at timestamptz;
alter table public.employers add column if not exists created_at timestamptz not null default now();
alter table public.employers add column if not exists updated_at timestamptz not null default now();

-- Applicants profile (1:1 with users)
create table if not exists public.applicants (
  id uuid references public.users on delete cascade primary key,
  biography text,
  date_of_birth date,
  nationality varchar(100),
  resume_url text,
  avatar_url text,
  marital_status public.marital_status_type,
  gender public.gender_type,
  education jsonb,
  experience jsonb,
  projects jsonb,
  skills text,
  website_url varchar(255),
  location varchar(255),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.applicants add column if not exists biography text;
alter table public.applicants add column if not exists date_of_birth date;
alter table public.applicants add column if not exists nationality varchar(100);
alter table public.applicants add column if not exists resume_url text;
alter table public.applicants add column if not exists avatar_url text;
alter table public.applicants add column if not exists marital_status public.marital_status_type;
alter table public.applicants add column if not exists gender public.gender_type;
alter table public.applicants add column if not exists education jsonb;
alter table public.applicants add column if not exists experience jsonb;
alter table public.applicants add column if not exists projects jsonb;
alter table public.applicants add column if not exists skills text;
alter table public.applicants add column if not exists website_url varchar(255);
alter table public.applicants add column if not exists location varchar(255);
alter table public.applicants add column if not exists deleted_at timestamptz;
alter table public.applicants add column if not exists created_at timestamptz not null default now();
alter table public.applicants add column if not exists updated_at timestamptz not null default now();

-- Jobs
create table if not exists public.jobs (
  id bigint generated by default as identity primary key,
  title varchar(255) not null,
  employer_id uuid references public.employers on delete cascade not null,
  description text not null,
  tags text,
  min_salary integer,
  max_salary integer,
  salary_currency public.salary_currency_type,
  salary_period public.salary_period_type,
  location varchar(255),
  job_type public.job_type_enum,
  work_type public.work_type_enum,
  job_level public.job_level_enum,
  experience text,
  min_education public.min_education_enum,
  is_featured boolean not null default false,
  expires_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.jobs add column if not exists tags text;
alter table public.jobs add column if not exists min_salary integer;
alter table public.jobs add column if not exists max_salary integer;
alter table public.jobs add column if not exists salary_currency public.salary_currency_type;
alter table public.jobs add column if not exists salary_period public.salary_period_type;
alter table public.jobs add column if not exists location varchar(255);
alter table public.jobs add column if not exists job_type public.job_type_enum;
alter table public.jobs add column if not exists work_type public.work_type_enum;
alter table public.jobs add column if not exists job_level public.job_level_enum;
alter table public.jobs add column if not exists experience text;
alter table public.jobs add column if not exists min_education public.min_education_enum;
alter table public.jobs add column if not exists is_featured boolean not null default false;
alter table public.jobs add column if not exists expires_at timestamptz;
alter table public.jobs add column if not exists deleted_at timestamptz;
alter table public.jobs add column if not exists created_at timestamptz not null default now();
alter table public.jobs add column if not exists updated_at timestamptz not null default now();

-- Job applications
create table if not exists public.job_applications (
  id bigint generated by default as identity primary key,
  job_id bigint references public.jobs on delete cascade not null,
  applicant_id uuid references public.applicants on delete cascade not null,
  name varchar(255) not null,
  email varchar(255) not null,
  phone_number varchar(50),
  resume_url text not null,
  cover_letter text,
  linkedin_url varchar(255),
  github_url varchar(255),
  portfolio_url varchar(255),
  years_of_experience varchar(50),
  status public.application_status_type not null default 'applied',
  employer_notes text,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_apply unique (job_id, applicant_id),
  constraint job_applications_applicant_id_users_fkey foreign key (applicant_id) references public.users(id) on delete cascade
);
do $$
begin
  alter table public.job_applications
    add constraint job_applications_applicant_id_users_fkey
    foreign key (applicant_id) references public.users(id) on delete cascade;
exception
  when duplicate_object then null;
end $$;
alter table public.job_applications add column if not exists phone_number varchar(50);
alter table public.job_applications add column if not exists cover_letter text;
alter table public.job_applications add column if not exists linkedin_url varchar(255);
alter table public.job_applications add column if not exists github_url varchar(255);
alter table public.job_applications add column if not exists portfolio_url varchar(255);
alter table public.job_applications add column if not exists years_of_experience varchar(50);
alter table public.job_applications add column if not exists status public.application_status_type not null default 'applied';
alter table public.job_applications add column if not exists employer_notes text;
alter table public.job_applications add column if not exists applied_at timestamptz not null default now();
alter table public.job_applications add column if not exists updated_at timestamptz not null default now();

-- Conversations + members + messages (realtime chat)
create table if not exists public.conversations (
  id bigint generated by default as identity primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  id bigint generated by default as identity primary key,
  conversation_id bigint references public.conversations on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  constraint unique_conversation_member unique (conversation_id, user_id)
);

create table if not exists public.messages (
  id bigint generated by default as identity primary key,
  conversation_id bigint references public.conversations on delete cascade not null,
  sender_id uuid references public.users on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. INDEXES  (foreign keys + hot query paths)
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_jobs_employer_id            on public.jobs (employer_id);
create index if not exists idx_jobs_created_at             on public.jobs (created_at desc);
create index if not exists idx_job_applications_job_id     on public.job_applications (job_id);
create index if not exists idx_job_applications_applicant  on public.job_applications (applicant_id);
create index if not exists idx_conv_members_user_id        on public.conversation_members (user_id);
create index if not exists idx_conv_members_conversation   on public.conversation_members (conversation_id);
create index if not exists idx_messages_conversation_id    on public.messages (conversation_id, created_at);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. AUTH → PROFILE SYNC  (auth.users insert → users + applicants/employers)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role public.role_type;
  full_name varchar(255);
  user_name varchar(255);
  phone varchar(255);
  avatar text;
begin
  user_role := coalesce((new.raw_user_meta_data->>'role')::public.role_type, 'applicant'::public.role_type);
  full_name := coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  user_name := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 6));
  phone := coalesce(new.raw_user_meta_data->>'phone_number', '');
  avatar := coalesce(new.raw_user_meta_data->>'avatar_url', '');

  insert into public.users (id, name, username, email, role, phone_number, avatar_url)
  values (new.id, full_name, user_name, new.email, user_role, phone, avatar)
  on conflict (id) do nothing;

  if user_role = 'employer'::public.role_type then
    insert into public.employers (id, name, avatar_url)
    values (new.id, full_name, avatar)
    on conflict (id) do nothing;
  else
    insert into public.applicants (id, avatar_url)
    values (new.id, avatar)
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. updated_at AUTO-TOUCH  (keeps updated_at honest without app-side bookkeeping)
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['users','employers','applicants','jobs','job_applications']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.users                enable row level security;
alter table public.employers            enable row level security;
alter table public.applicants           enable row level security;
alter table public.jobs                 enable row level security;
alter table public.job_applications     enable row level security;
alter table public.conversations        enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages             enable row level security;

-- users
drop policy if exists "users_select_public" on public.users;
create policy "users_select_public" on public.users
  for select using (true);
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- employers
drop policy if exists "employers_select_public" on public.employers;
create policy "employers_select_public" on public.employers
  for select using (true);
drop policy if exists "employers_update_own" on public.employers;
create policy "employers_update_own" on public.employers
  for update using (auth.uid() = id);

-- applicants
drop policy if exists "applicants_select_authenticated" on public.applicants;
create policy "applicants_select_authenticated" on public.applicants
  for select using (auth.role() = 'authenticated');
drop policy if exists "applicants_update_own" on public.applicants;
create policy "applicants_update_own" on public.applicants
  for update using (auth.uid() = id);

-- jobs
drop policy if exists "jobs_select_public" on public.jobs;
create policy "jobs_select_public" on public.jobs
  for select using (true);
drop policy if exists "jobs_insert_own_employer" on public.jobs;
create policy "jobs_insert_own_employer" on public.jobs
  for insert with check (
    auth.uid() = employer_id
    and exists (select 1 from public.users where id = auth.uid() and role = 'employer')
  );
drop policy if exists "jobs_update_own" on public.jobs;
create policy "jobs_update_own" on public.jobs
  for update using (auth.uid() = employer_id);
drop policy if exists "jobs_delete_own" on public.jobs;
create policy "jobs_delete_own" on public.jobs
  for delete using (auth.uid() = employer_id);

-- job_applications
drop policy if exists "applications_select_involved" on public.job_applications;
create policy "applications_select_involved" on public.job_applications
  for select using (
    auth.uid() = applicant_id
    or auth.uid() = (select employer_id from public.jobs where id = job_id)
  );
drop policy if exists "applications_insert_own_applicant" on public.job_applications;
create policy "applications_insert_own_applicant" on public.job_applications
  for insert with check (
    auth.uid() = applicant_id
    and exists (select 1 from public.users where id = auth.uid() and role = 'applicant')
  );
drop policy if exists "applications_update_by_employer" on public.job_applications;
create policy "applications_update_by_employer" on public.job_applications
  for update using (
    auth.uid() = (select employer_id from public.jobs where id = job_id)
  );

-- conversations
drop policy if exists "conversations_select_member" on public.conversations;
create policy "conversations_select_member" on public.conversations
  for select using (auth.role() = 'authenticated');
-- FIX: the original schema enabled RLS on conversations but never granted an
-- INSERT policy, so the frontend's findOrCreateConversation() insert was blocked.
drop policy if exists "conversations_insert_authenticated" on public.conversations;
create policy "conversations_insert_authenticated" on public.conversations
  for insert with check (auth.role() = 'authenticated');

-- conversation_members
-- Helper function to check conversation membership without RLS infinite recursion
drop function if exists public.is_conversation_member(bigint, uuid);
create or replace function public.is_conversation_member(conv_id bigint, user_uuid uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.conversation_members
    where conversation_id = conv_id and user_id = user_uuid
  );
end;
$$;

drop policy if exists "conv_members_select_member" on public.conversation_members;
create policy "conv_members_select_member" on public.conversation_members
  for select using (
    public.is_conversation_member(conversation_id, auth.uid())
  );
drop policy if exists "conv_members_insert_authenticated" on public.conversation_members;
create policy "conv_members_insert_authenticated" on public.conversation_members
  for insert with check (auth.role() = 'authenticated');

-- messages
drop policy if exists "messages_select_member" on public.messages;
create policy "messages_select_member" on public.messages
  for select using (
    exists (
      select 1 from public.conversation_members m
      where m.conversation_id = messages.conversation_id and m.user_id = auth.uid()
    )
  );
drop policy if exists "messages_insert_member" on public.messages;
create policy "messages_insert_member" on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversation_members m
      where m.conversation_id = messages.conversation_id and m.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. REALTIME  (broadcast new messages to connected chat clients)
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

-- =============================================================================
-- End of migration.
-- =============================================================================
