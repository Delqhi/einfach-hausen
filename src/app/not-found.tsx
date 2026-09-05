import Link from 'next/link';
import { headers } from 'next/headers';
import { LexikonNotFound } from '@/components/marketing/lexikon/lexikon-not-found';

export default async function NotFound() {
  const originalPath = (await headers()).get('x-original-path') ?? '';
  if (originalPath.startsWith('/lexikon/')) return <LexikonNotFound />;

  return (
    <main className="nf-shell">
      {/* Dekorative Hausszene: reine CSS/SVG-Illustration */}
      <div className="nf-scene" aria-hidden="true">
        <svg viewBox="0 0 240 140" fill="none" className="nf-house">
          <path d="M20 70 L110 14 L200 70" stroke="#105258" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M155 34 V8 H178 V48" stroke="#105258" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M46 64 V126 H174 V64" stroke="#0d4448" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="96" y="88" width="30" height="38" rx="2" stroke="#0d4448" strokeWidth="3.4"/>
          <path d="M96 107 h30" stroke="#0d4448" strokeWidth="2.6"/>
          <circle cx="86" cy="52" r="4" fill="#105258"/>
          <path d="M60 46 q8 -6 16 0" stroke="#1b8569" strokeWidth="2.6" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="nf-eyebrow">404</span>
      <h1>Das gibt es hier nicht.</h1>
      <p>Diese Seite oder dieser Auftrag existiert nicht (mehr). Von der Startseite findest du alles wieder.</p>
      <div className="nf-actions">
        <Link className="nf-primary" href="/">Zur Startseite</Link>
        <Link className="nf-ghost" href="/hilfe">Zur Hilfe</Link>
      </div>
    </main>
  );
}
