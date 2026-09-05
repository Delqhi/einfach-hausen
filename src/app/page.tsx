import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = { alternates: { canonical: canonical('/') } };
import { getCurrentUser } from '@/lib/auth';
import { MarketingShell } from '@/components/marketing/site-shell';
import { MotionPresentation } from '@/components/marketing/motion-presentation';
import { StickyIntake } from '@/components/marketing/sticky-intake';
import {
  Benefits,
  CategoriesCompact,
  FinalCta,
  HomeFaq,
  HomeHero,
  HowItWorks,
  PilotBand,
  ProblemMirror,
  TheSwitch,
  Trust,
} from '@/components/marketing/home-sections';

/**
 * Public landing page. Dramaturgy (see docs/PRODUCT_POSITIONING.md):
 * hook (intake) → mirror the pain → the switch → how it works → what you get
 * → trust → breadth → pilot scarcity → objections → final intake.
 */
export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === 'provider' ? '/pro' : '/app');

  return (
    <MarketingShell footerIntake={false}>
      <HomeHero />
      <MotionPresentation presentationId="home" title="Dein Zuhause. In Bewegung organisiert." />
      <ProblemMirror />
      <TheSwitch />
      <HowItWorks />
      <Benefits />
      <Trust />
      <CategoriesCompact />
      <PilotBand />
      <HomeFaq />
      <FinalCta />
      <StickyIntake />
    </MarketingShell>
  );
}
