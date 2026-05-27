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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, preferred_lang')
      .eq('id', userId)
      .single();

    if (data) {
      setDisplayName(data.display_name);
      setLang(data.preferred_lang || 'en');
    }
  }

  useEffect(() => {
    async function init() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        await loadProfile(user.id);
      }

      setLoading(false);
    }

    init();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        await loadProfile(session.user.id);
      } else {
        setIsAuthenticated(false);
        setDisplayName('');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-bg" />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-bg">
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg pb-24">
      <header className="sticky top-0 z-50 bg-bg border-b border-white/10 px-5 py-4 flex justify-between items-end">
        <div>
          <div className="text-2xl font-bold">RodTips</div>

          <div className="text-sm flex gap-1">
  <button
    onClick={() => lang !== 'en' && toggleLanguage()}
    className={
      lang === 'en'
        ? 'text-white'
        : 'text-textMuted'
    }
  >
    EN
  </button>

  <span className="text-textMuted">|</span>

  <button
    onClick={() => lang !== 'fr' && toggleLanguage()}
    className={
      lang === 'fr'
        ? 'text-white'
        : 'text-textMuted'
    }
  >
    FR
  </button>
</div>
        </div>

        <div className="text-right">
          <div className="text-sm">
            {displayName}
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