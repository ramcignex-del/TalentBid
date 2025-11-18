-- TalentBid Database Schema
-- This migration creates all tables and policies for the hiring marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_role enum
CREATE TYPE user_role AS ENUM ('candidate', 'employer');

-- Create bid_status enum
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');

-- Create bid_indicator enum for employers
CREATE TYPE bid_indicator AS ENUM ('highest', 'competitive', 'not_competitive');

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CANDIDATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  min_salary INTEGER NOT NULL CHECK (min_salary > 0),
  currency TEXT DEFAULT 'USD',
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  experience_years INTEGER DEFAULT 0,
  education TEXT,
  bio TEXT,
  profile_summary TEXT,
  resume_url TEXT,
  resume_file_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  allow_paid_trial BOOLEAN DEFAULT FALSE,
  trial_duration_days INTEGER DEFAULT 30,
  trial_rate_percentage INTEGER DEFAULT 50,
  profile_completeness INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMPLOYERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.employers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  location TEXT,
  company_size TEXT,
  industry TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BIDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  salary_offer INTEGER NOT NULL CHECK (salary_offer > 0),
  currency TEXT DEFAULT 'USD',
  role_title TEXT NOT NULL,
  role_description TEXT,
  perks TEXT[] DEFAULT ARRAY[]::TEXT[],
  include_trial BOOLEAN DEFAULT FALSE,
  trial_duration_days INTEGER,
  status bid_status DEFAULT 'pending',
  revision_count INTEGER DEFAULT 0 CHECK (revision_count <= 3),
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  is_competitive BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  CONSTRAINT unique_active_bid UNIQUE (employer_id, candidate_id, status)
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bid_id UUID REFERENCES public.bids(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX idx_candidates_active ON public.candidates(is_active);
CREATE INDEX idx_candidates_min_salary ON public.candidates(min_salary);
CREATE INDEX idx_employers_user_id ON public.employers(user_id);
CREATE INDEX idx_bids_employer ON public.bids(employer_id);
CREATE INDEX idx_bids_candidate ON public.bids(candidate_id);
CREATE INDEX idx_bids_status ON public.bids(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness(candidate_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completeness INTEGER := 0;
  candidate_record RECORD;
BEGIN
  SELECT * INTO candidate_record FROM public.candidates WHERE id = candidate_id;
  
  IF candidate_record.full_name IS NOT NULL AND candidate_record.full_name != '' THEN
    completeness := completeness + 15;
  END IF;
  
  IF candidate_record.email IS NOT NULL AND candidate_record.email != '' THEN
    completeness := completeness + 10;
  END IF;
  
  IF candidate_record.phone IS NOT NULL AND candidate_record.phone != '' THEN
    completeness := completeness + 5;
  END IF;
  
  IF candidate_record.location IS NOT NULL AND candidate_record.location != '' THEN
    completeness := completeness + 10;
  END IF;
  
  IF candidate_record.min_salary > 0 THEN
    completeness := completeness + 15;
  END IF;
  
  IF candidate_record.skills IS NOT NULL AND array_length(candidate_record.skills, 1) > 0 THEN
    completeness := completeness + 15;
  END IF;
  
  IF candidate_record.bio IS NOT NULL AND candidate_record.bio != '' THEN
    completeness := completeness + 10;
  END IF;
  
  IF candidate_record.resume_url IS NOT NULL AND candidate_record.resume_url != '' THEN
    completeness := completeness + 20;
  END IF;
  
  RETURN completeness;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for candidates updated_at
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for employers updated_at
CREATE TRIGGER update_employers_updated_at
  BEFORE UPDATE ON public.employers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for bids updated_at
CREATE TRIGGER update_bids_updated_at
  BEFORE UPDATE ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- CANDIDATES POLICIES
-- ============================================

CREATE POLICY "Candidates can view their own profile"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can view active candidates"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (
    is_active = TRUE AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'employer'
    )
  );

CREATE POLICY "Candidates can insert their own profile"
  ON public.candidates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Candidates can update their own profile"
  ON public.candidates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- EMPLOYERS POLICIES
-- ============================================

CREATE POLICY "Employers can view their own profile"
  ON public.employers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert their own profile"
  ON public.employers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can update their own profile"
  ON public.employers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- BIDS POLICIES
-- ============================================

CREATE POLICY "Candidates can view bids for them"
  ON public.bids FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.candidates
      WHERE candidates.id = bids.candidate_id
      AND candidates.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can view their own bids"
  ON public.bids FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = bids.employer_id
      AND employers.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can insert bids"
  ON public.bids FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = employer_id
      AND employers.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update their own bids"
  ON public.bids FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = bids.employer_id
      AND employers.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = employer_id
      AND employers.user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can update bid status"
  ON public.bids FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.candidates
      WHERE candidates.id = bids.candidate_id
      AND candidates.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.candidates
      WHERE candidates.id = candidate_id
      AND candidates.user_id = auth.uid()
    )
  );

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
