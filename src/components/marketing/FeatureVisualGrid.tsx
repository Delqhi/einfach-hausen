import type { FeatureVisualCardProps } from './FeatureVisualCard';
import { FeatureVisualCard } from './FeatureVisualCard';
import styles from './FeatureVisualGrid.module.css';

export type FeatureVisualGridProps = {
  items: readonly FeatureVisualCardProps[];
  className?: string;
};

export function FeatureVisualGrid({ items, className }: FeatureVisualGridProps) {
  return (
    <div className={[styles.grid, className].filter(Boolean).join(' ')}>
      {items.map((item) => <FeatureVisualCard key={`${item.href}-${item.visual}`} {...item} />)}
    </div>
  );
}
