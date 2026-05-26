'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
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
      <h1 className="text-4xl mb-8">Login</h1>

      <div className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-accent p-4 rounded-lg font-semibold"
        >
          {loading ? 'Logging in...' : 'Login'}
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