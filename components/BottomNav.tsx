'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav() {
  const { lang } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-panel border-t border-white/10 flex justify-around p-4">
      <Link href="/dashboard">
        {lang === 'fr' ? 'Tableau' : 'Dashboard'}
      </Link>

      <Link href="/predictions">
        {lang === 'fr' ? 'Pronostics' : 'Predictions'}
      </Link>

      <Link href="/leaderboard">
        {lang === 'fr' ? 'Classement' : 'Leaderboard'}
      </Link>

      <Link href="/links">
        {lang === 'fr' ? 'Liens' : 'Links'}
      </Link>
    </nav>
  );
}