import './globals.css';
import BottomNav from '../components/BottomNav';

export const metadata = {
  title: 'RodTips',
  description: 'Football tipping competition'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-md mx-auto min-h-screen bg-bg pb-24">
          <header className="sticky top-0 z-50 bg-bg border-b border-white/10 px-5 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-wide">RodTips</div>
            <div className="text-sm text-textMuted">EN / FR</div>
          </header>

          {children}

          <BottomNav />
        </div>
      </body>
    </html>
  );
}