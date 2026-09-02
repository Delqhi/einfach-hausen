import Image from 'next/image';
import type { CSSProperties } from 'react';
import { CARD_VISUALS, type CardVisualKind } from './card-visuals';
import styles from './CardVisual.module.css';

type CardVisualSize = 'sm' | 'md' | 'lg' | 'xl';

export type CardVisualProps = {
  kind: CardVisualKind;
  size?: CardVisualSize;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
  sizes?: string;
};

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export function CardVisual({
  kind,
  size = 'md',
  className,
  priority = false,
  decorative = false,
  sizes = '(max-width: 640px) 72vw, (max-width: 1024px) 34vw, 320px',
}: CardVisualProps) {
  const visual = CARD_VISUALS[kind];
  const style = { '--card-visual-src': `url(${visual.src})` } as CSSProperties;

  return (
    <span
      className={cx(styles.root, styles[size], className)}
      data-card-visual={kind}
      aria-hidden={decorative || undefined}
      style={style}
    >
      <Image
        src={visual.src}
        alt={decorative ? '' : visual.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={styles.image}
      />
    </span>
  );
}
