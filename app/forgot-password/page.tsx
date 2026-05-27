'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetRequest() {
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Password reset email sent.');
  }

  return (
    <main className="p-6">
      <h1 className="text-4xl mb-8">Reset Password</h1>

      <div className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full bg-panel p-4 rounded-lg border border-white/10"
          placeholder="Email"
        />

        <button
          onClick={handleResetRequest}
          disabled={loading}
          className="w-full bg-accent p-4 rounded-lg font-semibold"
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>

        {message && (
          <div className="text-green-400 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}