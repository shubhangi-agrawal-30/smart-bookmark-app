# 📌 Smart Bookmark App

A full-stack bookmark manager built with **Next.js (App Router)** and
**Supabase**.

Users can sign in using Google OAuth, add private bookmarks, and see
real-time updates across multiple tabs --- without refreshing the page.

------------------------------------------------------------------------

## 🚀 Live Demo

🔗 **Live URL:**\
https://smart-bookmark-app-virid-six.vercel.app

------------------------------------------------------------------------

## 🧱 Tech Stack

-   **Frontend:** Next.js (App Router)
-   **Styling:** Tailwind CSS
-   **Backend / Database:** Supabase (PostgreSQL)
-   **Authentication:** Supabase Auth (Google OAuth)
-   **Realtime:** Supabase Realtime (Postgres changes)
-   **Deployment:** Vercel

------------------------------------------------------------------------

## ✅ Features

1.  🔐 Sign up / Login using Google OAuth\
2.  ➕ Add bookmark (title + URL)\
3.  🔒 Bookmarks are private per user\
4.  🔄 Real-time sync across tabs (insert + delete)\
5.  ❌ Delete bookmarks\
6.  🌐 Fully deployed on Vercel

------------------------------------------------------------------------

## 🏗 Architecture Overview

### Authentication Flow

-   Google OAuth handled via Supabase Auth\
-   Supabase manages session storage\
-   Session validated on dashboard load\
-   Cross-tab login/logout synced using:

``` ts
supabase.auth.onAuthStateChange()
```

------------------------------------------------------------------------

### Database Schema

**Table: bookmarks**

  Column       Type
  ------------ -----------
  id           uuid (PK)
  user_id      uuid (FK)
  title        text
  url          text
  created_at   timestamp

### Important

-   Row Level Security (RLS) enabled\
-   Policies ensure:
    -   Users can only see their own bookmarks\
    -   Users can only insert/delete their own data

------------------------------------------------------------------------

### Realtime Implementation

Stable realtime strategy:

``` ts
supabase
  .channel("realtime-bookmarks")
  .on("postgres_changes", {...}, () => {
    fetchBookmarks()
  })
```

This guarantees: - No duplicate inserts\
- No stale state\
- Reliable sync across tabs

------------------------------------------------------------------------

## 🔧 URL Normalization

Tracking parameters removed before saving:

-   utm_source\
-   utm_medium\
-   utm_campaign\
-   gclid\
-   fbclid\
-   gbraid

Prevents duplicate bookmarks caused by tracking variations.

------------------------------------------------------------------------

## 📦 Local Development Setup

### 1️⃣ Clone the repo

``` bash
git clone https://github.com/shubhangi-agrawal-30/smart-bookmark-app.git
cd smart-bookmark-app
```

### 2️⃣ Install dependencies

``` bash
npm install
```

### 3️⃣ Create `.env.local`

``` env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4️⃣ Run locally

``` bash
npm run dev
```

------------------------------------------------------------------------

## 🌍 Deployment (Vercel)

1.  Push repo to GitHub\
2.  Import repo in Vercel\
3.  Add environment variables in Vercel\
4.  Configure Supabase Auth:
    -   Add production Site URL\
    -   Add production Redirect URL\
5.  Redeploy

------------------------------------------------------------------------

## 🧠 Problems Faced & Solutions

### 1️⃣ Duplicate Inserts in Realtime

**Problem:** Manual state updates caused duplicates.\
**Solution:** Replaced manual state mutation with a stable refetch
strategy inside realtime listener.

------------------------------------------------------------------------

### 2️⃣ Logout Not Syncing Across Tabs

**Problem:** Logout in one tab didn't affect others.\
**Solution:** Used:

``` ts
supabase.auth.onAuthStateChange()
```

------------------------------------------------------------------------

### 3️⃣ Duplicate Bookmark Storage

**Problem:** Same URL could be saved twice.\
**Solution:**

-   Added composite unique index `(user_id, url)`\
-   Implemented URL normalization

------------------------------------------------------------------------

### 4️⃣ RLS Misconfiguration

**Problem:** Data visible across users.\
**Solution:** Enabled RLS with proper policies:

-   SELECT where `user_id = auth.uid()`\
-   INSERT where `user_id = auth.uid()`\
-   DELETE where `user_id = auth.uid()`

------------------------------------------------------------------------

## 🎯 Design Decisions

-   Used App Router (as required)\
-   Used Supabase Realtime instead of polling\
-   Used DB-level uniqueness instead of frontend-only validation\
-   Preferred stability over optimistic state mutation

------------------------------------------------------------------------

## 🔒 Security

-   RLS enforced at DB level\
-   No service_role key exposed\
-   Only anon public key used in frontend\
-   Proper OAuth redirect configuration

------------------------------------------------------------------------

## 📈 Future Improvements

-   Edit bookmark feature\
-   Categories / tags\
-   Pagination\
-   Optimistic UI\
-   Dark mode

------------------------------------------------------------------------

## 👩‍💻 Author

Shubhangi Agrawal

------------------------------------------------------------------------

# ✅ Final Status

All requirements satisfied:

-   Google OAuth ✔\
-   Private bookmarks ✔\
-   Add ✔\
-   Delete ✔\
-   Realtime sync ✔\
-   Cross-tab login/logout ✔\
-   Vercel deployment ✔
