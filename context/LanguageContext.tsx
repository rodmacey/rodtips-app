'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { supabase } from '../lib/supabase';

type Language = 'en' | 'fr';

type LanguageContextType = {
  lang: Language;
  setLanguage: (lang: Language) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLanguage: async () => {}
});

export function LanguageProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    async function loadLanguage() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('preferred_lang')
        .eq('id', user.id)
        .single();

      setLang((data?.preferred_lang || 'en') as Language);
    }

    loadLanguage();
  }, []);

  async function setLanguage(newLang: Language) {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        preferred_lang: newLang
      })
      .eq('id', user.id);

    setLang(newLang);
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}