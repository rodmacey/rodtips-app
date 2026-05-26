import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-4xl mb-8">RodTips</h1>

      <div className="space-y-4">
        <Link
          href="/login"
          className="block w-full bg-accent p-4 rounded-lg text-center font-semibold"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="block w-full bg-panel p-4 rounded-lg text-center border border-white/10"
        >
          Create Account
        </Link>
      </div>
    </main>
  );
}