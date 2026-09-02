import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { CardVisual, type CardVisualProps } from '../visuals/CardVisual';
import type { CardVisualKind } from '../visuals/card-visuals';
import styles from './FeatureVisualCard.module.css';

export type FeatureVisualCardProps = {
  href: string;
  title: string;
  description?: string;
  visual: CardVisualKind;
  eyebrow?: string;
  ctaLabel?: string;
  className?: string;
  priorityVisual?: boolean;
  visualSize?: CardVisualProps['size'];
  trailing?: ReactNode;
};

export function FeatureVisualCard({
  href, title, description, visual, eyebrow, ctaLabel = 'Mehr erfahren',
  className, priorityVisual = false, visualSize = 'lg', trailing,
}: FeatureVisualCardProps) {
  return (
    <article className={[styles.card, className].filter(Boolean).join(' ')}>
      <Link href={href} className={styles.link}>
        <span className={styles.copy}>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <h3 className={styles.title}>{title}</h3>
          {description ? <p className={styles.description}>{description}</p> : null}
          <span className={styles.cta}>{ctaLabel}<ArrowRight size={17} aria-hidden="true" /></span>
        </span>
        <CardVisual kind={visual} size={visualSize} priority={priorityVisual} decorative />
        {trailing}
      </Link>
    </article>
  );
}
