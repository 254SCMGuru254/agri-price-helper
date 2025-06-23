-- Create point redemptions table
create type point_redemption_status as enum ('pending', 'completed', 'rejected');
create type point_redemption_type as enum ('cash_out', 'featured_listing', 'discount_coupon', 'premium_access');

create table point_redemptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  redemption_type point_redemption_type not null,
  points_spent integer not null check (points_spent > 0),
  status point_redemption_status not null default 'pending',
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table point_redemptions enable row level security;

create policy "Users can view their own redemptions"
  on point_redemptions for select
  using (auth.uid() = user_id);

create policy "Users can create redemptions"
  on point_redemptions for insert
  with check (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_point_redemptions_updated_at
  before update on point_redemptions
  for each row
  execute function update_updated_at_column(); 