import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BadgeCheck, Bot, CalendarCheck2, ClipboardCheck, ShieldCheck, TrendingUp } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/logo';

export default async function Landing(){
  const user=await getCurrentUser(); if(user) redirect(user.role==='provider'?'/pro':'/app');
  return <main className="landing">
    <section className="landing-copy"><Logo/><p className="eyebrow">Sagen. Vergleichen. Buchen. Erledigt.</p><h1>Ein Ansprechpartner.<br/><span>Alles für dein Zuhause.</span></h1><p>Beschreibe in deinen Worten, was erledigt werden soll. Mein Hausmeister findet passende geprüfte Dienstleister, bündelt Angebote, Termine, Kommunikation und Zahlung.</p><div className="landing-actions"><Link className="btn primary" href="/register?role=homeowner">Für Eigenheimbesitzer</Link><Link className="btn dark" href="/register?role=provider">Für Handwerker & Dienstleister</Link></div><Link className="login-link" href="/login">Bereits registriert? Einloggen</Link></section>
    <section className="feature-grid">{[[Bot,'KI-Hausmeister','Versteht deine Anfrage und strukturiert sie automatisch.'],[BadgeCheck,'Geprüfte Partner','Profile, Bewertungen und Verifizierung auf einen Blick.'],[ClipboardCheck,'Angebote vergleichen','Preise, Termine und Leistung transparent vergleichen.'],[CalendarCheck2,'Alles im Blick','Aufträge, Termine, Nachrichten und Dokumente an einem Ort.'],[ShieldCheck,'Sichere Abwicklung','Stripe-Zahlung, nachvollziehbarer Auftragsstatus und Rechnungsbeleg.'],[TrendingUp,'Für Profis','Passende Anfragen, planbare Auslastung und direkte Kommunikation.']].map(([I,t,d]:any)=><article key={t}><I/><div><strong>{t}</strong><p>{d}</p></div></article>)}</section>
  </main>;
}
