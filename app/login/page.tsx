export default function LoginPage() {
    return (
      <main className="p-6">
        <h1 className="text-4xl mb-8">Login</h1>
  
        <div className="space-y-4">
          <input
            className="w-full bg-panel p-4 rounded-lg border border-white/10"
            placeholder="Email"
          />
  
          <input
            type="password"
            className="w-full bg-panel p-4 rounded-lg border border-white/10"
            placeholder="Password"
          />
  
          <button className="w-full bg-accent p-4 rounded-lg font-semibold">
            Login
          </button>
        </div>
      </main>
    );
  }