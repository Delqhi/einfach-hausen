import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BadgeCheck,Bot,CalendarCheck2,Camera,Crown,ShieldCheck,Sparkles } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/logo';

export default async function Landing(){
  const user=await getCurrentUser(); if(user)redirect(user.role==='provider'?'/pro':'/app');
  return <main className="landing">
    <section className="landing-copy"><Logo/><p className="eyebrow">Sagen. Vergleichen. Buchen. Erledigt.</p><h1>Du sagst, was dein Haus braucht.<br/><span>Wir kümmern uns um den Rest.</span></h1><p>Einfach Hausen ist dein digitaler Hausmeister: Die KI versteht deine Anfrage, klärt nur fehlende Infos, findet geprüfte regionale Vertragspartner und vergleicht Angebote. Nach der Buchung bekommst du einen echten persönlichen Ansprechpartner beim ausführenden Betrieb.</p><div className="landing-actions"><Link className="btn primary" href="/register?role=homeowner">KI-Hausmeister starten</Link><Link className="btn dark" href="/register?role=provider">Vertragspartner werden</Link></div><Link className="login-link" href="/login">Bereits registriert? Einloggen</Link></section>
    <section className="feature-grid">{[[Bot,'Eine Anlaufstelle','Du sagst deinem KI-Hausmeister, was dein Haus braucht. Er organisiert die passende Lösung.'],[Camera,'Schreiben, Foto, Sprache','Keine Kategorienwand. Beschreibe einfach, was erledigt werden soll.'],[BadgeCheck,'Vertragspartner statt Börse','Nur geprüfte, vertraglich gebundene regionale Fachbetriebe erhalten Anfragen.'],[Sparkles,'KI-Vergleich','Richtpreis, Empfehlung, günstigstes Angebot und schnellster Termin.'],[CalendarCheck2,'Hausakte & Jahresplan','Aufträge, Technik, Dokumente und Wartungen bleiben dauerhaft im Blick.'],[Crown,'Mitgliedschaften & Pakete','Free, Plus, Premium sowie Haus-, Garten- und Technik-Jahrespakete.'],[ShieldCheck,'Menschlicher Ansprechpartner','Nach der Buchung hast du einen konkreten Menschen beim Partnerbetrieb für Nachrichten, Anrufe und Termine.']].map(([I,t,d]:any)=><article key={t}><I/><div><strong>{t}</strong><p>{d}</p></div></article>)}</section>
  </main>;
}
