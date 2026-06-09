'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';

type Round = {
  id: string;
  name_en: string;
  name_fr: string;
  lock_time: string;
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
  group_code: string | null;
};

type Prediction = {
  match_id: string;
  predicted_home: number | null;
  predicted_away: number | null;
  points_awarded: number;
};

export default function PredictionsPage() {
  const { lang } = useLanguage();

  const [userId, setUserId] = useState('');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function loadRound(roundId: string, currentUserId: string) {
    const { data: matchesData } = await supabase
      .from('matches')
      .select('*')
      .eq('round_id', roundId)
      .order('match_order');

    setMatches(matchesData || []);

    const matchIds = matchesData?.map((m) => m.id) || [];

    if (!matchIds.length) {
      setPredictions({});
      return;
    }

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
        .order('display_order');

      if (!roundsData?.length) return;

      setRounds(roundsData);

      const now = new Date().toISOString();

      const currentRound =
        roundsData.find((r) => r.lock_time >= now) ||
        roundsData[0];

      setSelectedRoundId(currentRound.id);

      await loadRound(currentRound.id, user.id);
    }

    init();
  }, []);

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
            ? value === ''
              ? null
              : Number(value)
            : prev[matchId]?.predicted_home ?? null,
        predicted_away:
          field === 'predicted_away'
            ? value === ''
              ? null
              : Number(value)
            : prev[matchId]?.predicted_away ?? null,
        points_awarded:
          prev[matchId]?.points_awarded ?? 0
      }
    }));
  }

  async function savePredictions() {
    setSaving(true);
    setSaved(false);

    const payload = Object.values(predictions)
      .filter(
        (p) =>
          p.predicted_home !== null &&
          p.predicted_away !== null
      )
      .map((p) => ({
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
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  const selectedRound = rounds.find(
    (r) => r.id === selectedRoundId
  );

  const isLocked = selectedRound
    ? new Date() > new Date(selectedRound.lock_time)
    : false;

  const grouped = matches.reduce((acc, match) => {
    const key = match.group_code || 'knockout';

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(match);

    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <main className="p-6 space-y-5">
      <h1 className="text-4xl">
        {lang === 'fr'
          ? 'Pronostics'
          : 'Predictions'}
      </h1>

      <select
        value={selectedRoundId}
        onChange={async (e) => {
          setSelectedRoundId(e.target.value);
          await loadRound(e.target.value, userId);
        }}
        className="w-full bg-panel p-4 rounded-lg"
      >
        {rounds.map((round) => (
          <option key={round.id} value={round.id}>
            {lang === 'fr'
              ? round.name_fr
              : round.name_en}
          </option>
        ))}
      </select>

      <div
        className={
          isLocked
            ? 'text-accent'
            : 'text-textMuted'
        }
      >
        {lang === 'fr'
          ? isLocked
            ? '🔒 Pronostics verrouillés'
            : '🟢 Pronostics ouverts'
          : isLocked
            ? '🔒 Predictions Locked'
            : '🟢 Predictions Open'}
      </div>


      {Object.entries(grouped).map(([group, groupMatches]) => (
        <div key={group} className="space-y-3">
          {group !== 'knockout' && (
            <h2 className="text-xl font-semibold">
              {lang === 'fr'
                ? 'Groupe'
                : 'Group'}{' '}
              {group}
            </h2>
          )}

          {groupMatches.map((match) => {
            const prediction = predictions[match.id];

            return (
              <div
                key={match.id}
                className="bg-panel rounded-xl p-4 border border-white/10"
              >
                <div className="text-sm text-textMuted mb-3 text-center">
                  {new Date(match.kickoff_time_utc).toLocaleDateString(
                    lang === 'fr' ? 'fr-FR' : 'en-GB',
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }
                  )}
                  {' • '}
                  {new Date(match.kickoff_time_utc).toLocaleTimeString(
                    lang === 'fr' ? 'fr-FR' : 'en-GB',
                    {
                      hour: '2-digit',
                      minute: '2-digit'
                    }
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-right">
                    {lang === 'fr'
                      ? match.home_label_fr
                      : match.home_label_en}
                  </span>

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

                  <span>v</span>

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

                  <span>
                    {lang === 'fr'
                      ? match.away_label_fr
                      : match.away_label_en}
                  </span>
                </div>

                {match.is_complete && (
                  <div className="mt-3 text-sm text-textMuted text-center">
                    {lang === 'fr'
                      ? 'Résultat'
                      : 'Result'}
                    : {match.home_score}–{match.away_score}
                    {' • '}
                    {lang === 'fr'
                      ? 'Points'
                      : 'Points'}
                    : {prediction?.points_awarded ?? 0}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {!isLocked && (
        <>
          <button
            onClick={savePredictions}
            disabled={saving}
            className="w-full bg-accent p-4 rounded-lg font-semibold"
          >
            {saving
              ? lang === 'fr'
                ? 'Sauvegarde...'
                : 'Saving...'
              : lang === 'fr'
                ? 'Sauvegarder les pronostics'
                : 'Save Predictions'}
          </button>

          {saved && (
            <div className="text-green-400 text-center">
              {lang === 'fr'
                ? '✓ Sauvegardé'
                : '✓ Saved'}
            </div>
          )}
        </>
      )}
    </main>
  );
}