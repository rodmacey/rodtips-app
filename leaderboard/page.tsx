const standings = [
    { name: 'Sarah', points: 84 },
    { name: 'Mike', points: 82 },
    { name: 'Dave', points: 77 }
  ];
  
  export default function LeaderboardPage() {
    return (
      <main className="p-6">
        <h1 className="text-4xl mb-6">Leaderboard</h1>
  
        <div className="space-y-3">
          {standings.map((player, index) => (
            <div
              key={player.name}
              className="bg-panel rounded-xl p-4 border border-white/10 flex justify-between"
            >
              <span>
                {index + 1}. {player.name}
              </span>
              <span>{player.points} pts</span>
            </div>
          ))}
        </div>
      </main>
    );
  }