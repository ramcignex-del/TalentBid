// app/profile/setup/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../../../types/supabase'; // optional: if you have type defs

/**
 * Server component: checks auth, loads existing profile.
 * If no session -> redirect to /auth/login
 */

export default async function ProfileSetupPage() {
  const supabase = createServerComponentClient({ cookies });

  // get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    // not authenticated -> redirect
    redirect('/auth/login');
  }

  const user = session.user;

  // fetch existing profile from "candidates" table by user_id
  const { data: profile, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  // If you want to show an error page when DB fails, handle error here (we'll just console)
  if (error) {
    console.error('Error loading candidate profile:', error);
  }

  // pass the profile down as JSON-serializable props
  const profileProps = profile
    ? {
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name ?? '',
        title: profile.title ?? '',
        bio: profile.bio ?? '',
        skills: profile.skills ?? '',
        location: profile.location ?? '',
      }
    : null;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <h1>Profile setup</h1>
      <p>Fill out your candidate profile. You'll be redirected to the dashboard after saving.</p>

      {/* @ts-expect-error Server -> Client prop typing; profileProps is JSON-serializable */}
      <ProfileForm initialProfile={profileProps} />
    </div>
  );
}

/**
 * Client component for the profile form.
 * This component uses the browser supabase client to upsert profile.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../../../lib/supabase/client';

type ProfileProps = {
  initialProfile:
    | {
        id?: string | number | null;
        user_id: string;
        full_name: string;
        title: string;
        bio: string;
        skills: string;
        location: string;
      }
    | null;
};

function ProfileForm({ initialProfile }: ProfileProps) {
  const router = useRouter();
  const supabase = getBrowserSupabase();

  const [fullName, setFullName] = useState(initialProfile?.full_name ?? '');
  const [title, setTitle] = useState(initialProfile?.title ?? '');
  const [bio, setBio] = useState(initialProfile?.bio ?? '');
  const [skills, setSkills] = useState(initialProfile?.skills ?? '');
  const [location, setLocation] = useState(initialProfile?.location ?? '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg(userError?.message ?? 'Unable to get user session. Please log in again.');
        setLoading(false);
        return;
      }

      const payload = {
        user_id: user.id,
        full_name: fullName,
        title,
        bio,
        skills, // you can store as CSV or JSON array depending on your schema; adjust as needed
        location,
      };

      // upsert into candidates table (insert or update)
      const { error } = await supabase.from('candidates').upsert(payload, {
        onConflict: 'user_id',
        returning: 'minimal',
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // redirect to dashboard after save
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Unknown error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
      <label>
        Full name
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
      </label>

      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </label>

      <label>
        Location
        <input value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </label>

      <label>
        Skills (comma separated)
        <input value={skills} onChange={(e) => setSkills(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </label>

      <label>
        Bio
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={6} style={{ width: '100%', padding: 8 }} />
      </label>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ padding: '0.6rem 1rem' }}>
          {loading ? 'Saving…' : initialProfile ? 'Save changes' : 'Create profile'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          style={{ padding: '0.6rem 1rem' }}
        >
          Cancel
        </button>
      </div>

      {errorMsg && <div style={{ color: 'crimson' }}>{errorMsg}</div>}
    </form>
  );
}
