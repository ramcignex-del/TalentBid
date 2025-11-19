-- 001_create_candidates_table.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main candidates table
CREATE TABLE public.candidates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id uuid NOT NULL UNIQUE
    REFERENCES auth.users(id) ON DELETE CASCADE,

  full_name text,
  title text,
  bio text,

  skills jsonb DEFAULT '[]'::jsonb, -- Option C: JSONB array

  location text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX idx_candidates_skills_jsonb_gin ON public.candidates USING gin (skills);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
