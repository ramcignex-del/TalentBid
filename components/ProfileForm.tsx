// components/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '../lib/supabase/client';

type Props = {
  initialProfile?: any | null;
};

export default function ProfileForm({ initialProfile }: Props) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initialProfile?.full_name ?? '');
  const [title, setTitle] = useState(initialProfile?.title ?? '');
  const [bio, setBio] = useState(initialProfile?.bio ?? '');
  const [skills, setSkills] = useState(
    Array.isArray(initialProfile?.skills) ? initialProfile.skills.join(', ') : ''
  );
  const [location, setLocation] = useState(initialProfile?.location ?? '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = getBrowserSupabase();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg(userError?.message ?? 'Unable to get user session.');
        setLoading(false);
        return;
      }

      const payload = {
        user_id: user.id,
        full_name: fullName,
        title,
        bio,
        skills: skills
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean),
        location,
      };

      const { error } = await supabase.from('candidates').upsert(payload, {
        onConflict: 'user_id',
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Unknown error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'grid', gap: 12 }}>
      <label>
        Full name
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: 8 }} />
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
          {loading ? 'Saving…' : 'Save profile'}
        </button>

        <button type="button" onClick={() => router.push('/dashboard')} style={{ padding: '0.6rem 1rem' }}>
          Cancel
        </button>
      </div>

      {errorMsg && <div style={{ color: 'crimson' }}>{errorMsg}</div>}
    </form>
  );
}
