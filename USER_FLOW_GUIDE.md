# TalentBid User Flow Guide

## 🎯 Complete User Journey

### For Candidates/Talent:

#### 1. Signup
- Visit: `http://localhost:3000/auth/signup`
- Select: "Talent / Candidate"
- Enter email and password
- Click "Create account"
- ✅ See: "Account created successfully! Redirecting..."

#### 2. Complete Profile
- **Auto-redirected to:** `/profile/setup`
- Fill in:
  - Full name
  - Title (e.g., "Senior React Developer")
  - Location
  - Skills (comma-separated)
  - Bio
- Click "Save profile"
- ✅ Redirected to Dashboard

#### 3. Dashboard (Candidate View)
- **URL:** `/dashboard`
- **You'll see:**
  - List of all salary bids from employers
  - Bid amounts, company names, role details
  - Status badges (Pending, Accepted, Rejected)
  - Options to Accept or Reject bids
  
#### 4. Review Bids
- Click on any bid to see full details
- See employer information (if not anonymous)
- View salary offer, role description, perks
- **Actions:**
  - Accept bid → Other bids auto-expire
  - Reject bid → Employer notified

---

### For Employers:

#### 1. Signup
- Visit: `http://localhost:3000/auth/signup`
- Select: "Employer / Recruiter"
- Enter email and password
- Click "Create account"
- ✅ See: "Account created successfully! Redirecting..."

#### 2. Complete Company Profile
- **Auto-redirected to:** `/employer/setup`
- Fill in company information
- Click "Save"
- ✅ Redirected to Dashboard

#### 3. Dashboard (Employer View)
- **URL:** `/dashboard`
- **You'll see:**
  - **Tab 1: Browse Candidates**
    - List of available talent
    - Skills, experience, salary expectations
    - "Place Bid" button on each candidate
  - **Tab 2: My Bids**
    - All your submitted bids
    - Status indicators (Highest, Competitive, Not Competitive)
    - Pending/Accepted/Rejected status

#### 4. Place a Bid
- Click "Place Bid" on a candidate
- Fill in:
  - Role title
  - Salary amount (must meet minimum)
  - Role description (AI can help generate)
  - Message to candidate
- Submit bid
- ✅ Candidate receives notification

#### 5. Track Bids
- View all your bids in "My Bids" tab
- See competitive indicator:
  - 🏆 **Highest Bid:** Your bid is the top offer
  - ✅ **Competitive:** Your bid is in the running
  - ⚠️ **Not Competitive:** Bid below others
- Update bids if needed (up to 3 times)

---

## 🔄 Complete Flow Example

### Scenario: Employer Hires a Developer

1. **Employer Signs Up** → Completes profile
2. **Employer Browses Dashboard** → Sees available developers
3. **Employer Clicks "Place Bid"** on a Senior React Developer
4. **Fills Bid Form:**
   - Role: "Senior Frontend Engineer"
   - Salary: $120,000
   - Uses AI to generate role description
   - Adds message about company culture
5. **Submits Bid** → System shows "Bid placed successfully!"
6. **Candidate Receives Bid** → Sees it on their dashboard
7. **Candidate Reviews:**
   - Sees salary: $120,000
   - Reads role description
   - Checks company information
8. **Candidate Accepts Bid** → All other bids auto-expire
9. **Employer Notified** → Receives acceptance notification
10. **Both parties proceed** with hiring process

---

## 📍 Key URLs

| Page | URL | Who Can Access |
|------|-----|----------------|
| Homepage | `/` | Everyone |
| Signup | `/auth/signup` | Not logged in |
| Login | `/auth/login` | Not logged in |
| Dashboard | `/dashboard` | Logged in users |
| Profile Setup | `/profile/setup` | Candidates |
| Employer Setup | `/employer/setup` | Employers |
| Talent Browse | `/talent` | Everyone |
| Employers Page | `/employer` | Everyone |
| Logout | `/auth/logout` | Logged in users |

---

## 🎨 Dashboard Features

### Candidate Dashboard Shows:
- **Total Bids Received** (count)
- **Highest Bid Amount** (if any)
- **All Bids List** with:
  - Company name or "Anonymous"
  - Salary offer
  - Role title
  - Status badge
  - View/Accept/Reject buttons

### Employer Dashboard Shows:
- **Browse Candidates Tab:**
  - Candidate cards with profiles
  - Skills, experience, location
  - Minimum salary expectations
  - "Place Bid" button
  
- **My Bids Tab:**
  - All your submitted bids
  - Candidate information
  - Bid status (pending/accepted/rejected)
  - Competitive indicator
  - Edit/Withdraw options

---

## ⚙️ Profile Pages

### Candidate Profile (`/profile/setup`):
- Full name
- Job title
- Location
- Skills (comma-separated list)
- Bio/Summary
- **Optional:**
  - Resume upload
  - Minimum salary
  - Experience years
  - Availability

### Employer Profile (`/employer/setup`):
- Company name
- Contact email
- Phone
- Website
- Location
- Company size
- Industry
- Description

---

## 🔐 Authentication States

### Not Logged In:
- Navbar shows: "Sign in" | "Sign up"
- Can view: Homepage, Talent page, Employers page
- Redirected to login if accessing: Dashboard, Profile

### Logged In (No Profile):
- Auto-redirected to profile setup
- Must complete profile before accessing dashboard

### Logged In (With Profile):
- Navbar shows: Email | "Profile" | "Logout"
- Full access to dashboard and features
- Can edit profile anytime

---

## 🎯 Success Messages You'll See

### Signup:
- ✅ "Account created successfully! Redirecting..."

### Login:
- ✅ "Login successful! Redirecting to dashboard..."

### Profile Save:
- ✅ "Profile saved successfully!"

### Bid Placed:
- ✅ "Bid submitted! The candidate will be notified."

### Bid Accepted:
- ✅ "Bid accepted! The employer will be notified."

### Logout:
- ✅ "Signed out successfully"

---

## 🐛 Troubleshooting

### "Redirecting to profile setup" loop:
- Your profile isn't saved yet
- Make sure to fill all required fields
- Click "Save profile" button

### "No candidates available":
- Database might be empty
- Sign up as a candidate first to test
- Complete candidate profile to show in list

### "Cannot place bid":
- Make sure you're logged in as employer
- Complete your employer profile first
- Bid amount must meet candidate's minimum

### Dashboard shows nothing:
- Profile might not be complete
- Check /profile/setup or /employer/setup
- Look for validation errors

---

## 💡 Pro Tips

1. **Test Both Roles:** Create two accounts (one candidate, one employer) to see full flow
2. **Use Real Data:** Add meaningful skills, bio, and company info
3. **Check Email Field:** Some features send notifications (currently logged to console)
4. **AI Features:** Click "AI Generate" buttons to auto-generate descriptions
5. **Competitive Bidding:** Place multiple bids as different employers to see bidding system in action

---

## 🚀 What Happens Next?

After completing setup:

1. **Candidates see:** All incoming salary bids on dashboard
2. **Employers see:** Available candidates + their bid statuses
3. **Real-time updates:** Bid status changes reflect immediately
4. **Notifications:** Email notifications sent on bid actions
5. **Sealed bidding:** Employers never see each other's bids
6. **Fair system:** Candidates see all offers, choose best fit

---

That's it! You're ready to use TalentBid! 🎉
