'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';

type Tournament = {
  id: string;
  name_en: string;
  name_fr: string;
};

type Round = {
  id: string;
  name_en: string;
  name_fr: string;
  lock_time: string;
};

export default function DashboardPage() {
  const { lang } = useLanguage();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [predictionCount, setPredictionCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: tournamentData } = await supabase
        .from('tournaments')
        .select('*')
        .eq('is_active', true)
        .single();

      if (!tournamentData) return;

      setTournament(tournamentData);

      const now = new Date().toISOString();

      const { data: roundData } = await supabase
        .from('rounds')
        .select('*')
        .eq('tournament_id', tournamentData.id)
        .gte('lock_time', now)
        .order('display_order', { ascending: true })
        .limit(1)
        .single();

      if (!roundData) return;

      setCurrentRound(roundData);

      const { data: matchRows } = await supabase
        .from('matches')
        .select('id')
        .eq('round_id', roundData.id);

      const matchIds = matchRows?.map((m) => m.id) || [];

      setMatchCount(matchIds.length);

      if (!matchIds.length) {
        setPredictionCount(0);
        return;
      }

      const { count } = await supabase
        .from('predictions')
        .select('*', {
          count: 'exact',
          head: true
        })
        .eq('user_id', user.id)
        .in('match_id', matchIds);

      setPredictionCount(count || 0);
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    if (!currentRound) return;

    function updateCountdown() {
      const now = new Date().getTime();
      const lock = new Date(currentRound.lock_time).getTime();
      const diff = lock - now;

      if (diff <= 0) {
        setCountdown(lang === 'fr' ? 'Verrouillé' : 'Locked');
        return;
      }

      const days = Math.floor(diff / 1000 / 60 / 60 / 24);
      const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      if (days > 0) {
        setCountdown(
          `${days}d ${hours}h ${minutes}m`
        );
      } else {
        setCountdown(`${hours}h ${minutes}m`);
      }
    }

    updateCountdown();

    const timer = setInterval(updateCountdown, 60000);

    return () => clearInterval(timer);
  }, [currentRound, lang]);

  return (
    <main className="p-6 space-y-5">
      <h1 className="text-4xl">
        {lang === 'fr'
          ? 'Tableau de bord'
          : 'Dashboard'}
      </h1>

      <div className="bg-panel rounded-xl p-5 border border-white/10">
        <div className="text-textMuted text-sm">
          {lang === 'fr' ? 'Tournoi' : 'Tournament'}
        </div>

        <div className="text-2xl mt-2">
          {tournament
            ? lang === 'fr'
              ? tournament.name_fr
              : tournament.name_en
            : '—'}
        </div>
      </div>

      <div className="bg-panel rounded-xl p-5 border border-white/10">
        <div className="text-textMuted text-sm">
          {lang === 'fr'
            ? 'Tour actuel'
            : 'Current Round'}
        </div>

        <div className="text-2xl mt-2">
          {currentRound
            ? lang === 'fr'
              ? currentRound.name_fr
              : currentRound.name_en
            : '—'}
        </div>

        <div className="text-accent mt-3">
          {countdown}
        </div>
      </div>

      <div className="bg-panel rounded-xl p-5 border border-white/10">
        <div className="text-textMuted text-sm">
          {lang === 'fr'
            ? 'Pronostics complétés'
            : 'Prediction Progress'}
        </div>

        <div className="text-2xl mt-2">
          {predictionCount} / {matchCount}
        </div>
      </div>
    </main>
  );
}