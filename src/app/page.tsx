import { HeroSection } from '@/components/home/HeroSection'
import { MarqueeTicker } from '@/components/home/MarqueeTicker'
import { StandingsSummary } from '@/components/home/StandingsSummary'
import { CupsSection } from '@/components/home/CupsSection'
import { getNextRaceDay, getAllStandings } from '@/lib/actions'

export default async function HomePage() {
  const [nextRaceDay, standings] = await Promise.all([
    getNextRaceDay(),
    getAllStandings(),
  ])

  return (
    <main>
      <HeroSection nextRaceDay={nextRaceDay} />
      <MarqueeTicker />
      <StandingsSummary standings={standings} />
      <CupsSection />
    </main>
  )
}
