# TalentBid - Hiring Marketplace with Sealed Bidding

A modern, full-stack hiring marketplace where candidates set their minimum salary and employers compete with sealed bids. Built with Next.js 14, Supabase, and AI-powered matching.

## 🎯 Key Features

- **Sealed Bidding System**: Candidates see all bids, employers only see competitive indicators
- **AI-Powered Matching**: GPT-5 for resume parsing, profile summaries, and match scoring
- **Real-time Updates**: Supabase Realtime for instant bid notifications
- **Secure Authentication**: Supabase Auth with Row Level Security
- **Resume Upload**: Secure file storage with Supabase Storage
- **Mobile Responsive**: Beautiful UI with TailwindCSS

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables (see .env.local)
# Follow SUPABASE_SETUP.md to configure Supabase

# Run development server
npm run dev
```

Visit http://localhost:3000

## 📚 Documentation

- **Setup Guide**: See `SUPABASE_SETUP.md`
- **Deployment**: See `DEPLOYMENT.md`
- **API Documentation**: Check `/app/api` folder

## 🏗️ Tech Stack

- Next.js 14 (App Router)
- Supabase (Auth, Database, Storage, Realtime)
- OpenAI GPT-5 (AI features)
- TailwindCSS
- TypeScript

## 📦 Deployment

Deploy to Vercel in one click or follow the detailed guide in `DEPLOYMENT.md`.

Built with ❤️ using Next.js and Supabase
