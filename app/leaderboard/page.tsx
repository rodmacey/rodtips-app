'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';

type LeaderboardEntry = {
  userId: string;
  displayName: string;
  points: number;
  perfectScores: number;
  correctResults: number;
  rank: number;
};

export default function LeaderboardPage() {
  const { lang } = useLanguage();

  const [entries, setEntries] = useState<
    LeaderboardEntry[]
  >([]);

  const [currentUserId, setCurrentUserId] =
    useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);
      }

      const { data: predictions } = await supabase
        .from('predictions')
        .select(
          'user_id, points_awarded, is_exact, is_correct_result'
        );

      if (!predictions) {
        setEntries([]);
        return;
      }

      const totals: Record<
        string,
        {
          points: number;
          ps: number;
          cr: number;
        }
      > = {};

      predictions.forEach((prediction) => {
        if (!totals[prediction.user_id]) {
          totals[prediction.user_id] = {
            points: 0,
            ps: 0,
            cr: 0
          };
        }

        totals[prediction.user_id].points +=
          prediction.points_awarded || 0;

        if (prediction.is_exact) {
          totals[prediction.user_id].ps += 1;
        }

        if (prediction.is_correct_result) {
          totals[prediction.user_id].cr += 1;
        }
      });

      const activeUserIds =
        Object.keys(totals);

      if (!activeUserIds.length) {
        setEntries([]);
        return;
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', activeUserIds);

      const sorted = activeUserIds
        .map((userId) => ({
          userId,
          displayName:
            profiles?.find(
              (profile) =>
                profile.id === userId
            )?.display_name || 'Unknown',
          points: totals[userId].points,
          perfectScores:
            totals[userId].ps,
          correctResults:
            totals[userId].cr
        }))
        .sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }

          if (
            b.perfectScores !==
            a.perfectScores
          ) {
            return (
              b.perfectScores -
              a.perfectScores
            );
          }

          return (
            b.correctResults -
            a.correctResults
          );
        });

      let currentRank = 1;

      const ranked = sorted.map(
        (entry, index) => {
          if (
            index > 0 &&
            (
              entry.points !==
                sorted[index - 1].points ||
              entry.perfectScores !==
                sorted[index - 1]
                  .perfectScores ||
              entry.correctResults !==
                sorted[index - 1]
                  .correctResults
            )
          ) {
            currentRank = index + 1;
          }

          return {
            ...entry,
            rank: currentRank
          };
        }
      );

      setEntries(ranked);
    }

    loadLeaderboard();
  }, []);

  return (
    <main className="page-content content-stack">
      <h1 className="page-title">
        {lang === 'fr'
          ? 'Classement'
          : 'Leaderboard'}
      </h1>

      <div className="dashboard-card">
      <div className="grid grid-cols-[40px_1fr_60px_50px_50px] gap-2 px-2 pb-3 border-b border-white/10 text-textMuted">
          <div>#</div>

          <div>
            {lang === 'fr'
              ? 'Participant'
              : 'Participant'}
          </div>

          <div className="text-right">
            PTS
          </div>

          <div className="text-right">
            PS
          </div>

          <div className="text-right">
            CR
          </div>
        </div>

        <div className="mt-2 space-y-1">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`grid grid-cols-[40px_1fr_60px_50px_50px] gap-2 py-3 px-2 rounded-lg ${
                entry.userId ===
                currentUserId
                  ? 'bg-white/10'
                  : ''
              }`}
            >
              <div>
                {entry.rank}
              </div>

              <div
                className={
                  entry.userId ===
                  currentUserId
                    ? 'text-white'
                    : 'text-textMuted'
                }
              >
                {entry.displayName}
              </div>

              <div className="text-right">
                {entry.points}
              </div>

              <div className="text-right">
                {entry.perfectScores}
              </div>

              <div className="text-right">
                {entry.correctResults}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}