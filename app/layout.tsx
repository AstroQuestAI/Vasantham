import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AudioProvider } from '@/components/AudioProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { MiniPlayer } from '@/components/layout/MiniPlayer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'Vasantham — Creative Music Experience',
  description: 'Explore 50,000+ songs with karaoke, voice changing, raga transposer, remix lab, and more.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-bg text-text font-sans antialiased">
        <AudioProvider>
          <div className="flex min-h-screen">
            {/* Sidebar — hidden on mobile */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 md:ml-64 pb-28 min-h-screen">
              {children}
            </main>
          </div>

          {/* Persistent bottom player */}
          <MiniPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
