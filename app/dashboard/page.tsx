'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

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

  const [predictionCount, setPredictionCount] =
    useState(0);

  const [matchCount, setMatchCount] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [maxScore, setMaxScore] =
    useState(0);

  const [rank, setRank] =
    useState<number | null>(null);

  const [participantCount, setParticipantCount] =
    useState(0);

  const [countdown, setCountdown] =
    useState('');

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: tournamentData } =
        await supabase
          .from('tournaments')
          .select('*')
          .eq('is_active', true)
          .single();

      if (!tournamentData) return;

      setTournament(tournamentData);

      const now =
        new Date().toISOString();

      const { data: roundData } =
        await supabase
          .from('rounds')
          .select('*')
          .eq(
            'tournament_id',
            tournamentData.id
          )
          .gte('lock_time', now)
          .order('display_order')
          .limit(1)
          .single();

      if (roundData) {
        setCurrentRound(roundData);

        const { data: matchRows } =
          await supabase
            .from('matches')
            .select('id')
            .eq('round_id', roundData.id);

        const matchIds =
          matchRows?.map(
            (m) => m.id
          ) || [];

        setMatchCount(matchIds.length);

        if (matchIds.length) {
          const { count } =
            await supabase
              .from('predictions')
              .select('*', {
                count: 'exact',
                head: true
              })
              .eq('user_id', user.id)
              .in('match_id', matchIds);

          setPredictionCount(
            count || 0
          );
        }
      }

      const {
        data: userPredictions
      } = await supabase
        .from('predictions')
        .select(
          'points_awarded'
        )
        .eq('user_id', user.id);

      const totalScore =
        userPredictions?.reduce(
          (sum, prediction) =>
            sum +
            (prediction.points_awarded ||
              0),
          0
        ) || 0;

      setScore(totalScore);

      const {
        count: completedMatches
      } = await supabase
        .from('matches')
        .select('*', {
          count: 'exact',
          head: true
        })
        .eq('is_complete', true);

      setMaxScore(
        (completedMatches || 0) * 4
      );

      const {
        data: allPredictions
      } = await supabase
        .from('predictions')
        .select(
          'user_id, points_awarded'
        );

      const totals: Record<
        string,
        number
      > = {};

      allPredictions?.forEach(
        (prediction) => {
          totals[
            prediction.user_id
          ] =
            (totals[
              prediction.user_id
            ] || 0) +
            (prediction.points_awarded ||
              0);
        }
      );

      const leaderboard =
        Object.entries(totals)
          .map(
            ([userId, points]) => ({
              userId,
              points
            })
          )
          .sort(
            (a, b) =>
              b.points - a.points
          );

      setParticipantCount(
        leaderboard.length
      );

      let currentRank = 1;

      leaderboard.forEach(
        (entry, index) => {
          if (
            index > 0 &&
            entry.points <
              leaderboard[index - 1]
                .points
          ) {
            currentRank =
              index + 1;
          }

          if (
            entry.userId ===
            user.id
          ) {
            setRank(currentRank);
          }
        }
      );
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    if (!currentRound) return;

    function updateCountdown() {
      const now =
        new Date().getTime();

      const lock =
        new Date(
          currentRound.lock_time
        ).getTime();

      const diff =
        lock - now;

      if (diff <= 0) {
        setCountdown(
          lang === 'fr'
            ? 'Verrouillé'
            : 'Locked'
        );

        return;
      }

      const days =
        Math.floor(
          diff /
            1000 /
            60 /
            60 /
            24
        );

      const hours =
        Math.floor(
          (diff /
            1000 /
            60 /
            60) %
            24
        );

      const minutes =
        Math.floor(
          (diff / 1000 / 60) %
            60
        );

      if (days > 0) {
        setCountdown(
          `${days}d ${hours}h ${minutes}m`
        );
      } else {
        setCountdown(
          `${hours}h ${minutes}m`
        );
      }
    }

    updateCountdown();

    const timer =
      setInterval(
        updateCountdown,
        60000
      );

    return () =>
      clearInterval(timer);
  }, [currentRound, lang]);

  return (
    <main className="page-content content-stack">
      <h1 className="page-title">
        {lang === 'fr'
          ? 'Tableau de bord'
          : 'Dashboard'}
      </h1>

      <div className="dashboard-card">
        <div className="dashboard-label">
          {lang === 'fr'
            ? 'Tournoi'
            : 'Tournament'}
        </div>

        <div className="dashboard-value">
          {tournament
            ? lang === 'fr'
              ? tournament.name_fr
              : tournament.name_en
            : '—'}
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-two-col">
          <div>
    <div className="dashboard-label">
      {lang === 'fr'
        ? 'Tour actuel'
        : 'Current Round'}
    </div>

    <div className="dashboard-value">
      {currentRound
        ? lang === 'fr'
          ? currentRound.name_fr
          : currentRound.name_en
        : '—'}
    </div>
     </div>

  <div>
    <div className="dashboard-label text-right">
      {lang === 'fr'
        ? 'Pronostics'
        : 'Predictions'}
    </div>

    <div className="dashboard-value text-right">
      {predictionCount} / {matchCount}
    </div>
  </div>
</div>

<div className="dashboard-countdown">
  {countdown}
</div>
      </div>

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card">
          <div className="dashboard-label">
            Score
          </div>

          <div className="dashboard-stat-value">
            {score} / {maxScore}
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-label">
            {lang === 'fr'
              ? 'Classement'
              : 'Rank'}
          </div>

          <div className="dashboard-stat-value">
            {rank || '—'} / {participantCount}
          </div>
        </div>
      </div>

    </main>
  );
}