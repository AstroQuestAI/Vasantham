import { HeroSection } from '@/components/home/HeroSection';
import { MoodGrid } from '@/components/home/MoodGrid';
import { TrendingRail } from '@/components/home/TrendingRail';
import { RagaSection } from '@/components/home/RagaSection';
import { GenerationSection } from '@/components/home/GenerationSection';
import { sampleTracks } from '@/lib/data/sampleMedia';

export default function HomePage() {
  const devotionalTracks = sampleTracks.filter((t) => t.mood === 'Devotional').slice(0, 8);
  const classicalTracks = sampleTracks.filter(
    (t) => t.genre === 'Carnatic Classical' || t.genre === 'Hindustani Classical'
  ).slice(0, 8);

  return (
    <div>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h1 className="font-display font-bold text-xl gradient-text">Vasantham</h1>
          <p className="text-xs text-white/40">Music for all generations</p>
        </div>
        <div className="w-9 h-9 rounded-xl vasantham-gradient flex items-center justify-center text-sm">🎵</div>
      </div>

      <HeroSection />

      <div className="mt-8">
        <MoodGrid />
        <TrendingRail />
        <TrendingRail title="Devotional & Bhakti" tracks={devotionalTracks} showRank={false} />
        <RagaSection />
        <GenerationSection />
        <TrendingRail title="Indian Classical" tracks={classicalTracks} showRank={false} />
      </div>

      {/* Footer space */}
      <div className="h-6" />
    </div>
  );
}
