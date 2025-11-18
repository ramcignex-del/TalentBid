# Supabase Setup Instructions for TalentBid

## Step 1: Create Supabase Project

1. Go to https://database.new
2. Click "New Project"
3. Choose a project name: `talentbid`
4. Set a strong database password (save this!)
5. Select your preferred region
6. Click "Create new project"
7. Wait for the project to be fully initialized (~2 minutes)

## Step 2: Get Your API Keys

1. Go to Project Settings (gear icon in sidebar)
2. Click "API" in the left menu
3. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Update these values in your `.env.local` file

## Step 3: Run Database Migrations

1. In your Supabase dashboard, go to the SQL Editor
2. Click "New Query"
3. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration
6. You should see "Success. No rows returned"

## Step 4: Setup Storage Bucket

1. Go to "Storage" in the left sidebar
2. Click "New bucket"
3. Name: `resumes`
4. Public bucket: **OFF** (keep it private)
5. Click "Create bucket"
6. Click on the `resumes` bucket
7. Go to "Policies" tab
8. Click "New Policy"
9. Choose "For full customization"
10. Add the following policies:

**Upload Policy:**
```sql
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**View Policy:**
```sql
CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Delete Policy:**
```sql
CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Step 5: Configure Email Auth

1. Go to "Authentication" in the left sidebar
2. Click "Settings"
3. Scroll to "Email Auth"
4. Ensure "Enable Email Signup" is ON
5. Set "Confirm Email" to OFF for development (turn ON for production)
6. Click "Save"

## Step 6: Enable Realtime

1. Go to "Database" in the left sidebar
2. Click "Replication"
3. Find the `bids` table
4. Toggle "Realtime" to ON
5. Click "Save"

## Step 7: Verify Setup

1. Restart your Next.js development server: `npm run dev`
2. Visit http://localhost:3000
3. Try signing up with a test email
4. Check the "Authentication" > "Users" in Supabase dashboard to see your new user

## Troubleshooting

### Issue: "Invalid API key"
- Double-check your `.env.local` file has the correct keys
- Restart your development server after changing `.env.local`

### Issue: "Row Level Security policy violation"
- Make sure you ran all the SQL migrations
- Check that RLS policies are enabled for all tables

### Issue: "Storage bucket not found"
- Verify you created the `resumes` bucket
- Check the bucket name is exactly `resumes` (lowercase)

### Issue: Realtime not working
- Ensure Realtime is enabled for the `bids` table
- Check your Supabase project isn't on the free tier limit

## Production Checklist

- [ ] Enable "Confirm Email" in Email Auth settings
- [ ] Add your production domain to "Redirect URLs"
- [ ] Setup custom SMTP for email delivery
- [ ] Enable database backups
- [ ] Review and test all RLS policies
- [ ] Setup monitoring and alerts
- [ ] Add rate limiting on API routes
