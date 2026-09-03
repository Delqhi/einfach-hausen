"use client";

import { useEffect, useRef } from 'react';
import { lazyLoad } from 'unlazy';

type Props = {
  src: string;
  alt: string;
  /** BlurHash-String (blurha.sh) - wird als unscharfer Inline-Platzhalter dekodiert */
  blurhash?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

/**
 * Unlazy-Integration: laedt Bilder erst im Viewport; mit BlurHash wird ein
 * unscharfer Platzhalter inline als data-URI generiert. Fuer alle kuenftigen
 * Fotos auf der Website (Team, Partner, Referenzen).
 */
export function LazyImage({ src, alt, blurhash, width, height, className, priority }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (priority) return;
    const img = ref.current;
    if (!img) return;
    const cleanup = lazyLoad(img, { hash: blurhash || true, hashType: 'blurhash' });
    return () => cleanup?.();
  }, [src, blurhash, priority]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={priority ? src : undefined}
      data-src={priority ? undefined : src}
      data-blurhash={blurhash}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
