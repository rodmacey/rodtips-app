'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { lang } = useLanguage();

  return (
    <main className="p-6">
      <div className="space-y-4 mt-12">
        <Link
          href="/login"
          className="block w-full bg-accent p-4 rounded-lg font-semibold text-center"
        >
          {lang === 'fr' ? 'Connexion' : 'Login'}
        </Link>

        <Link
          href="/signup"
          className="block w-full bg-panel p-4 rounded-lg border border-white/10 text-center"
        >
          {lang === 'fr'
            ? 'Créer un compte'
            : 'Create Account'}
        </Link>
      </div>
    </main>
  );
}