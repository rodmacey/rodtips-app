'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function LinksPage() {
  const { lang } = useLanguage();

  return (
    <main className="page-content content-stack">
      <h1 className="page-title">
        {lang === 'fr' ? 'Liens' : 'Links'}
      </h1>

      <a
        href="https://chat.whatsapp.com/EvQn5juhwMo7Nkh87W0Q0K"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-panel rounded-xl p-5 border border-white/10"
      >
        <div className="card-title">
          WhatsApp
        </div>

        <div className="caption mt-1">
          {lang === 'fr'
            ? 'Groupe WhatsApp RodTips'
            : 'RodTips WhatsApp Group'}
        </div>
      </a>

      <Link
        href="/links/rules"
        className="block bg-panel rounded-xl p-5 border border-white/10"
      >
        <div className="card-title">
          {lang === 'fr'
            ? 'Règlement'
            : 'Competition Rules'}
        </div>

        <div className="caption mt-1">
          {lang === 'fr'
            ? 'Points, délais et classement'
            : 'Points, deadlines and rankings'}
        </div>
      </Link>
    </main>
  );
}