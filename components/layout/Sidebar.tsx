'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Library, Mic2, Music4, Heart, Clock, Disc3 } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Discover' },
  { href: '/library', icon: Library, label: 'Library' },
  { href: '/studio', icon: Music4, label: 'Studio' },
  { href: '/karaoke', icon: Mic2, label: 'Karaoke' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { recentlyPlayed, play } = usePlayerStore();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-30 glass border-r border-white/5">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-xl vasantham-gradient opacity-90 group-hover:opacity-100 transition-opacity" />
            <Disc3 className="absolute inset-0 m-auto w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight gradient-text">Vasantham</h1>
            <p className="text-xs text-white/40">वसन्थम् · Music for All</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 mt-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30 px-3 mb-2">Menu</p>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors',
                  active
                    ? 'bg-primary/20 text-primary-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-4 h-px bg-white/5" />

      {/* Recently Played */}
      <div className="flex-1 overflow-y-auto px-3 min-h-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30 px-3 mb-3 flex items-center gap-2">
          <Clock className="w-3 h-3" /> Recent
        </p>
        {recentlyPlayed.length === 0 && (
          <p className="text-xs text-white/30 px-3">Nothing played yet</p>
        )}
        {recentlyPlayed.slice(0, 8).map((track) => (
          <button
            key={track.id}
            onClick={() => play(track)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div
              className="w-8 h-8 rounded-lg bg-cover bg-center flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundImage: `url(${track.coverUrl})` }}
            />
            <div className="text-left min-w-0">
              <p className="text-xs font-medium text-white/80 truncate group-hover:text-white transition-colors">
                {track.title}
              </p>
              <p className="text-xs text-white/40 truncate">{track.artist}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Favorites quick link */}
      <div className="p-3 border-t border-white/5">
        <Link href="/library?filter=favorites">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-pink-400 hover:bg-pink-500/10 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Favourites</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
