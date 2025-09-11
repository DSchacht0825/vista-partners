-- SQL script to create the resources table in Supabase
-- Run this in the Supabase SQL editor at https://supabase.com/dashboard/project/rtxmkjzhbwfqvpwlqmyx/sql

CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    name TEXT,
    webAddress TEXT,
    description TEXT,
    contact TEXT,
    phone TEXT,
    staffMember TEXT,
    updated TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on resources" ON resources
FOR ALL USING (true);