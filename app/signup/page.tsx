export default function SignupPage() {
    return (
      <main className="p-6">
        <h1 className="text-4xl mb-8">Sign Up</h1>
  
        <div className="space-y-4">
          <input
            className="w-full bg-panel p-4 rounded-lg border border-white/10"
            placeholder="Display name"
          />
  
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
            Create Account
          </button>
        </div>
      </main>
    );
  }