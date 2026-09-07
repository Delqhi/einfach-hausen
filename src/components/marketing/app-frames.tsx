import {
  Bell,
  Calendar,
  Check,
  FileText,
  Flame,
  Home,
  MessageCircle,
  Phone,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import s from './app-frames.module.css';

/**
 * Realistic mockups of the homeowner app, rendered as React so they stay
 * sharp, editable and consistent with the real product (DESIGN.md app contract).
 * Purely decorative: wrapped in aria-hidden by default.
 */

export function AppFrame({ children, size = 'md', label }: { children: React.ReactNode; size?: 'md' | 'sm'; label?: string }) {
  return (
    <div className={`${s.frame} ${size === 'sm' ? s.frameSm : ''}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <span className={s.notch} />
      <div className={s.screen}>
        <div className={s.status}><span>9:41</span><span>●●●</span></div>
        {children}
      </div>
    </div>
  );
}

export function HomeScreen() {
  return (
    <>
      <div className={s.bar}><small>Guten Morgen, Familie Bauer</small><strong>Dein Haus, Ahornweg 12</strong></div>
      <div className={s.body}>
        <div className={s.tile}>
          <span className={s.pillTerra}><Bell size={11} /> Heute fällig</span>
          <div className={s.tileRow}>
            <span className={s.iconWarm}><Flame size={16} /></span>
            <div><strong>Heizungswartung</strong><span>Letzte Wartung vor 14 Monaten</span></div>
          </div>
        </div>
        <div className={s.tile}>
          <span className={s.pillTeal}><Wrench size={11} /> In Bearbeitung</span>
          <div className={s.tileRow}>
            <span className={s.icon}><Home size={16} /></span>
            <div><strong>Dachrinne reinigen</strong><span>Termin Do, 14:00 · Fa. Kessler</span></div>
          </div>
        </div>
        <span className={s.section}>Hausakte</span>
        <div className={s.tile}>
          <div className={s.tileRow}><span className={s.iconSand}><FileText size={16} /></span><div><strong>Garantie Wärmepumpe</strong><span>gültig bis 03/2029</span></div></div>
        </div>
        <div className={s.tile}>
          <div className={s.tileRow}><span className={s.icon}><Receipt size={16} /></span><div><strong>Rechnung Maler Schuster</strong><span>2.140 € · abgelegt am 12.05.</span></div></div>
        </div>
        <span className={s.section}>Dein Ansprechpartner</span>
        <div className={s.tile}>
          <div className={s.person}><span className={s.avatar}>MK</span><div><strong>Markus Kessler</strong><span>meldet sich bis Mittwoch</span></div></div>
        </div>
        <div className={s.cta}><Sparkles size={14} /> Neues Anliegen beschreiben</div>
      </div>
    </>
  );
}

export function HausakteScreen() {
  return (
    <>
      <div className={s.bar}><small>Hausakte</small><strong>Heizung &amp; Warmwasser</strong></div>
      <div className={s.body}>
        <div className={s.tile}>
          <span className={s.pillGreen}><ShieldCheck size={11} /> Garantie aktiv</span>
          <div className={s.tileRow}><span className={s.icon}><Flame size={16} /></span><div><strong>Wärmepumpe Vitocal 250</strong><span>Eingebaut 03/2024 · Fa. Brandt</span></div></div>
        </div>
        <span className={s.section}>Verlauf</span>
        <div className={s.tl}>
          <div className={s.tlRow}><div className={s.tlRail}><i className={s.tlDot} /><i className={s.tlLine} /></div><div className={s.tlBody}><small>Mai 2026</small><strong>Wartung durchgeführt</strong></div></div>
          <div className={s.tlRow}><div className={s.tlRail}><i className={s.tlDot} /><i className={s.tlLine} /></div><div className={s.tlBody}><small>März 2025</small><strong>Rechnung 1.240 € abgelegt</strong></div></div>
          <div className={s.tlRow}><div className={s.tlRail}><i className={s.tlDot} /><i className={s.tlLine} /></div><div className={s.tlBody}><small>März 2024</small><strong>Einbau + Garantieurkunde</strong></div></div>
        </div>
        <div className={s.tile}>
          <div className={s.tileRow}><span className={s.iconSand}><Receipt size={16} /></span><div><strong>3 Dokumente</strong><span>Rechnung, Garantie, Protokoll</span></div></div>
        </div>
      </div>
    </>
  );
}

export function ReminderScreen() {
  return (
    <>
      <div className={s.bar}><small>Erinnerungen</small><strong>Was ansteht</strong></div>
      <div className={s.body}>
        <div className={s.tile}>
          <span className={s.pillTerra}><Bell size={11} /> Diese Woche</span>
          <div className={s.tileRow}><span className={s.iconWarm}><Flame size={16} /></span><div><strong>Heizungswartung</strong><span>Empfohlen alle 12 Monate</span></div></div>
          <div className={s.actions}><span><Check size={13} /> Organisieren lassen</span></div>
        </div>
        <div className={s.tile}>
          <span className={s.pillSand}><Calendar size={11} /> Oktober</span>
          <div className={s.tileRow}><span className={s.iconSand}><Home size={16} /></span><div><strong>Dachrinnen vor dem Winter</strong><span>Letztes Jahr: 180 €</span></div></div>
        </div>
        <div className={s.tile}>
          <span className={s.pillTeal}><Calendar size={11} /> Dezember</span>
          <div className={s.tileRow}><span className={s.icon}><ShieldCheck size={16} /></span><div><strong>Rauchmelder prüfen</strong><span>Gesetzliche Pflicht</span></div></div>
        </div>
      </div>
    </>
  );
}

export function ContactScreen() {
  return (
    <>
      <div className={s.bar}><small>Dein Vorgang · Dachrinne</small><strong>Dein Ansprechpartner</strong></div>
      <div className={s.body}>
        <div className={s.tile}>
          <div className={s.person}>
            <span className={s.avatar}>MK</span>
            <div><strong>Markus Kessler</strong><span>Dachdeckerei Kessler · 6 km entfernt</span></div>
          </div>
          <div className={s.actions}><span><Phone size={13} /> Anrufen</span><span><MessageCircle size={13} /> Nachricht</span></div>
        </div>
        <span className={s.section}>Verlauf</span>
        <div className={s.bubble}>Guten Tag Frau Bauer, ich schaue mir das Donnerstag um 14 Uhr an. Passt das?</div>
        <div className={s.bubbleMe}>Passt, danke!</div>
        <div className={s.bubble}>Perfekt. Ich bringe die Leiter mit, Sie müssen nichts vorbereiten.</div>
      </div>
    </>
  );
}

export function OrderStatusScreen() {
  return (
    <>
      <div className={s.bar}><small>Vorgang #2418</small><strong>Dachrinne reinigen</strong></div>
      <div className={s.body}>
        <div className={s.tile}>
          <div className={s.progress}><i data-on="true" /><i data-on="true" /><i data-on="true" /><i /></div>
          <div className={s.tileRow}><div><strong>Termin bestätigt</strong><span>Do, 14:00 · Fa. Kessler</span></div><span className={s.pillTeal}>Schritt 3/4</span></div>
        </div>
        <div className={s.tl}>
          <div className={s.tlRow}><div className={s.tlRail}><i className={s.tlDot} /><i className={s.tlLine} /></div><div className={s.tlBody}><small>Mo 09:12</small><strong>Anliegen beschrieben</strong></div></div>
          <div className={s.tlRow}><div className={s.tlRail}><i className={s.tlDot} /><i className={s.tlLine} /></div><div className={s.tlBody}><small>Mo 11:40</small><strong>Passender Partner gefunden</strong></div></div>
          <div className={s.tlRow}><div className={s.tlRail}><i className={s.tlDot} /><i className={s.tlLine} /></div><div className={s.tlBody}><small>Di 08:05</small><strong>Termin von dir bestätigt</strong></div></div>
          <div className={s.tlRow}><div className={s.tlRail}><i className={`${s.tlDot} ${s.tlDotSand}`} /><i className={s.tlLine} /></div><div className={s.tlBody}><small>offen</small><strong>Erledigt &amp; in der Hausakte</strong></div></div>
        </div>
        <div className={s.tile}><div className={s.tileRow}><span className={s.iconSand}><Receipt size={16} /></span><div><strong>Kostenrahmen 160–200 €</strong><span>Rechnung landet automatisch in der Akte</span></div></div></div>
      </div>
    </>
  );
}

/** Frameless mini tiles for benefit sections. */
export function MiniHausakte() {
  return (
    <div className={s.miniStack} aria-hidden="true">
      <div className={s.tile}><div className={s.tileRow}><span className={s.icon}><Flame size={16} /></span><div><strong>Wärmepumpe · Garantie bis 2029</strong><span>3 Dokumente · zuletzt Mai 2026</span></div></div></div>
      <div className={s.tile}><div className={s.tileRow}><span className={s.iconSand}><Home size={16} /></span><div><strong>Dach · neu eingedeckt 2019</strong><span>Fa. Kessler · Rechnung 14.800 €</span></div></div></div>
      <div className={s.tile}><div className={s.tileRow}><span className={s.iconWarm}><ShieldCheck size={16} /></span><div><strong>Elektrik · E-Check 2025</strong><span>Prüfprotokoll abgelegt</span></div></div></div>
    </div>
  );
}

export function MiniReminder() {
  return (
    <div className={s.miniStack} aria-hidden="true">
      <div className={s.tile}>
        <span className={s.pillTerra}><Bell size={11} /> Diese Woche</span>
        <div className={s.tileRow}><span className={s.iconWarm}><Flame size={16} /></span><div><strong>Heizungswartung fällig</strong><span>Einmal tippen, wir organisieren</span></div></div>
      </div>
      <div className={s.tile}><div className={s.tileRow}><span className={s.iconSand}><Calendar size={16} /></span><div><strong>Dachrinnen im Oktober</strong><span>Letztes Jahr: 180 €</span></div></div></div>
    </div>
  );
}

export function MiniContact() {
  return (
    <div className={s.miniStack} aria-hidden="true">
      <div className={s.tile}>
        <div className={s.person}><span className={s.avatar}>MK</span><div><strong>Markus Kessler</strong><span>Dachdeckerei Kessler · 6 km</span></div></div>
        <div className={s.actions}><span><Phone size={13} /> Anrufen</span><span><MessageCircle size={13} /> Nachricht</span></div>
      </div>
      <div className={s.bubble}>Donnerstag 14 Uhr passt. Sie müssen nichts vorbereiten.</div>
    </div>
  );
}

export function MiniCosts() {
  return (
    <div className={s.miniStack} aria-hidden="true">
      <div className={s.tile}>
        <div className={s.tileRow}><div><strong>Kostenrahmen 160–200 €</strong><span>Vor dem Termin, ohne Überraschung</span></div><span className={s.pillGreen}>von dir bestätigt</span></div>
      </div>
      <div className={s.tile}><div className={s.tileRow}><span className={s.iconSand}><Receipt size={16} /></span><div><strong>Rechnung 180 €</strong><span>automatisch in der Hausakte</span></div></div></div>
    </div>
  );
}
