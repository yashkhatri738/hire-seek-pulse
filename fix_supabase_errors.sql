-- =============================================================================
-- FIX 1: Fix Infinite Recursion in conversation_members Select Policy
-- =============================================================================

-- 1. Helper function to check conversation membership without RLS infinite recursion
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

-- 2. Drop old recursive select policies on conversation_members
drop policy if exists "conv_members_select_member" on public.conversation_members;
drop policy if exists "Allow members to view conversation member mappings" on public.conversation_members;

-- 3. Recreate the policy using the helper function
create policy "conv_members_select_member" on public.conversation_members
  for select using (
    public.is_conversation_member(conversation_id, auth.uid())
  );


-- =============================================================================
-- FIX 2: Add Direct Foreign Key between job_applications and users
-- =============================================================================

-- PostgREST requires a direct relationship in the schema cache to allow nested selects 
-- like `.select("..., userAccount:users(*)")` directly on the job_applications table.
alter table public.job_applications
  drop constraint if exists job_applications_applicant_id_users_fkey,
  add constraint job_applications_applicant_id_users_fkey
    foreign key (applicant_id) references public.users(id) on delete cascade;

-- =============================================================================
-- FIX 3: Allow creating and selecting conversations
-- =============================================================================

-- Drop old select and insert policies for conversations
drop policy if exists "Allow conversation members to view conversation records" on public.conversations;
drop policy if exists "conversations_select_member" on public.conversations;
drop policy if exists "conversations_insert_authenticated" on public.conversations;

-- Recreate policies to allow authenticated users
-- Since the conversations table only contains auto-incremented ID and timestamp (no sensitive data),
-- allowing authenticated users to select/insert is secure and resolves PostgREST returning 0 rows on insert.
create policy "conversations_select_member" on public.conversations
  for select using (auth.role() = 'authenticated');

create policy "conversations_insert_authenticated" on public.conversations
  for insert with check (auth.role() = 'authenticated');
