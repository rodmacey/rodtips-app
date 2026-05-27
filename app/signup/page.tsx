'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function SignupPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup() {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          preferred_lang: lang
        }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="p-6">
      <h1 className="text-4xl mb-8">Create Account</h1>

      <div className="space-y-4">
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-panel p-4 rounded-lg border border-white/10"
          placeholder="Display name"
        />

        <div className="bg-panel rounded-lg border border-white/10 p-1 flex">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`flex-1 p-3 rounded transition ${
              lang === 'en'
                ? 'bg-accent text-white'
                : 'text-textMuted'
            }`}
          >
            EN
          </button>

          <button
            type="button"
            onClick={() => setLang('fr')}
            className={`flex-1 p-3 rounded transition ${
              lang === 'fr'
                ? 'bg-accent text-white'
                : 'text-textMuted'
            }`}
          >
            FR
          </button>
        </div>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full bg-panel p-4 rounded-lg border border-white/10"
          placeholder="Email"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full bg-panel p-4 rounded-lg border border-white/10"
          placeholder="Password"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-accent p-4 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}