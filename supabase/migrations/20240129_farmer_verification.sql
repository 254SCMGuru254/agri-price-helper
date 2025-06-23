-- Create verification status enum
create type verification_status as enum ('pending', 'approved', 'rejected');

-- Create farmer verifications table
create table farmer_verifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  documents jsonb not null,
  additional_info jsonb not null,
  status verification_status not null default 'pending',
  message text,
  submitted_at timestamp with time zone not null,
  verified_at timestamp with time zone,
  verified_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add verification fields to profiles table
alter table profiles 
  add column if not exists is_verified boolean default false,
  add column if not exists verified_at timestamp with time zone;

-- Create verification documents storage bucket
insert into storage.buckets (id, name)
values ('verification_documents', 'verification_documents')
on conflict do nothing;

-- Add RLS policies
alter table farmer_verifications enable row level security;

-- Users can view their own verifications
create policy "Users can view their own verifications"
  on farmer_verifications for select
  using (auth.uid() = user_id);

-- Users can create their own verifications if they don't have a pending one
create policy "Users can create verifications"
  on farmer_verifications for insert
  with check (
    auth.uid() = user_id
    and not exists (
      select 1 from farmer_verifications
      where user_id = auth.uid()
      and status = 'pending'
    )
  );

-- Only admins can update verification status
create policy "Admins can update verifications"
  on farmer_verifications for update
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.role = 'admin'
    )
  );

-- Storage policies for verification documents
create policy "Users can upload their own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'verification_documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view their own documents"
  on storage.objects for select
  using (
    bucket_id = 'verification_documents'
    and (
      -- Document owner
      (storage.foldername(name))[1] = auth.uid()::text
      or
      -- Admin
      exists (
        select 1 from auth.users
        where auth.users.id = auth.uid()
        and auth.users.role = 'admin'
      )
    )
  );

-- Create function to update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_farmer_verifications_updated_at
  before update on farmer_verifications
  for each row
  execute function update_updated_at_column(); 