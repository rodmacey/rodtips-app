const mockMatches = [
    { id: 1, home: 'France', away: 'Brazil' },
    { id: 2, home: 'England', away: 'Spain' },
    { id: 3, home: 'Germany', away: 'Portugal' }
  ];
  
  export default function PredictionsPage() {
    return (
      <main className="p-6">
        <h1 className="text-4xl mb-6">Predictions</h1>
  
        <div className="space-y-4">
          {mockMatches.map((match) => (
            <div
              key={match.id}
              className="bg-panel rounded-xl p-4 border border-white/10"
            >
              <div className="flex justify-between items-center">
                <span>{match.home}</span>
  
                <div className="flex gap-2">
                  <input className="w-12 h-12 rounded-lg bg-black/20 text-center" />
                  <input className="w-12 h-12 rounded-lg bg-black/20 text-center" />
                </div>
  
                <span>{match.away}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }