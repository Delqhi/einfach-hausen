'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Pause, Play, Sparkles } from 'lucide-react';
import styles from './motion-presentation.module.css';

type MotionPresentationProps = {
  presentationId: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function MotionPresentation({
  presentationId,
  eyebrow = 'Motion-Story · 12 Sekunden',
  title = 'So wird aus deinem Anliegen ein klarer nächster Schritt.',
  description = 'Eine kurze visuelle Zusammenfassung — passend zu genau diesem Thema.',
}: MotionPresentationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleId = useId();
  const [playing, setPlaying] = useState(false);
  const video = `/media/presentations/${presentationId}.mp4`;
  const poster = `/media/presentations/${presentationId}.jpg`;

  const syncPreference = useCallback(() => {
    const element = videoRef.current;
    if (!element) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      element.pause();
      return;
    }
    void element.play().catch(() => {
      // Autoplay can be blocked by the browser; the poster remains the fallback.
    });
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    syncPreference();
    const onChange = () => syncPreference();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [syncPreference, video]);

  const togglePlayback = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      void element.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      element.pause();
      setPlaying(false);
    }
  };
  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}><Sparkles size={16} aria-hidden="true" /> {eyebrow}</span>
          <h2 id={titleId}>{title}</h2>
          <p>{description}</p>
          <div className={styles.meta}>
            <span>Remotion</span><span>1920 × 1080</span><span>30 fps</span>
          </div>
        </div>
        <div className={styles.stage}>
          <video
            ref={videoRef}
            className={styles.video}
            muted
            playsInline
            loop
            preload="metadata"
            poster={poster}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label={`Animierte Präsentation: ${title}`}
          >
            <source src={video} type="video/mp4" />
          </video>          <div className={styles.controls}>
            <button type="button" className={styles.playButton} onClick={togglePlayback} aria-label={playing ? 'Präsentation pausieren' : 'Präsentation abspielen'}>
              {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
              {playing ? 'Pause' : 'Abspielen'}
            </button>
            <span className={styles.duration}>12 s · ohne Ton</span>
          </div>
        </div>
      </div>
    </section>
  );
}
