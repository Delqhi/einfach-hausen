import Link from 'next/link';
import Image from 'next/image';
import logoMark from '@/components/marketing/assets/logo-mark.png';

export default function NotFound() {
  return (
    <main className="nf-shell">
      <Image src={logoMark} alt="" width={44} height={33} className="nf-mark" priority />
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
