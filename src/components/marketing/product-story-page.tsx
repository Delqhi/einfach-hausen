import { MarketingShell } from './site-shell';
import { BulletList, CtaBand, Faq, InfoPanel, LinkButton, PageHero, Section, Steps } from './ui';

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
    <PageHero eyebrow={story.eyebrow} title={story.title} text={story.text} actions={<><LinkButton href={story.primaryHref}>{story.primaryLabel}</LinkButton><LinkButton href="/so-funktionierts" secondary>So funktioniert&apos;s</LinkButton></>} />
    <Section tone="surface" eyebrow="Was du davon hast" title={story.proofTitle} text={story.proofText}><BulletList items={story.points} /></Section>
    <Section eyebrow="Ablauf" title="Klar getrennte Schritte."><Steps items={story.steps} /></Section>
    <Section tone="soft" eyebrow="Wichtig" title="Klare Grenzen statt falscher Versprechen."><InfoPanel label="So ist es im Produkt"><BulletList items={story.limits} /></InfoPanel></Section>
    <Section eyebrow="Häufige Fragen" title={`Zu ${story.eyebrow}.`} center><Faq items={story.faq} /></Section>
    <CtaBand title={story.ctaTitle} text={story.ctaText} href={story.primaryHref} label={story.primaryLabel} />
  </MarketingShell>;
}
