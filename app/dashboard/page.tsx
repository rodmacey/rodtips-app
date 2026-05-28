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

  const [tournament, setTournament] =
    useState<Tournament | null>(null);

  const [currentRound, setCurrentRound] =
    useState<Round | null>(null);

  const [predictionCount, setPredictionCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);

  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  const [rank, setRank] = useState<number | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      // ACTIVE TOURNAMENT

      const { data: tournamentData } = await supabase
        .from('tournaments')
        .select('*')
        .eq('is_active', true)
        .single();

      if (!tournamentData) return;

      setTournament(tournamentData);

      // CURRENT ROUND

      const now = new Date().toISOString();

      const { data: roundData } = await supabase
        .from('rounds')
        .select('*')
        .eq('tournament_id', tournamentData.id)
        .gte('lock_time', now)
        .order('display_order')
        .limit(1)
        .single();

      if (roundData) {
        setCurrentRound(roundData);

        const { data: matchRows } = await supabase
          .from('matches')
          .select('id')
          .eq('round_id', roundData.id);

        const matchIds =
          matchRows?.map((m) => m.id) || [];

        setMatchCount(matchIds.length);

        if (matchIds.length) {
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
      }

      // USER SCORE

      const { data: userPredictions } = await supabase
        .from('predictions')
        .select('points_awarded')
        .eq('user_id', user.id);

      const totalScore =
        userPredictions?.reduce(
          (sum, p) => sum + (p.points_awarded || 0),
          0
        ) || 0;

      setScore(totalScore);

      // MAX POSSIBLE SCORE

      const { count: completedMatches } = await supabase
        .from('matches')
        .select('*', {
          count: 'exact',
          head: true
        })
        .eq('is_complete', true);

      setMaxScore((completedMatches || 0) * 4);

      // LEADERBOARD

      const { data: allPredictions } = await supabase
        .from('predictions')
        .select('user_id, points_awarded');

      const totals: Record<string, number> = {};

      allPredictions?.forEach((p) => {
        totals[p.user_id] =
          (totals[p.user_id] || 0) +
          (p.points_awarded || 0);
      });

      const leaderboard = Object.entries(totals)
        .map(([userId, points]) => ({
          userId,
          points
        }))
        .sort((a, b) => b.points - a.points);

      setParticipantCount(leaderboard.length);

      let currentRank = 1;

      leaderboard.forEach((entry, index) => {
        if (
          index > 0 &&
          entry.points <
            leaderboard[index - 1].points
        ) {
          currentRank = index + 1;
        }

        if (entry.userId === user.id) {
          setRank(currentRank);
        }
      });
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    if (!currentRound) return;

    function updateCountdown() {
      const now = new Date().getTime();

      const lock = new Date(
        currentRound.lock_time
      ).getTime();

      const diff = lock - now;

      if (diff <= 0) {
        setCountdown(
          lang === 'fr'
            ? 'Verrouillé'
            : 'Locked'
        );

        return;
      }

      const days = Math.floor(
        diff / 1000 / 60 / 60 / 24
      );

      const hours = Math.floor(
        (diff / 1000 / 60 / 60) % 24
      );

      const minutes = Math.floor(
        (diff / 1000 / 60) % 60
      );

      if (days > 0) {
        setCountdown(
          `${days}d ${hours}h ${minutes}m`
        );
      } else {
        setCountdown(`${hours}h ${minutes}m`);
      }
    }

    updateCountdown();

    const timer = setInterval(
      updateCountdown,
      60000
    );

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
          {lang === 'fr'
            ? 'Tournoi'
            : 'Tournament'}
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

      <div className="bg-panel rounded-xl p-5 border border-white/10">
        <div className="text-textMuted text-sm">
          Score
        </div>

        <div className="text-2xl mt-2">
          {score} / {maxScore}
        </div>
      </div>

      <div className="bg-panel rounded-xl p-5 border border-white/10">
        <div className="text-textMuted text-sm">
          {lang === 'fr'
            ? 'Classement'
            : 'Rank'}
        </div>

        <div className="text-2xl mt-2">
          {rank || '—'} / {participantCount}
        </div>
      </div>
    </main>
  );
}