'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Round = {
  id: string;
  name_en: string;
  name_fr: string;
  lock_time: string;
  is_complete: boolean;
  display_order: number;
};

type Match = {
  id: string;
  home_label_en: string;
  home_label_fr: string;
  away_label_en: string;
  away_label_fr: string;
  kickoff_time_utc: string;
  home_score: number | null;
  away_score: number | null;
  is_complete: boolean;
  match_order: number;
};

type Prediction = {
  match_id: string;
  predicted_home: number | null;
  predicted_away: number | null;
  points_awarded: number;
};

export default function PredictionsPage() {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [userId, setUserId] = useState<string>('');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [saving, setSaving] = useState(false);

  async function loadPredictions(roundId: string, currentUserId: string) {
    const { data: matchesData } = await supabase
      .from('matches')
      .select('*')
      .eq('round_id', roundId)
      .order('match_order', { ascending: true });

    setMatches(matchesData || []);

    if (!matchesData?.length) {
      setPredictions({});
      return;
    }

    const matchIds = matchesData.map((m) => m.id);

    const { data: predictionData } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', currentUserId)
      .in('match_id', matchIds);

    const map: Record<string, Prediction> = {};

    predictionData?.forEach((p) => {
      map[p.match_id] = p;
    });

    setPredictions(map);
  }

  useEffect(() => {
    async function init() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_lang')
        .eq('id', user.id)
        .single();

      setLang((profile?.preferred_lang || 'en') as 'en' | 'fr');

      const { data: tournament } = await supabase
        .from('tournaments')
        .select('id')
        .eq('is_active', true)
        .single();

      if (!tournament) return;

      const { data: roundsData } = await supabase
        .from('rounds')
        .select('*')
        .eq('tournament_id', tournament.id)
        .order('display_order', { ascending: true });

      if (!roundsData?.length) return;

      setRounds(roundsData);

      const now = new Date().toISOString();

      const currentRound =
        roundsData.find((r) => r.lock_time >= now) || roundsData[0];

      setSelectedRoundId(currentRound.id);

      await loadPredictions(currentRound.id, user.id);
    }

    init();
  }, []);

  async function handleRoundChange(roundId: string) {
    setSelectedRoundId(roundId);
    await loadPredictions(roundId, userId);
  }

  function updatePrediction(
    matchId: string,
    field: 'predicted_home' | 'predicted_away',
    value: string
  ) {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        match_id: matchId,
        predicted_home:
          field === 'predicted_home'
            ? value === '' ? null : Number(value)
            : prev[matchId]?.predicted_home ?? null,
        predicted_away:
          field === 'predicted_away'
            ? value === '' ? null : Number(value)
            : prev[matchId]?.predicted_away ?? null,
        points_awarded: prev[matchId]?.points_awarded ?? 0
      }
    }));
  }

  async function savePredictions() {
    setSaving(true);

    const selectedRound = rounds.find((r) => r.id === selectedRoundId);

    if (!selectedRound) {
      setSaving(false);
      return;
    }

    const locked = new Date() > new Date(selectedRound.lock_time);

    if (locked) {
      setSaving(false);
      return;
    }

    const payload = Object.values(predictions).filter(
      (p) =>
        p.predicted_home !== null &&
        p.predicted_away !== null
    ).map((p) => ({
      user_id: userId,
      match_id: p.match_id,
      predicted_home: p.predicted_home,
      predicted_away: p.predicted_away
    }));

    if (payload.length) {
      await supabase
        .from('predictions')
        .upsert(payload, {
          onConflict: 'user_id,match_id'
        });
    }

    setSaving(false);
  }

  const selectedRound = rounds.find((r) => r.id === selectedRoundId);

  const isLocked = selectedRound
    ? new Date() > new Date(selectedRound.lock_time)
    : false;

  return (
    <main className="p-6 space-y-5">
      <h1 className="text-4xl">
        {lang === 'fr' ? 'Pronostics' : 'Predictions'}
      </h1>

      <select
        value={selectedRoundId}
        onChange={(e) => handleRoundChange(e.target.value)}
        className="w-full bg-panel border border-white/10 rounded-lg p-4"
      >
        {rounds.map((round) => (
          <option key={round.id} value={round.id}>
            {lang === 'fr' ? round.name_fr : round.name_en}
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {matches.map((match) => {
          const prediction = predictions[match.id];

          return (
            <div
              key={match.id}
              className="bg-panel rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 text-right">
                  {lang === 'fr'
                    ? match.home_label_fr
                    : match.home_label_en}
                </div>

                <input
                  type="number"
                  min="0"
                  disabled={isLocked}
                  value={prediction?.predicted_home ?? ''}
                  onChange={(e) =>
                    updatePrediction(
                      match.id,
                      'predicted_home',
                      e.target.value
                    )
                  }
                  className="w-14 text-center bg-bg rounded p-2"
                />

                <span>-</span>

                <input
                  type="number"
                  min="0"
                  disabled={isLocked}
                  value={prediction?.predicted_away ?? ''}
                  onChange={(e) =>
                    updatePrediction(
                      match.id,
                      'predicted_away',
                      e.target.value
                    )
                  }
                  className="w-14 text-center bg-bg rounded p-2"
                />

                <div className="flex-1">
                  {lang === 'fr'
                    ? match.away_label_fr
                    : match.away_label_en}
                </div>
              </div>

              {match.is_complete && (
                <div className="mt-3 text-sm text-textMuted">
                  {lang === 'fr' ? 'Résultat' : 'Result'}:{' '}
                  {match.home_score}–{match.away_score}
                  {' • '}
                  {lang === 'fr' ? 'Points' : 'Points'}:{' '}
                  {prediction?.points_awarded ?? 0}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isLocked && (
        <button
          onClick={savePredictions}
          disabled={saving}
          className="w-full bg-accent p-4 rounded-lg font-semibold"
        >
          {saving
            ? (lang === 'fr' ? 'Sauvegarde...' : 'Saving...')
            : (lang === 'fr'
                ? 'Sauvegarder les pronostics'
                : 'Save Predictions')}
        </button>
      )}
    </main>
  );
}