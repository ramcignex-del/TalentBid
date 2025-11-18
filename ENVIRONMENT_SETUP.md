# Environment Variables Setup

## Overview

TalentBid now includes **safe defaults** for all environment variables, allowing the application to run even without Supabase configuration. This is useful for:

- **Preview deployments** - See the UI without backend setup
- **Development** - Work on frontend before configuring Supabase
- **Testing** - Test the build and deployment process

## Environment Variables

### Required for Full Functionality

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EMERGENT_LLM_KEY=sk-emergent-c02Ad23978eE984051
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Default Placeholders (Automatic)

If environment variables are not set, the application uses safe defaults:

- **NEXT_PUBLIC_SUPABASE_URL**: `https://placeholder.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Placeholder JWT token
- **EMERGENT_LLM_KEY**: `sk-placeholder-key`
- **NEXT_PUBLIC_SITE_URL**: `http://localhost:3000`

## Behavior with Placeholders

### ✅ What Works

- Landing page loads normally
- All static pages render
- UI components display correctly
- Navigation works
- Build and deployment succeed

### ⚠️ What Requires Configuration

- **Authentication** - Login/signup will show error message
- **Dashboard** - Shows configuration required message
- **API Routes** - Return appropriate error responses
- **AI Features** - Use fallback logic (simple algorithms)
- **File Upload** - Not available without Supabase Storage

## Configuration Detection

The application automatically detects if Supabase is configured by checking:

1. Environment variable exists
2. Value is not the placeholder URL
3. Value doesn't contain "your-project-ref"

When not configured, user-friendly messages guide setup:

```
⚠️ Supabase Configuration Required

To use this feature, you need to configure Supabase:
1. Follow the setup guide in SUPABASE_SETUP.md
2. Create a Supabase project at database.new
3. Add your credentials to .env.local
4. Restart the development server
```

## Error Handling

### Graceful Degradation

All components handle missing configuration gracefully:

- **Auth pages**: Show configuration error
- **Dashboard**: Display setup instructions
- **API routes**: Return 401 with helpful message
- **AI features**: Use simple fallback algorithms

### No Crashes

The application will NOT crash due to missing environment variables:

- Middleware skips auth checks if not configured
- Supabase clients use placeholder values
- OpenAI client checks configuration before API calls

## Setup Instructions

### For Local Development

1. Copy `.env.local.example` to `.env.local` (if available)
2. Follow `GETTING_STARTED.md` for quick setup (15 minutes)
3. Or follow `SUPABASE_SETUP.md` for detailed instructions

### For Production/Preview

1. Add environment variables in your hosting platform:
   - **Vercel**: Project Settings > Environment Variables
   - **Netlify**: Site Settings > Environment Variables
   - **Other**: Consult platform documentation

2. Set variables for all environments:
   - Production
   - Preview
   - Development (optional)

3. Redeploy after adding/changing variables

## Troubleshooting

### "Supabase is not configured" Error

**Cause**: Environment variables not set or using placeholder values

**Solution**: 
- Check `.env.local` file exists
- Verify values don't contain "your-project-ref"
- Restart dev server: `npm run dev`

### Preview Shows Setup Instructions

**Cause**: Preview deployment doesn't have environment variables

**Solution**:
- This is expected behavior
- The landing page still works for previewing UI
- Configure variables in hosting platform for full functionality

### AI Features Not Working

**Cause**: EMERGENT_LLM_KEY not set or invalid

**Solution**:
- Verify key in `.env.local`: `EMERGENT_LLM_KEY=sk-emergent-...`
- Key is already provided in template
- Restart server after adding

### Build Succeeds But Features Don't Work

**Cause**: Environment variables work at build time but need runtime configuration

**Solution**:
- Variables with `NEXT_PUBLIC_` prefix are embedded at build time
- Other variables are read at runtime
- Ensure all required variables are set for your environment

## Testing Configuration

### Check if Configured

Visit http://localhost:3000/setup-required to see configuration status

### Test Without Configuration

1. Rename `.env.local` to `.env.local.backup`
2. Run `npm run dev`
3. App should start without errors
4. Landing page should load
5. Dashboard shows setup instructions

### Test With Configuration

1. Restore `.env.local`
2. Add real Supabase credentials
3. Run `npm run dev`
4. Test authentication flow
5. Verify dashboard loads

## Best Practices

### Development

- Keep `.env.local` in `.gitignore`
- Use placeholder values in documentation
- Test both configured and unconfigured states

### Production

- Never commit real credentials
- Use hosting platform's secrets management
- Set different credentials per environment
- Enable security features (RLS, Auth policies)

### Team Collaboration

- Provide `.env.local.example` with placeholders
- Document required variables in README
- Share Supabase project access securely
- Use team workspace in Supabase

## Migration from Previous Setup

If upgrading from a version without safe defaults:

1. **No changes required** - existing `.env.local` works as-is
2. Application is backward compatible
3. New error messages are more helpful
4. Preview deployments now work without setup

## Support

For configuration issues:

1. Check this document first
2. Review `GETTING_STARTED.md` for setup steps
3. See `SUPABASE_SETUP.md` for detailed Supabase guide
4. Check logs for specific error messages
5. Verify all required variables are set

---

**Summary**: TalentBid now gracefully handles missing environment variables, allowing preview deployments and development without crashing. Configure Supabase and AI keys for full functionality.
