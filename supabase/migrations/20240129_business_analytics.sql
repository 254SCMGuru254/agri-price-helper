-- Create business views table
create table business_views (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references business_listings(id) not null,
  viewer_id uuid references auth.users,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create business contacts table
create type contact_type as enum ('whatsapp', 'phone', 'email');

create table business_contacts (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references business_listings(id) not null,
  contact_type contact_type not null,
  contact_id uuid references auth.users,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create business engagement table
create type engagement_type as enum (
  'profile_view',
  'contact_request',
  'message_sent',
  'offer_viewed',
  'product_inquiry'
);

create table business_engagement (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references business_listings(id) not null,
  user_id uuid references auth.users,
  engagement_type engagement_type not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table business_views enable row level security;
alter table business_contacts enable row level security;
alter table business_engagement enable row level security;

-- Business owners can view their analytics
create policy "Business owners can view their business views"
  on business_views for select
  using (
    exists (
      select 1 from business_listings
      where business_listings.id = business_views.business_id
      and business_listings.owner_id = auth.uid()
    )
  );

create policy "Business owners can view their business contacts"
  on business_contacts for select
  using (
    exists (
      select 1 from business_listings
      where business_listings.id = business_contacts.business_id
      and business_listings.owner_id = auth.uid()
    )
  );

create policy "Business owners can view their business engagement"
  on business_engagement for select
  using (
    exists (
      select 1 from business_listings
      where business_listings.id = business_engagement.business_id
      and business_listings.owner_id = auth.uid()
    )
  );

-- Anyone can create views and engagement records
create policy "Anyone can create business views"
  on business_views for insert
  with check (true);

create policy "Anyone can create business contacts"
  on business_contacts for insert
  with check (true);

create policy "Anyone can create business engagement"
  on business_engagement for insert
  with check (true);

-- Create indexes for better query performance
create index business_views_business_id_created_at_idx 
  on business_views (business_id, created_at desc);

create index business_contacts_business_id_created_at_idx 
  on business_contacts (business_id, created_at desc);

create index business_engagement_business_id_created_at_idx 
  on business_engagement (business_id, created_at desc); 