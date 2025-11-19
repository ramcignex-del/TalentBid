-- 001_initial_schema.sql
-- Complete database schema for TalentBid

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  full_name text,
  title text,
  bio text,
  skills jsonb DEFAULT '[]'::jsonb,
  location text,
  
  -- Additional fields
  min_salary integer,
  experience_years integer DEFAULT 0,
  education text,
  resume_url text,
  resume_file_name text,
  profile_summary text,
  visibility_mode text DEFAULT 'public',
  availability text,
  allow_paid_trial boolean DEFAULT false,
  is_active boolean DEFAULT true,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON public.candidates USING gin (skills);

CREATE TRIGGER trg_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Employers table
CREATE TABLE IF NOT EXISTS public.employers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  company_name text NOT NULL,
  email text,
  phone text,
  website text,
  location text,
  company_size text,
  industry text,
  description text,
  visibility_mode text DEFAULT 'public',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employers_user_id ON public.employers(user_id);

CREATE TRIGGER trg_employers_updated_at
BEFORE UPDATE ON public.employers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  employer_id uuid NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  
  salary integer NOT NULL,
  message text,
  role_title text,
  role_description text,
  
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  
  employer_visibility_snapshot text DEFAULT 'public',
  candidate_visibility_snapshot text DEFAULT 'public',
  
  accepted_at timestamptz,
  rejected_at timestamptz,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bids_candidate_id ON public.bids(candidate_id);
CREATE INDEX IF NOT EXISTS idx_bids_employer_id ON public.bids(employer_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON public.bids(status);

CREATE TRIGGER trg_bids_updated_at
BEFORE UPDATE ON public.bids
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Enable Row Level Security
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Candidates
CREATE POLICY "Candidates are viewable by everyone"
  ON public.candidates FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own candidate profile"
  ON public.candidates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own candidate profile"
  ON public.candidates FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for Employers
CREATE POLICY "Employers are viewable by authenticated users"
  ON public.employers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own employer profile"
  ON public.employers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employer profile"
  ON public.employers FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for Bids
CREATE POLICY "Bids are viewable by candidate owner or employer"
  ON public.bids FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.candidates
      WHERE candidates.id = bids.candidate_id
      AND candidates.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = bids.employer_id
      AND employers.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can create bids"
  ON public.bids FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = bids.employer_id
      AND employers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own bids"
  ON public.bids FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.candidates
      WHERE candidates.id = bids.candidate_id
      AND candidates.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = bids.employer_id
      AND employers.user_id = auth.uid()
    )
  );
