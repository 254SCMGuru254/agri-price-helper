-- Enable Row Level Security
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

-- Create tables for collaboration features
CREATE TABLE equipment_sharing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    equipment_name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    availability TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE group_buying (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    location TEXT NOT NULL,
    deadline DATE NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE group_buying_participants (
    group_id UUID REFERENCES group_buying(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quantity NUMERIC NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE skill_sharing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expert_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    experience_years INTEGER NOT NULL,
    description TEXT,
    availability TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tables for analytics features
CREATE TABLE sales_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    amount NUMERIC NOT NULL,
    buyer_type TEXT,
    location TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expense_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crop_yields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    season TEXT NOT NULL,
    planted_area NUMERIC NOT NULL,
    yield_amount NUMERIC NOT NULL,
    year INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resource_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    regional_average NUMERIC
);

-- Create views for analytics
CREATE VIEW farmer_profit_margins AS
SELECT 
    farmer_id,
    DATE_TRUNC('month', timestamp) as month,
    SUM(amount) as total_sales
FROM sales_records
GROUP BY farmer_id, DATE_TRUNC('month', timestamp);

CREATE VIEW resource_efficiency AS
SELECT 
    r.farmer_id,
    r.resource_type,
    r.amount as usage_amount,
    r.regional_average,
    ((r.regional_average - r.amount) / r.regional_average * 100) as efficiency_percentage
FROM resource_usage r;

-- Add RLS policies
ALTER TABLE equipment_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buying ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buying_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_yields ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_usage ENABLE ROW LEVEL SECURITY;

-- Equipment sharing policies
CREATE POLICY "Users can view all equipment" 
    ON equipment_sharing FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own equipment" 
    ON equipment_sharing FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own equipment" 
    ON equipment_sharing FOR UPDATE 
    USING (auth.uid() = owner_id);

-- Group buying policies
CREATE POLICY "Users can view all group buys" 
    ON group_buying FOR SELECT 
    USING (true);

CREATE POLICY "Users can create group buys" 
    ON group_buying FOR INSERT 
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own group buys" 
    ON group_buying FOR UPDATE 
    USING (auth.uid() = creator_id);

-- Skill sharing policies
CREATE POLICY "Users can view all skills" 
    ON skill_sharing FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own skills" 
    ON skill_sharing FOR INSERT 
    WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Users can update their own skills" 
    ON skill_sharing FOR UPDATE 
    USING (auth.uid() = expert_id);

-- Analytics policies
CREATE POLICY "Users can view their own records" 
    ON sales_records FOR SELECT 
    USING (auth.uid() = farmer_id);

CREATE POLICY "Users can insert their own records" 
    ON sales_records FOR INSERT 
    WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Users can view their own expenses" 
    ON expense_records FOR SELECT 
    USING (auth.uid() = farmer_id);

CREATE POLICY "Users can insert their own expenses" 
    ON expense_records FOR INSERT 
    WITH CHECK (auth.uid() = farmer_id);

-- Create indexes for better query performance
CREATE INDEX idx_equipment_location ON equipment_sharing(location);
CREATE INDEX idx_group_buying_deadline ON group_buying(deadline);
CREATE INDEX idx_sales_timestamp ON sales_records(timestamp);
CREATE INDEX idx_crop_yields_year_season ON crop_yields(year, season);
CREATE INDEX idx_resource_usage_type ON resource_usage(resource_type); 