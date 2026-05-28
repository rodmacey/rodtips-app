'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';

type LeaderboardEntry = {
  userId: string;
  displayName: string;
  points: number;
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
      const { data: predictions } = await supabase
        .from('predictions')
        .select('user_id, points_awarded');

      if (!predictions) return;

      const {
        data: { user }
      } = await supabase.auth.getUser();
      
      if (user) {
        setCurrentUserId(user.id);
      }

      const totals: Record<string, number> = {};

      predictions.forEach((p) => {
        totals[p.user_id] =
          (totals[p.user_id] || 0) +
          (p.points_awarded || 0);
      });

      const activeUserIds = Object.keys(totals);

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
              (p) => p.id === userId
            )?.display_name || 'Unknown',
          points: totals[userId]
        }))
        .sort((a, b) => b.points - a.points);

      let currentRank = 1;

      const ranked = sorted.map((entry, index) => {
        if (
          index > 0 &&
          entry.points <
            sorted[index - 1].points
        ) {
          currentRank = index + 1;
        }

        return {
          ...entry,
          rank: currentRank
        };
      });

      setEntries(ranked);
    }

    loadLeaderboard();
  }, []);

  return (
    <main className="p-6 space-y-5">
      <h1 className="text-4xl">
        {lang === 'fr'
          ? 'Classement'
          : 'Leaderboard'}
      </h1>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.userId}
            className="bg-panel rounded-xl p-4 border border-white/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold w-8">
                {entry.rank}
              </div>

              <div
               className={
                 entry.userId === currentUserId
                   ? 'text-white'
                    : 'text-textMuted'
                }
              >
                {entry.displayName}
              </div>
            </div>

              <div
                className={
                 entry.userId === currentUserId
                  ? 'text-xl text-white'
                 : 'text-xl text-textMuted'
                }
              >
               {entry.points}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}