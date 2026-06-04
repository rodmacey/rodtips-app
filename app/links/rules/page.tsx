'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function RulesPage() {
  const { lang } = useLanguage();

  return (
    <main className="page-content">
      <div className="document-body">
        <h1 className="page-title">
          {lang === 'fr' ? 'Règlement' : 'Competition Rules'}
        </h1>

        {lang === 'fr' ? (
          <>
            <section className="rules-section">
              <h2 className="section-title">Compétition</h2>
              <p>
                RodTips est une compétition de pronostics pour les tournois de
                football. Les participants soumettent des pronostics de score
                et gagnent des points selon la précision de leurs prédictions.
                Les classements sont mis à jour automatiquement pendant toute
                la durée du tournoi.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Pronostics</h2>
              <p>
                Les participants peuvent saisir ou modifier leurs pronostics
                jusqu&apos;à l&apos;heure de verrouillage du tour.
              </p>
              <p>
                Assurez-vous que tous vos pronostics sont saisis avant le
                verrouillage du tour. Les matchs sans pronostic ou avec un
                pronostic incomplet rapporteront zéro (0) point.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Verrouillage des tours</h2>
              <p>
                Chaque tour possède une heure de verrouillage correspondant au
                coup d&apos;envoi du premier match du tour.
              </p>
              <p>
                Cette heure est affichée au-dessus des matchs du tour.
              </p>
              <p>
                Une fois le tour verrouillé, les pronostics ne peuvent plus être
                créés ni modifiés.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Attribution des points</h2>

              <ul className="rules-list">
                <li>Résultat correct : 1 point</li>
                <li>Buts domicile corrects : 1 point</li>
                <li>Buts extérieur corrects : 1 point</li>
                <li>Bonus score exact : 1 point</li>
              </ul>

              <p>Maximum : 4 points par match.</p>

              <p>
                Tous les pronostics concernent le score à la fin du temps
                réglementaire (90 minutes plus le temps additionnel).
              </p>

              <p>Exemple (résultat réel : 2–1)</p>

              <div className="overflow-x-auto">
                <table className="w-full mt-3 mb-3">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Pronostic</th>
                      <th className="text-left py-2">Points</th>
                      <th className="text-left py-2">Explication</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>2–1</td>
                      <td>4</td>
                      <td>
                        Résultat correct, buts domicile corrects, buts extérieur
                        corrects, bonus score exact
                      </td>
                    </tr>

                    <tr>
                      <td>2–0</td>
                      <td>2</td>
                      <td>
                        Résultat correct, buts domicile corrects
                      </td>
                    </tr>

                    <tr>
                      <td>1–0</td>
                      <td>1</td>
                      <td>Résultat correct</td>
                    </tr>

                    <tr>
                      <td>2–3</td>
                      <td>1</td>
                      <td>Buts domicile corrects</td>
                    </tr>

                    <tr>
                      <td>0–1</td>
                      <td>1</td>
                      <td>Buts extérieur corrects</td>
                    </tr>

                    <tr>
                      <td>0–0</td>
                      <td>0</td>
                      <td>
                        Résultat incorrect, aucun nombre de buts correct
                      </td>
                    </tr>

                    <tr>
                      <td>1–2</td>
                      <td>0</td>
                      <td>
                        Résultat incorrect, aucun nombre de buts correct
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Classement</h2>

              <p>
                Les participants sont classés selon les critères suivants :
              </p>

              <ol className="rules-list">
                <li>Total des points</li>
                <li>PS (Perfect Score)</li>
                <li>CR (Correct Result)</li>
                <li>Classement partagé</li>
              </ol>

              <p>PS = Perfect Score (résultat parfait)</p>

              <p>
                Un résultat parfait correspond à un score exact correctement
                prédit.
              </p>

              <p>Exemple : pronostic 2–1, résultat 2–1.</p>

              <p>CR = Correct Result (résultat correct)</p>

              <p>
                Un résultat correct correspond au bon résultat du match sans
                nécessairement prédire le score exact.
              </p>

              <p>Exemple : pronostic 3–1, résultat 2–0.</p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Groupe WhatsApp</h2>

              <p>
                Le groupe WhatsApp est le canal de communication recommandé pour
                les participants. Les annonces, rappels et informations
                importantes peuvent y être publiés.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Résultats des matchs</h2>

              <p>
                Les résultats pris en compte correspondent au score à la fin du
                temps réglementaire, y compris le temps additionnel.
              </p>

              <p>
                Les prolongations et les tirs au but ne sont pas pris en compte
                pour l&apos;attribution des points.
              </p>

              <p>Exemple :</p>

              <ul className="rules-list">
                <li>Score après 90 minutes + temps additionnel : 1–1</li>
                <li>Score après prolongation : 2–1</li>
              </ul>

              <p>Le résultat officiel RodTips est 1–1.</p>

              <p>
                Les résultats et les points deviennent définitifs dès qu&apos;un
                résultat est saisi et validé dans RodTips.
              </p>

              <p>
                Toute modification ultérieure apportée par l&apos;organisateur
                officiel du tournoi n&apos;affectera pas les points ou
                classements déjà attribués.
              </p>

              <p>
                Une note pourra être affichée si un résultat officiel a été
                modifié après l&apos;attribution des points.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">
                Matchs interrompus ou rejoués
              </h2>

              <p>
                Si un match est interrompu, abandonné ou rejoué, les
                pronostics seront évalués à partir du résultat officiel final du
                match complété.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">
                Esprit de la compétition
              </h2>

              <p>
                Les participants sont invités à faire preuve de respect et de
                fair-play envers les autres participants.
              </p>
            </section>

            <div className="mt-10 text-sm text-textMuted">
              Dernière mise à jour : juin 2026
            </div>
          </>
        ) : (
          <>
            <section className="rules-section">
              <h2 className="section-title">Competition</h2>

              <p>
                RodTips is a prediction competition for football tournaments.
                Participants submit score predictions and earn points based on
                the accuracy of their predictions. Rankings are updated
                automatically throughout the tournament.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Predictions</h2>

              <p>
                Participants may enter or modify predictions until the round
                lock time.
              </p>

              <p>
                Make sure that all predictions are entered before each round is
                locked. Blank or incomplete match predictions will score zero
                (0) points.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Round Locking</h2>

              <p>
                Each round has a lock time corresponding to the kickoff time of
                the first match in that round.
              </p>

              <p>
                The lock time is displayed above the matches for each round.
              </p>

              <p>
                Once a round is locked, predictions can no longer be created or
                modified.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Scoring System</h2>

              <ul className="rules-list">
                <li>Correct result: 1 point</li>
                <li>Correct home goals: 1 point</li>
                <li>Correct away goals: 1 point</li>
                <li>Exact score bonus: 1 point</li>
              </ul>

              <p>Maximum: 4 points per match.</p>

              <p>
                All predictions relate to the score at the end of regular
                playing time (90 minutes plus stoppage time).
              </p>

              <p>Example (actual score: 2–1)</p>

              <div className="overflow-x-auto">
                <table className="w-full mt-3 mb-3">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Prediction</th>
                      <th className="text-left py-2">Points</th>
                      <th className="text-left py-2">Explanation</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>2–1</td>
                      <td>4</td>
                      <td>
                        Correct result, correct home goals, correct away goals,
                        exact score bonus
                      </td>
                    </tr>

                    <tr>
                      <td>2–0</td>
                      <td>2</td>
                      <td>
                        Correct result, correct home goals
                      </td>
                    </tr>

                    <tr>
                      <td>1–0</td>
                      <td>1</td>
                      <td>Correct result</td>
                    </tr>

                    <tr>
                      <td>2–3</td>
                      <td>1</td>
                      <td>Correct home goals</td>
                    </tr>

                    <tr>
                      <td>0–1</td>
                      <td>1</td>
                      <td>Correct away goals</td>
                    </tr>

                    <tr>
                      <td>0–0</td>
                      <td>0</td>
                      <td>
                        Incorrect result, no correct goal predictions
                      </td>
                    </tr>

                    <tr>
                      <td>1–2</td>
                      <td>0</td>
                      <td>
                        Incorrect result, no correct goal predictions
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Leaderboard</h2>

              <p>
                Participants are ranked according to:
              </p>

              <ol className="rules-list">
                <li>Total Points</li>
                <li>PS (Perfect Score)</li>
                <li>CR (Correct Result)</li>
                <li>Shared Ranking</li>
              </ol>

              <p>PS = Perfect Score</p>

              <p>
                A Perfect Score is awarded when the exact score is predicted.
              </p>

              <p>Example: prediction 2–1, result 2–1.</p>

              <p>CR = Correct Result</p>

              <p>
                A Correct Result is awarded when the correct match outcome is
                predicted without necessarily predicting the exact score.
              </p>

              <p>Example: prediction 3–1, result 2–0.</p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">WhatsApp Group</h2>

              <p>
                The WhatsApp group is the recommended communication channel for
                participants. Competition announcements, reminders and important
                information may be posted there.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">Match Results</h2>

              <p>
                Match results are based on the score at the end of regular
                playing time, including stoppage time.
              </p>

              <p>
                Extra time and penalty shootouts are not considered when
                determining match results for RodTips scoring purposes.
              </p>

              <p>Example:</p>

              <ul className="rules-list">
                <li>
                  Score after 90 minutes plus stoppage time: 1–1
                </li>

                <li>
                  Score after extra time: 2–1
                </li>
              </ul>

              <p>The official RodTips result is 1–1.</p>

              <p>
                Match results and points become final once a result has been
                entered and scored in RodTips.
              </p>

              <p>
                Subsequent changes to official competition records will not
                affect previously awarded points or rankings.
              </p>

              <p>
                A note may be displayed if an official result is amended after
                points have been awarded.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">
                Suspended or Abandoned Matches
              </h2>

              <p>
                If a match is suspended, abandoned or replayed, predictions
                will be scored using the final official result of the completed
                match.
              </p>
            </section>

            <section className="rules-section">
              <h2 className="section-title">
                Spirit of the Competition
              </h2>

              <p>
                Participants are expected to show good sportsmanship and respect
                towards other participants.
              </p>
            </section>

            <div className="mt-10 text-sm text-textMuted">
              Last updated: June 2026
            </div>
          </>
        )}
      </div>
    </main>
  );
}