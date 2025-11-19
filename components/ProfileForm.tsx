// components/ProfileForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../lib/supabase/client';

export default function ProfileForm({ initialProfile }) {
  const router = useRouter();
  const supabase = getBrowserSupabase();

  const [fullName, setFullName] = useState(initialProfile?.full_name ?? '');
  const [title, setTitle] = useState(initialProfile?.title ?? '');
  const [bio, setBio] = useState(initialProfile?.bio ?? '');
  const [skills, setSkills] = useState(
    Array.isArray(initialProfile?.skills) ? initialProfile.skills.join(', ') : ''
  );
  const [location, setLocation] = useState(initialProfile?.location ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      user_id: user.id,
      full_name: fullName,
      title,
      bio,
      skills: skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      location,
    };

    await supabase.from('candidates').upsert(payload, {
      onConflict: 'user_id',
    });

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'grid', gap: 12 }}>
      <label>
        Full Name
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </label>

      <label>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        Location
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>

      <label>
        Skills (comma separated)
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
      </label>

      <label>
        Bio
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  );
}
