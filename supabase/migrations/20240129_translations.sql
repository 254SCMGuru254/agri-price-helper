-- Create translations table
create table translations (
  id uuid default uuid_generate_v4() primary key,
  key text not null unique,
  translations jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table translations enable row level security;

-- Everyone can read translations
create policy "Everyone can read translations"
  on translations for select
  using (true);

-- Only admins can modify translations
create policy "Only admins can insert translations"
  on translations for insert
  with check (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.role = 'admin'
    )
  );

create policy "Only admins can update translations"
  on translations for update
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.role = 'admin'
    )
  );

create policy "Only admins can delete translations"
  on translations for delete
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
create trigger update_translations_updated_at
  before update on translations
  for each row
  execute function update_updated_at_column();

-- Insert some initial translations
insert into translations (key, translations) values
('common.welcome', '{
  "en": "Welcome",
  "sw": "Karibu",
  "luo": "Ber Biro",
  "kam": "Ni Mwega",
  "kik": "Nĩ Mwega",
  "mer": "Karibu",
  "kal": "Chamge"
}'::jsonb),

('common.submit', '{
  "en": "Submit",
  "sw": "Wasilisha",
  "luo": "Or",
  "kam": "Nenga",
  "kik": "Tũma",
  "mer": "Tuma",
  "kal": "Ibwat"
}'::jsonb),

('market.prices', '{
  "en": "Market Prices",
  "sw": "Bei za Soko",
  "luo": "Bei mag Chiro",
  "kam": "Thogwa sya Ndunyu",
  "kik": "Thogora wa Thoko",
  "mer": "Biashara ya Sokoni",
  "kal": "Oret ab Gaset"
}'::jsonb),

('farmer.verification', '{
  "en": "Farmer Verification",
  "sw": "Uthibitisho wa Mkulima",
  "luo": "Nyalo mar Japur",
  "kam": "Withisyo wa Muimi",
  "kik": "Kũmenya Mũrĩmi",
  "mer": "Thibitisha Mkulima",
  "kal": "Iboru ne Choreet"
}'::jsonb),

('weather.forecast', '{
  "en": "Weather Forecast",
  "sw": "Utabiri wa Hali ya Hewa",
  "luo": "Raporta mar Kor",
  "kam": "Mbiu ya Atu",
  "kik": "Ũhoro wa Riera",
  "mer": "Hali ya Hewa",
  "kal": "Emet ab Barak"
}'::jsonb),

('points.balance', '{
  "en": "Points Balance",
  "sw": "Salio la Pointi",
  "luo": "Pek mar Puointe",
  "kam": "Mbalance ya Points",
  "kik": "Mbeca cia Points",
  "mer": "Salio ya Points",
  "kal": "Tuwet ab Points"
}'::jsonb); 