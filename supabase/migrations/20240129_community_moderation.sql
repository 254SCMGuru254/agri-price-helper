-- Create report types enum
create type report_type as enum ('price', 'comment', 'forum_post', 'business');
create type report_status as enum ('pending', 'resolved', 'dismissed');

-- Create reported items table
create table reported_items (
  id uuid default uuid_generate_v4() primary key,
  type report_type not null,
  content text not null,
  reported_by uuid references auth.users not null,
  owner_id uuid references auth.users not null,
  reason text not null,
  status report_status not null default 'pending',
  moderation_note text,
  moderated_by uuid references auth.users,
  moderated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add is_hidden column to relevant tables
alter table market_prices add column if not exists is_hidden boolean default false;
alter table comments add column if not exists is_hidden boolean default false;
alter table forum_posts add column if not exists is_hidden boolean default false;
alter table business_listings add column if not exists is_hidden boolean default false;

-- Add RLS policies
alter table reported_items enable row level security;

-- Users can create reports
create policy "Users can create reports"
  on reported_items for insert
  with check (auth.uid() = reported_by);

-- Users can view their own reports
create policy "Users can view their own reports"
  on reported_items for select
  using (auth.uid() = reported_by);

-- Admins can view and manage all reports
create policy "Admins can view all reports"
  on reported_items for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.role = 'admin'
    )
  );

create policy "Admins can update reports"
  on reported_items for update
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.role = 'admin'
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
create trigger update_reported_items_updated_at
  before update on reported_items
  for each row
  execute function update_updated_at_column();

-- Create moderation action log table
create table moderation_logs (
  id uuid default uuid_generate_v4() primary key,
  report_id uuid references reported_items not null,
  moderator_id uuid references auth.users not null,
  action text not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies for moderation logs
alter table moderation_logs enable row level security;

-- Only admins can view moderation logs
create policy "Admins can view moderation logs"
  on moderation_logs for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.role = 'admin'
    )
  );

-- Only admins can create moderation logs
create policy "Admins can create moderation logs"
  on moderation_logs for insert
  with check (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.role = 'admin'
    )
  );

-- Create function to log moderation actions
create or replace function log_moderation_action()
returns trigger as $$
begin
  if new.status != old.status then
    insert into moderation_logs (report_id, moderator_id, action, note)
    values (new.id, new.moderated_by, new.status::text, new.moderation_note);
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically log moderation actions
create trigger log_moderation_action_trigger
  after update on reported_items
  for each row
  when (new.status != old.status)
  execute function log_moderation_action(); 