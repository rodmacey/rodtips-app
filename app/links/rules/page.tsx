'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function RulesPage() {
  const { lang } = useLanguage();

  return (
    <main className="page-content">
     <div className="document-body">
      <h1 className="text-4xl">
        {lang === 'fr'
          ? 'Règlement'
          : 'Competition Rules'}
      </h1>

      {lang === 'fr' ? (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-2">
              Compétition
            </h2>

            <p>
              RodTips est un concours amical de
              pronostics pour la Coupe du Monde FIFA
              2026.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Pronostics
            </h2>

            <p>
              Les participants peuvent saisir ou
              modifier leurs pronostics jusqu'à
              l'heure de verrouillage du tour.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Verrouillage
            </h2>

            <p>
              Lorsque l'heure limite du tour est
              atteinte, les pronostics deviennent
              définitivement verrouillés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Attribution des points
            </h2>

            <ul className="list-disc pl-5 space-y-1">
              <li>Résultat correct : 1 point</li>
              <li>Buts domicile corrects : 1 point</li>
              <li>Buts extérieur corrects : 1 point</li>
              <li>Score exact : bonus de 1 point</li>
              <li>Maximum : 4 points</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Classement
            </h2>

            <p>
              Les participants sont classés selon :
            </p>

            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li>Total de points</li>
              <li>Scores parfaits (PS)</li>
              <li>Résultats corrects (CR)</li>
              <li>Égalité partagée</li>
            </ol>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-2">
              Competition
            </h2>

            <p>
              RodTips is a friendly prediction
              competition for the FIFA World Cup 2026.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Predictions
            </h2>

            <p>
              Participants may enter or modify
              predictions until the round lock time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Round Locking
            </h2>

            <p>
              Once the lock time is reached,
              predictions become permanently locked.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Scoring
            </h2>

            <ul className="list-disc pl-5 space-y-1">
              <li>Correct result: 1 point</li>
              <li>Correct home goals: 1 point</li>
              <li>Correct away goals: 1 point</li>
              <li>Exact score bonus: 1 point</li>
              <li>Maximum: 4 points</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              Rankings
            </h2>

            <p>
              Participants are ranked by:
            </p>

            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li>Total points</li>
              <li>Perfect Scores (PS)</li>
              <li>Correct Results (CR)</li>
              <li>Shared tie</li>
            </ol>
          </section>
        </>
      )}
    </div>
    </main>
  );
}