'use client';

import { useEffect, useState } from 'react';
import BottomNav from './BottomNav';
import { supabase } from '../lib/supabase';

export default function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  const [displayName, setDisplayName] = useState('');
  const [lang, setLang] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('display_name, preferred_lang')
        .eq('id', user.id)
        .single();

      if (data) {
        setDisplayName(data.display_name);
        setLang(data.preferred_lang || 'en');
      }
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  async function toggleLanguage() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const newLang = lang === 'en' ? 'fr' : 'en';

    await supabase
      .from('profiles')
      .update({ preferred_lang: newLang })
      .eq('id', user.id);

    setLang(newLang);
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg pb-24">
<header className="sticky top-0 z-50 bg-bg border-b border-white/10 px-5 py-4 flex justify-between items-end">
        <div>
          <div className="text-2xl font-bold">RodTips</div>

          <button
            onClick={toggleLanguage}
            className="text-sm text-textMuted"
          >
            {lang === 'en' ? 'EN | FR' : 'FR | EN'}
          </button>
        </div>

        <div className="text-right">
          <div className="text-sm">
            {displayName || 'Guest'}
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-textMuted"
          >
            Logout
          </button>
        </div>
      </header>

      {children}

      <BottomNav />
    </div>
  );
}