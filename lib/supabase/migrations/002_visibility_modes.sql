-- Add visibility columns and snapshots
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS visibility_mode TEXT NOT NULL DEFAULT 'public';

ALTER TABLE employers
ADD COLUMN IF NOT EXISTS visibility_mode TEXT NOT NULL DEFAULT 'public';

ALTER TABLE bids
ADD COLUMN IF NOT EXISTS employer_visibility_snapshot TEXT NOT NULL DEFAULT 'public',
ADD COLUMN IF NOT EXISTS candidate_visibility_snapshot TEXT NOT NULL DEFAULT 'public';
