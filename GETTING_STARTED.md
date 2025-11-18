# Getting Started with TalentBid

Welcome to TalentBid! This guide will help you get the application running locally in under 15 minutes.

## ✅ What You Need

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **A Supabase account** - [Sign up free](https://supabase.com)
- **A code editor** - VS Code recommended
- **A terminal/command prompt**

## 🎯 Step-by-Step Setup

### Step 1: Install Dependencies (2 minutes)

```bash
cd /app
npm install
```

This installs all required packages including Next.js, React, Supabase client, and OpenAI.

### Step 2: Create Supabase Project (5 minutes)

1. Visit [https://database.new](https://database.new)
2. Click "New Project"
3. Fill in:
   - **Name**: `talentbid-local`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait ~2 minutes for initialization

### Step 3: Setup Database (3 minutes)

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click "+ New Query"
3. Open the file `/app/supabase/migrations/001_initial_schema.sql`
4. Copy the ENTIRE contents
5. Paste into the SQL Editor
6. Click **Run** (bottom right)
7. You should see "Success. No rows returned"

This creates all necessary tables, indexes, and security policies.

### Step 4: Create Storage Bucket (2 minutes)

1. In Supabase dashboard, click **Storage** in left sidebar
2. Click "+ New bucket"
3. Enter bucket name: `resumes`
4. Keep "Public bucket" **OFF** (unchecked)
5. Click "Create bucket"
6. Click on the `resumes` bucket you just created
7. Go to **Policies** tab
8. Click "New Policy" > "For full customization"
9. Copy and run these three policies (one by one):

**Policy 1 - Upload**:
```sql
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2 - View**:
```sql
CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 3 - Delete**:
```sql
CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Step 5: Get Your API Keys (1 minute)

1. In Supabase dashboard, click **Settings** (gear icon) in left sidebar
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL** - looks like `https://xxxxx.supabase.co`
   - **anon public** key - long string starting with `eyJ...`
4. Keep this tab open, you'll need these next

### Step 6: Configure Environment Variables (1 minute)

1. Open `/app/.env.local` in your code editor
2. Replace the placeholder values:

```bash
# Replace these with YOUR actual values from Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# These can stay as-is
EMERGENT_LLM_KEY=sk-emergent-c02Ad23978eE984051
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Save the file

### Step 7: Start the Development Server (30 seconds)

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.0.3
- Local: http://localhost:3000
✓ Ready in 2.5s
```

### Step 8: Test the Application (1 minute)

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You should see the TalentBid landing page
3. Click "Sign Up" in the top right
4. Create a test account:
   - Choose "Candidate" or "Employer"
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Click "Create Account"
5. Complete your profile
6. You should see the dashboard!

## 🎉 Success!

You're now running TalentBid locally! Here's what you can do:

### As a Candidate:
- ✅ Complete your profile with skills and salary expectations
- ✅ Upload a resume
- ✅ View incoming bids from employers
- ✅ Accept or reject offers

### As an Employer:
- ✅ Browse active candidates
- ✅ Place sealed bids on candidates
- ✅ Use AI to generate role descriptions
- ✅ Track your bid status (highest, competitive, not competitive)

## 🧪 Try These Features

1. **Create two accounts** - one candidate, one employer (use different emails or browsers)
2. **Place a bid** as employer on the candidate profile
3. **Check email logs** in your terminal - you'll see mock notifications
4. **Use AI features** - click "AI Generate" buttons to see GPT-5 in action
5. **Accept a bid** as candidate - watch other bids automatically expire

## 🔧 Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file has the correct Supabase URL and key
- Make sure there are no extra spaces
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "Permission denied" database errors
- Go back to Step 3 and make sure you ran the ENTIRE SQL migration
- Check the "Table Editor" in Supabase - you should see tables like `profiles`, `candidates`, `employers`, `bids`

### Can't sign up or login
- Check your Supabase dashboard under **Authentication** > **Users**
- Make sure email auth is enabled: **Authentication** > **Settings** > **Email Auth** should be ON
- For local development, turn OFF "Confirm Email"

### Resume upload fails
- Make sure you completed Step 4 (Storage Bucket + Policies)
- Check the bucket name is exactly `resumes` (lowercase)
- Try a small PDF file first (< 1MB)

### AI features not working
- Verify `EMERGENT_LLM_KEY` is in your `.env.local`
- AI calls can take 5-10 seconds - be patient
- Check your terminal for any error messages

### Page not loading
- Make sure the dev server is running (`npm run dev`)
- Try a different port if 3000 is taken: `PORT=3001 npm run dev`
- Clear browser cache and cookies
- Try incognito/private browsing mode

## 📱 Using the Application

### Candidate Workflow
1. Sign up as Candidate
2. Complete profile (name, skills, minimum salary)
3. Upload resume (optional but recommended)
4. Go to Dashboard
5. Wait for bids or invite employers
6. View bid details by clicking on bid cards
7. Accept best offer or reject unwanted ones

### Employer Workflow
1. Sign up as Employer
2. Complete company profile
3. Go to Dashboard > Browse Candidates tab
4. Click "Place Bid" on a candidate
5. Fill in role details (AI can help generate description)
6. Submit bid
7. Check "My Bids" tab to track status
8. See if your bid is highest, competitive, or needs improvement
9. Revise bid if needed (up to 3 times)

## 🚀 Next Steps

- **Read the full README.md** for technical details
- **Check DEPLOYMENT.md** when ready to go live
- **Review SUPABASE_SETUP.md** for advanced database features
- **Customize the design** - all styling is in TailwindCSS
- **Add features** - the codebase is well-structured for extensions

## 💡 Pro Tips

1. **Use Chrome DevTools** to inspect network requests and debug
2. **Check Supabase logs** for database errors: Dashboard > Logs
3. **Watch the terminal** for server errors and API calls
4. **Use data-testid** attributes for E2E testing
5. **Hot reload works** - save files and see changes instantly

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Guides](https://supabase.com/docs/guides)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review error messages in terminal
3. Check Supabase dashboard logs
4. Read the detailed SUPABASE_SETUP.md
5. Create an issue with:
   - What you were trying to do
   - What happened instead
   - Error messages (screenshots help!)
   - Your Node version: `node -v`

## ✨ You're All Set!

Congratulations on setting up TalentBid! You now have a fully functional hiring marketplace running locally. Experiment, break things, and have fun building!

Happy coding! 🎉
