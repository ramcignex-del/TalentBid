# TalentBid Deployment Guide

This guide will help you deploy TalentBid to Vercel with Supabase backend.

## Prerequisites

- Node.js 18+ installed
- A Vercel account (free tier works)
- A Supabase account (free tier works)
- Git repository (optional but recommended)

## Step 1: Setup Supabase

1. **Create Supabase Project**
   - Go to https://database.new
   - Click "New Project"
   - Name: `talentbid-production`
   - Choose a strong password
   - Select your preferred region
   - Wait ~2 minutes for setup

2. **Run Database Migrations**
   - Open SQL Editor in Supabase dashboard
   - Copy content from `supabase/migrations/001_initial_schema.sql`
   - Paste and run the SQL
   - Verify tables are created in "Table Editor"

3. **Create Storage Bucket**
   - Go to Storage > Create bucket
   - Name: `resumes`
   - Keep it private
   - Add storage policies (see SUPABASE_SETUP.md)

4. **Get API Keys**
   - Go to Settings > API
   - Copy:
     * Project URL
     * anon/public key
   - Save these for environment variables

## Step 2: Prepare for Deployment

1. **Update Environment Variables**
   
   Create `.env.production` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   EMERGENT_LLM_KEY=sk-emergent-c02Ad23978eE984051
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

2. **Test Locally**
   ```bash
   npm install
   npm run build
   npm start
   ```
   
   Visit http://localhost:3000 and test:
   - Signup flow
   - Profile creation
   - Dashboard access

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   - Follow prompts
   - Choose project name: `talentbid`
   - Set root directory: `./`
   - Override build command: NO
   - Override output directory: NO

4. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add EMERGENT_LLM_KEY production
   vercel env add NEXT_PUBLIC_SITE_URL production
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option B: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project:
     * Framework Preset: Next.js
     * Root Directory: ./
     * Build Command: `npm run build`
     * Output Directory: .next

3. **Add Environment Variables**
   - In project settings > Environment Variables
   - Add all variables from `.env.production`
   - Make sure to add for "Production" environment

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Visit your deployed site

## Step 4: Configure Supabase for Production

1. **Update Redirect URLs**
   - In Supabase dashboard: Authentication > URL Configuration
   - Add your production URL:
     * Site URL: `https://your-domain.vercel.app`
     * Redirect URLs: `https://your-domain.vercel.app/**`

2. **Enable Email Confirmation** (Recommended for production)
   - Go to Authentication > Settings
   - Enable "Confirm Email"
   - Configure custom SMTP (optional)

3. **Setup Custom Domain** (Optional)
   - In Vercel: Settings > Domains
   - Add your custom domain
   - Update NEXT_PUBLIC_SITE_URL accordingly
   - Update Supabase redirect URLs

## Step 5: Post-Deployment Checks

1. **Test Authentication**
   - Sign up with a real email
   - Check email for confirmation (if enabled)
   - Complete profile setup
   - Verify dashboard loads

2. **Test Role Flows**
   - Create both candidate and employer accounts
   - Upload resume (candidate)
   - Browse candidates (employer)
   - Place a bid (employer)
   - Accept/reject bid (candidate)

3. **Check AI Features**
   - Generate profile summary
   - Generate role description
   - Verify match scores calculate

4. **Verify Realtime** (Optional)
   - Open two browser windows
   - Place bid in one
   - Check if notification appears in other

5. **Monitor Logs**
   - Vercel: Check function logs for errors
   - Supabase: Check API logs and database logs
   - Set up error tracking (Sentry, LogRocket, etc.)

## Troubleshooting

### Build Fails

**Error: Module not found**
- Run `npm install` locally
- Commit `package-lock.json`
- Redeploy

**Error: Type errors**
- Run `npm run build` locally first
- Fix TypeScript errors
- Push fixes

### Authentication Not Working

**Redirects failing**
- Check NEXT_PUBLIC_SITE_URL is correct
- Verify Supabase redirect URLs
- Check browser console for CORS errors

**Users can't sign up**
- Check Supabase email settings
- Verify email quotas (free tier has limits)
- Check spam folder

### Database Errors

**RLS policy violations**
- Verify all policies are created
- Check user is authenticated
- Test policies in Supabase SQL Editor

**Tables not found**
- Re-run migrations
- Check table names (case sensitive)
- Verify connection string

### AI Features Not Working

**API key errors**
- Verify EMERGENT_LLM_KEY is set correctly
- Check environment variables in Vercel
- Redeploy after adding/changing env vars

**Slow response times**
- AI calls can take 2-10 seconds
- This is normal for text generation
- Consider adding loading states

## Performance Optimization

1. **Enable Caching**
   - Configure Next.js ISR for static pages
   - Cache candidate lists (revalidate every 5 minutes)

2. **Optimize Images**
   - Use Next.js Image component
   - Compress images before upload
   - Use WebP format

3. **Database Indexing**
   - Already included in migration
   - Monitor slow queries in Supabase
   - Add indexes as needed

4. **CDN Configuration**
   - Vercel automatically uses CDN
   - Configure cache headers for static assets

## Monitoring & Analytics

1. **Vercel Analytics**
   - Enable in project settings
   - Track page views and performance

2. **Supabase Monitoring**
   - Check API usage
   - Monitor database size
   - Track realtime connections

3. **Error Tracking**
   - Integrate Sentry or similar
   - Track JavaScript errors
   - Monitor API failures

## Scaling Considerations

### Free Tier Limits

**Supabase Free Tier:**
- 500MB database
- 1GB file storage
- 2GB bandwidth/month
- Pauses after 7 days inactivity

**Vercel Free Tier:**
- 100GB bandwidth/month
- 100 hours function execution
- 6,000 minutes build time

### Upgrade Path

When you outgrow free tiers:

1. **Supabase Pro** ($25/mo)
   - 8GB database
   - 100GB storage
   - No pause
   - Daily backups

2. **Vercel Pro** ($20/mo/user)
   - 1TB bandwidth
   - Unlimited builds
   - Team collaboration

3. **Custom Domain**
   - Buy from Vercel or external provider
   - Configure DNS
   - Enable HTTPS

## Security Checklist

- [ ] Environment variables are secret
- [ ] RLS policies are enabled
- [ ] Email confirmation is enabled (prod)
- [ ] CORS is properly configured
- [ ] API keys are not in code
- [ ] Database backups are enabled
- [ ] HTTPS is enforced
- [ ] Rate limiting is considered
- [ ] Input validation is in place
- [ ] XSS protection is enabled

## Maintenance

### Regular Tasks

- Monitor error logs weekly
- Check database usage monthly
- Review and rotate API keys quarterly
- Update dependencies monthly
- Test backup restoration quarterly

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Test locally
npm run dev

# Deploy
vercel --prod
```

## Support

For issues:
1. Check browser console for errors
2. Review Vercel function logs
3. Check Supabase logs
4. Review this deployment guide
5. Check GitHub issues (if applicable)

## Next Steps

After successful deployment:

1. **Add Features**
   - Email notifications (SendGrid/Resend)
   - Advanced search/filters
   - Payment integration
   - Analytics dashboard

2. **Improve UX**
   - Add onboarding tour
   - Improve mobile responsiveness
   - Add dark mode
   - Implement real-time notifications

3. **Scale**
   - Implement caching strategy
   - Add load testing
   - Setup monitoring alerts
   - Plan database scaling

Congratulations! Your TalentBid platform is now live! 🎉
