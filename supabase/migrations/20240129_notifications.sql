-- Create notification preferences table
create table notification_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  preferences jsonb not null default '{
    "price_changes": true,
    "business_offers": true,
    "community_activity": true,
    "points_updates": true
  }',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create push subscriptions table
create table push_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  subscription jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create notifications table for history
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  body text not null,
  type text not null,
  data jsonb,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table notification_preferences enable row level security;
alter table push_subscriptions enable row level security;
alter table notifications enable row level security;

-- Notification preferences policies
create policy "Users can view their own notification preferences"
  on notification_preferences for select
  using (auth.uid() = user_id);

create policy "Users can update their own notification preferences"
  on notification_preferences for update
  using (auth.uid() = user_id);

create policy "Users can insert their own notification preferences"
  on notification_preferences for insert
  with check (auth.uid() = user_id);

-- Push subscriptions policies
create policy "Users can view their own push subscriptions"
  on push_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can update their own push subscriptions"
  on push_subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can insert their own push subscriptions"
  on push_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own push subscriptions"
  on push_subscriptions for delete
  using (auth.uid() = user_id);

-- Notifications policies
create policy "Users can view their own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- Create function to update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers to automatically update updated_at
create trigger update_notification_preferences_updated_at
  before update on notification_preferences
  for each row
  execute function update_updated_at_column();

create trigger update_push_subscriptions_updated_at
  before update on push_subscriptions
  for each row
  execute function update_updated_at_column(); 