export default function DashboardPage() {
    return (
      <main className="p-6 space-y-5">
        <h1 className="text-4xl">Dashboard</h1>
  
        <div className="bg-panel rounded-xl p-5 border border-white/10">
          <div className="text-textMuted text-sm">Current Round</div>
          <div className="text-2xl mt-2">Group Matchday 1</div>
          <div className="text-accent mt-3">Locks in 03:22:00</div>
        </div>
  
        <div className="bg-panel rounded-xl p-5 border border-white/10">
          <div className="text-textMuted text-sm">Prediction Progress</div>
          <div className="text-2xl mt-2">0 / 16 completed</div>
        </div>
      </main>
    );
  }