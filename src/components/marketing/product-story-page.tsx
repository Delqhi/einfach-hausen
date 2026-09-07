import { MarketingShell } from './site-shell';
import { Steps } from './ui';
import { EHScope, EHSection, EHPageHero, EHList, EHCallout, EHFAQ, EHClosing, EHButton, EHEyebrow, EHHeading, EHText } from '@/design-system';

export type ProductStory = {
  eyebrow: string;
  title: string;
  text: string;
  primaryHref: string;
  primaryLabel: string;
  proofTitle: string;
  proofText: string;
  points: readonly string[];
  steps: ReadonlyArray<{ title: string; text: string }>;
  limits: readonly string[];
  faq: ReadonlyArray<{ q: string; a: string }>;
  ctaTitle: string;
  ctaText: string;
};

export function ProductStoryPage({ story, breadcrumb }: { story: ProductStory; breadcrumb?: React.ReactNode }) {
  return <MarketingShell>
    {breadcrumb}
    <EHScope>
    <EHPageHero eyebrow={story.eyebrow} title={story.title} text={story.text} actions={<><EHButton href={story.primaryHref} arrow>{story.primaryLabel}</EHButton><EHButton href="/so-funktionierts" variant="secondary">So funktioniert&apos;s</EHButton></>} />
    <EHSection compact>
      <EHEyebrow>Was du davon hast</EHEyebrow>
      <EHHeading>{story.proofTitle}</EHHeading>
      <EHText size="lead">{story.proofText}</EHText>
      <EHList label={story.proofTitle} items={story.points.map((p, i) => ({ id: 'story-proof-' + i, title: p }))} />
    </EHSection>
    <EHSection compact>
      <EHEyebrow>Ablauf</EHEyebrow>
      <EHHeading>Klar getrennte Schritte.</EHHeading><Steps items={story.steps} /></EHSection>
    <EHSection compact>
      <EHEyebrow>Wichtig</EHEyebrow>
      <EHHeading>Klare Grenzen statt falscher Versprechen.</EHHeading>
      <EHCallout title="So ist es im Produkt"><EHList label="Grenzen" items={story.limits.map((l, i) => ({ id: "story-limit-" + i, title: l }))} /></EHCallout>
    </EHSection>
    <EHSection compact>
      <EHEyebrow>Häufige Fragen</EHEyebrow>
      <EHHeading>Zu {story.eyebrow}.</EHHeading>
      <EHFAQ items={story.faq.map((f) => ({ q: f.q, a: f.a }))} />
    </EHSection>
    <EHClosing title={story.ctaTitle} text={story.ctaText} href={story.primaryHref} label={story.primaryLabel} secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
    </EHScope>
  </MarketingShell>;
}
