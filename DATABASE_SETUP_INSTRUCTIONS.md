# Database Setup Instructions for TalentBid

## Quick Start - Setting Up Your Supabase Database

Your TalentBid application is already configured with Supabase credentials, but you need to set up the database tables. Follow these steps:

### Step 1: Access Supabase SQL Editor (2 minutes)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `leskujjkyxjgmzylmgdk`
4. Click on **SQL Editor** in the left sidebar
5. Click **+ New Query**

### Step 2: Run the Database Migration (3 minutes)

1. Open the file at `/app/supabase/migrations/001_initial_schema.sql`
2. Copy the **ENTIRE contents** of that file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (bottom right corner)
5. You should see: `Success. No rows returned`

This creates:
- ✅ Candidates table (with all profile fields)
- ✅ Employers table (with company details)
- ✅ Bids table (for the bidding system)
- ✅ Row Level Security policies (for data protection)
- ✅ Indexes and triggers (for performance)

### Step 3: Create Storage Bucket for Resumes (3 minutes)

1. In Supabase dashboard, click **Storage** in the left sidebar
2. Click **+ New bucket**
3. Enter bucket name: `resumes`
4. **Uncheck** "Public bucket" (keep it private)
5. Click **Create bucket**

### Step 4: Add Storage Policies (2 minutes)

1. Click on the `resumes` bucket you just created
2. Go to the **Policies** tab
3. Click **New Policy** → **For full customization**
4. Run these three policies one by one:

**Policy 1 - Upload:**
```sql
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2 - View:**
```sql
CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 3 - Delete:**
```sql
CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Step 5: Verify Setup (1 minute)

1. Go to **Table Editor** in Supabase
2. You should see 3 tables:
   - `candidates`
   - `employers`
   - `bids`
3. Go to **Storage** and verify `resumes` bucket exists

## You're All Set! 🎉

Your database is now ready. You can:

1. **Test Signup:** Go to http://localhost:3000/auth/signup
2. **Create an account** as either Talent or Employer
3. **Complete your profile**
4. **Start using the app!**

## Troubleshooting

### "Error: relation does not exist"
- You forgot to run the migration SQL. Go back to Step 2.

### "Permission denied" errors
- Check that Row Level Security policies were created. Re-run Step 2.

### Resume upload fails
- Make sure the storage bucket is created and policies are in place (Steps 3 & 4).

### Authentication issues
- Verify your Supabase URL and anon key in `/app/.env.local`
- Make sure they match your project credentials

## What Each Table Does

### `candidates` table
Stores talent/candidate profiles including:
- Personal info (name, title, bio)
- Skills (as JSON array)
- Salary expectations
- Resume files
- Availability status

### `employers` table
Stores employer/company profiles including:
- Company information
- Contact details
- Industry and size
- Visibility preferences

### `bids` table
Stores all salary bids including:
- Bid amount and details
- Status (pending, accepted, rejected, expired)
- Visibility settings for sealed bidding
- Timestamps for all actions

## Security Features

All tables have Row Level Security (RLS) enabled:
- **Candidates:** Everyone can view, but only owners can edit
- **Employers:** Authenticated users can view, only owners can edit  
- **Bids:** Only involved parties (candidate or employer) can see their bids
- **Storage:** Users can only access their own uploaded files

This ensures complete data privacy and security! 🔒
