# Vollständiger Quelltext

## src/app/leistungen/page.tsx
SHA256 d677c14443522764460727896701d31c5184d9a1de6f2afcba5b64da5237db09
```tsx
import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical, leistungenServiceJsonLd } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { EHScope, EHSection, EHPageHero, EHServiceIndex, EHProductExcerpt, EHSectionHeading, EHProcess, EHFAQ, EHClosing, EHButton } from '@/design-system';
import { SERVICE_CATEGORIES } from '@/components/marketing/service-catalog';

export const metadata: Metadata = { title: 'Leistungen', description: 'Alles rund ums Eigenheim: Reparatur, Heizung, Dach, Garten, Sanierung, Wartung. Du beschreibst, wir ordnen zu.' , alternates: { canonical: canonical('/leistungen') } };

const EXAMPLES = [
  'Die Heizung macht seit gestern klackernde Geräusche.',
  'Im Bad ist die Silikonfuge schwarz und löst sich.',
  'Wir wollen eine Wallbox, wissen aber nicht, ob der Anschluss reicht.',
  'Die Hecke ist zu hoch, der Nachbar hat sich beschwert.',
  'Nach dem Sturm liegt ein Ziegel im Garten.',
  'Wir ziehen um und brauchen jemanden fürs Ausräumen des Kellers.',
] as const;

export default function Page() {
  return <MarketingShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Start', path: '/' }, { name: 'Leistungen', path: '/leistungen' }])) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(leistungenServiceJsonLd()) }} />
    <EHScope>
      <EHPageHero eyebrow="Hilfe rund um dein Haus" title="Was ansteht, muss nicht liegen bleiben."
        text="Eine Reparatur, die nächste Wartung oder ein Vorhaben, für das dir der passende Betrieb fehlt: Beschreibe dein Anliegen. Wir helfen beim Einordnen und Organisieren – abhängig von Leistung und regionaler Verfügbarkeit."
        actions={<><EHButton href="/register?role=homeowner" arrow>Mein Anliegen starten</EHButton><EHButton href="#leistungsbereiche" variant="secondary">Alle Bereiche ansehen</EHButton></>}
        media={<EHProductExcerpt label="Beispiele · dein nächster Schritt" title="Wobei brauchst du Hilfe?" rows={[
          { title: 'Etwas funktioniert nicht.', text: 'Zum Beispiel eine tropfende Armatur oder eine auffällige Heizung.' },
          { title: 'Etwas ist wieder fällig.', text: 'Zum Beispiel Wartung, Reinigung oder Gartenpflege.' },
          { title: 'Du möchtest etwas verändern.', text: 'Zum Beispiel ein Bad modernisieren oder eine Wallbox planen.' },
        ]} note="Du musst das passende Gewerk nicht vorab kennen. Eine Beschreibung ist noch kein Auftrag." />} />
      <EHSection tone="white">
        <EHSectionHeading eyebrow="Mit einem konkreten Anliegen anfangen" title="So darf dein erster Satz klingen."
          text="Wähle ein Beispiel als Ausgangspunkt. Es wird in der Registrierung vorbefüllt – du kannst es dort anpassen." />
        <EHServiceIndex items={EXAMPLES.map((example, index) => ({
          label: 'Beispiel ' + String(index + 1).padStart(2, '0'),
          title: example,
          text: 'Als Ausgangspunkt für mein Anliegen verwenden',
          href: '/register?role=homeowner&request=' + encodeURIComponent(example),
        }))} />
      </EHSection>
      <EHSection id="leistungsbereiche">
        <EHSectionHeading eyebrow="Zur Orientierung" title="Zwölf Bereiche für dein Zuhause."
          text="Hier findest du mehr zum jeweiligen Leistungsbereich. Die Einordnung deines Anliegens kannst du uns überlassen." />
        <EHServiceIndex items={SERVICE_CATEGORIES.map(({ title, description, slug }) => ({ title, text: description, href: '/leistungen/' + slug }))} />
      </EHSection>
      <EHSection tone="white">
        <EHSectionHeading eyebrow="Wie es weitergeht" title="Du beschreibst. Du prüfst. Du entscheidest." />
        <EHProcess items={[
          { title: 'Die Situation klären.', text: 'Was ist zu tun, wo und wie dringend? Ergänzende Angaben helfen dabei, den Bedarf einzuordnen.' },
          { title: 'Passende Hilfe prüfen.', text: 'Ist ein geeigneter Partner verfügbar, klärst du den Leistungsumfang, das Angebot und den Termin.' },
          { title: 'Bewusst beauftragen.', text: 'Du entscheidest, ob das Angebot passt. Hinterlegte Absprachen und Unterlagen bleiben beim Vorgang.' },
        ]} />
        <EHButton href="/so-funktionierts" variant="secondary">Den Ablauf genauer ansehen</EHButton>
      </EHSection>
      <EHSection>
        <EHSectionHeading eyebrow="Gut zu wissen" title="Passt Einfachhausen zu meinem Anliegen?" />
        <EHFAQ items={[
          { q: 'Mein Anliegen passt in keine Kategorie. Was nun?', a: 'Beschreibe es in deinen Worten. Die Kategorien dienen der Orientierung. Ob und welcher Betrieb helfen kann, hängt vom konkreten Bedarf und regionalen Partnernetz ab.' },
          { q: 'Macht Einfachhausen die Arbeiten selbst?', a: 'Die vereinbarten Arbeiten übernehmen eigenständige Partnerbetriebe. Einfachhausen hilft beim Einordnen und Organisieren deines Anliegens.' },
          { q: 'Kann ich erst eine Frage klären?', a: <>Ja. Du musst nicht gleich einen Auftrag vorbereiten. <a href="/beratung">Mehr zur Beratung</a>.</> },
          { q: 'Was kostet die Anfrage?', a: <>Das Hauskonto ist kostenlos. Handwerkerleistungen und zusätzliche Betreuung werden separat vereinbart. <a href="/preise">Zu den Preisen</a>.</> },
          { q: 'Ist ein Betrieb in meiner Region verfügbar?', a: 'Das Partnernetz wird regional aufgebaut. Leistung, Standort und freie Kapazitäten bestimmen, welche Hilfe möglich ist. Eine bestimmte Verfügbarkeit wird nicht pauschal zugesagt.' },
          { q: 'Was gilt bei einem dringenden Fall?', a: <>Beschreibe die Dringlichkeit. Einfachhausen ist kein garantierter 24/7-Notdienst; bei akuter Gefahr nutze den zuständigen Notruf. <a href="/notfall">Hinweise für dringende Fälle</a>.</> },
        ]} />
      </EHSection>
      <EHClosing title="Fang mit dem an, was dich gerade beschäftigt."
        text="Du brauchst keine fertige Leistungsbeschreibung. Dein erster Satz ist der Anfang."
        href="/register?role=homeowner" label="Mein Anliegen starten"
        secondary={<EHButton href="/so-funktionierts" variant="secondary">Erst den Ablauf kennenlernen</EHButton>} />
    </EHScope>
  </MarketingShell>;
}

```

## src/app/so-funktionierts/page.tsx
SHA256 caa2cdf8d3a35ffb6617486ae5731c01919cc9ea0c6c81545397f8d34ff8a053
```tsx
import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { EHScope, EHSection, EHPageHero, EHSectionHeading, EHProductExcerpt, EHProcess, EHServiceIndex, EHPromiseRow, EHSplitStory, EHImageFrame, EHFAQ, EHClosing, EHButton, EHTextLink } from '@/design-system';

export const metadata: Metadata = {
  title: "So funktioniert’s – vom Anliegen zum nächsten Schritt",
  description: 'Frage klären, Ansprechpartner finden oder einen Auftrag organisieren: Du beschreibst dein Anliegen und entscheidest, wie es weitergeht.',
  alternates: { canonical: canonical('/so-funktionierts') },
};

export default function Page() {
  return <MarketingShell><EHScope>
    <EHPageHero eyebrow="So funktioniert Einfachhausen" title="Ein Anliegen. Ein klarer nächster Schritt."
      text="Du musst noch nicht wissen, welcher Betrieb zuständig ist. Beschreibe, was an deinem Haus los ist. Wir helfen beim Einordnen – und du entscheidest, ob du erst eine Frage klären, einen Menschen sprechen oder etwas erledigen lassen möchtest."
      actions={<><EHButton href="/register?role=homeowner" arrow>Mit meinem Anliegen starten</EHButton><EHButton href="#dein-weg" variant="secondary">Meine Möglichkeiten ansehen</EHButton></>}
      media={<EHProductExcerpt label="Beispiel · erste Nachricht" title="„Bei Regen läuft die Dachrinne über.“" rows={[
        { title: 'Was du beschreibst', text: 'Was passiert, seit wann und an welcher Stelle?' },
        { title: 'Was helfen kann', text: 'Ein Foto oder ergänzende Angaben, wenn verfügbar.' },
        { title: 'Was du entscheidest', text: 'Erst eine Einschätzung oder Hilfe bei der Organisation?' },
      ]} note="Ein beispielhafter Einstieg. Das Öffnen eines Hauskontos beauftragt keinen Betrieb." />} />
    <EHSection tone="white" id="dein-weg">
      <EHSectionHeading eyebrow="Du bestimmst den nächsten Schritt" title="Erst verstehen. Oder direkt Hilfe organisieren."
        text="Du kannst mit einer Frage beginnen. Ein persönlicher Ansprechpartner ist auch ohne Handwerkerbuchung möglich; die Verfügbarkeit hängt vom Partnernetz ab." />
      <EHServiceIndex items={[
        { label: 'Frage', title: '„Ich möchte erst wissen, was sinnvoll ist.“', text: 'Nutze die Einordnung als Ausgangspunkt. Bei technischen Entscheidungen kann eine Prüfung durch einen Fachbetrieb nötig sein.', href: '/beratung' },
        { label: 'Kontakt', title: '„Ich möchte mit einem Menschen sprechen.“', text: 'Beschreibe, wobei du eine persönliche Einschätzung brauchst. Danach kann ein passender Ansprechpartner vermittelt werden.', href: '/register?role=homeowner&request=Ich%20suche%20einen%20pers%C3%B6nlichen%20Ansprechpartner%20f%C3%BCr%20mein%20Anliegen.' },
        { label: 'Auftrag', title: '„Ich möchte, dass es erledigt wird.“', text: 'Wir helfen, die Angaben für den Auftrag zusammenzutragen. Leistung, Preis und Termin prüfst du vor deiner Entscheidung.', href: '/register?role=homeowner&request=Ich%20m%C3%B6chte%20eine%20Arbeit%20an%20meinem%20Haus%20organisieren%20lassen.' },
      ]} />
    </EHSection>
    <EHSection>
      <EHSectionHeading eyebrow="Wenn du eine Arbeit organisieren möchtest" title="Vom ersten Satz zur bewussten Entscheidung." />
      <EHProcess items={[
        { title: 'Du beschreibst die Situation.', text: 'In deinen Worten, mit den Informationen, die du gerade hast. Fehlende Angaben können im Gespräch ergänzt werden.',
          media: <EHProductExcerpt label="Beispiel · Anliegen" title="Dachrinne läuft über" rows={[{title:'Beobachtung',text:'Bei starkem Regen läuft Wasser an der Fassade herunter.'},{title:'Ergänzung',text:'Ein Foto und Angaben zur Höhe helfen bei der Einordnung.'}]} /> },
        { title: 'Du prüfst den Vorschlag.', text: 'Passt ein verfügbarer Betrieb, kannst du das Angebot und die nächsten Schritte prüfen. Ein Kostenrahmen ist noch keine endgültige Rechnung.',
          media: <EHProductExcerpt label="Beispiel · vor dem Auftrag" title="Was du wissen möchtest" rows={[{title:'Leistung',text:'Was soll gemacht werden – und was ist nicht enthalten?'},{title:'Preis und Termin',text:'Welche Kosten und welcher Zeitpunkt werden vereinbart?'}]} /> },
        { title: 'Der Betrieb übernimmt.', text: 'Nach deiner Beauftragung stimmt ihr die Ausführung ab. Hinterlegte Nachrichten, Rechnungen und Nachweise bleiben beim Vorgang auffindbar.',
          media: <EHProductExcerpt label="Beispiel · dein Vorgang" title="Der Zusammenhang bleibt" rows={[{title:'Kontakt',text:'Der zuständige Betrieb und vorhandene Kontaktdaten.'},{title:'Unterlagen',text:'Die im Vorgang hinterlegten Dokumente und Rechnung.'}]} /> },
      ]} />
    </EHSection>
    <EHSection tone="deep">
      <EHSectionHeading eyebrow="Was dir Sicherheit gibt" title="Du weißt, worüber du entscheidest." />
      <EHPromiseRow items={[
        { title: 'Kein Auftrag durch eine Frage.', text: 'Die erste Beschreibung hilft beim Einordnen. Die Beauftragung ist eine separate Entscheidung.' },
        { title: 'Preis vor Zusage klären.', text: 'Prüfe das Angebot einschließlich Leistung, Material und möglicher Zusatzkosten mit dem Betrieb.' },
        { title: 'Verfügbarkeit bleibt ehrlich.', text: 'Region, Leistung und Kapazität entscheiden, ob ein passender Partner verfügbar ist.' },
      ]} />
    </EHSection>
    <EHSection tone="white" id="ansprechpartner">
      <EHSplitStory eyebrow="Persönlich weiterkommen" title="Ein Kontakt mit Zusammenhang."
        text="Du sollst bei einer Rückfrage nicht wieder die ganze Geschichte erzählen müssen. Der zu deinem Vorgang hinterlegte Ansprechpartner und die dokumentierten Absprachen bleiben zusammen."
        media={<EHImageFrame src="/images/marketing/owner-kitchen.jpg" alt="Eine Frau sitzt mit einer Tasse am Küchentisch" portrait caption="Illustrative Bildwelt, keine Kundenaussage." />}>
        <EHTextLink href="/hausakte">Was dir die Hausakte im Alltag bringt</EHTextLink>
        <EHTextLink href="/sicherheit">Mehr über Partnerauswahl und Sicherheit</EHTextLink>
      </EHSplitStory>
    </EHSection>
    <EHSection>
      <EHSectionHeading eyebrow="Vor dem ersten Anliegen" title="Die häufigsten Fragen zum Ablauf." />
      <EHFAQ items={[
        { q: 'Wie schnell bekomme ich einen Ansprechpartner?', a: 'Das hängt von Region, Leistung und freien Kapazitäten ab. Eine pauschale Antwortzeit können wir nicht zusagen. Beschreibe die Dringlichkeit möglichst konkret.' },
        { q: 'Muss ich ein Angebot annehmen?', a: 'Nein. Prüfe, ob Leistung, Kosten und Termin für dich passen. Eine Anfrage verpflichtet dich nicht zur Beauftragung.' },
        { q: 'Wer führt die Arbeit aus und stellt die Rechnung?', a: 'Der eigenständige Partnerbetrieb führt die vereinbarte Leistung aus und rechnet mit dir ab. Einfachhausen erhebt keine Provision auf den Auftragswert.' },
        { q: 'Was kostet der Einstieg?', a: <>Das Hauskonto ist kostenlos. Zusätzliche Betreuung und Handwerkerleistungen werden gesondert vereinbart. <a href="/preise">Preise und Umfang ansehen</a>.</> },
        { q: 'Was mache ich bei einem Problem mit der Ausführung?', a: 'Dokumentiere das Problem beim betreffenden Vorgang und wende dich an den zuständigen Betrieb. Für Unterstützung bei der Klärung kannst du Einfachhausen kontaktieren.' },
        { q: 'Kann ich Einfachhausen als Notdienst nutzen?', a: <>Einfachhausen ist kein garantierter 24/7-Notdienst. Bei akuter Gefahr nutze den zuständigen Notruf. <a href="/notfall">Hinweise für dringende Fälle</a>.</> },
      ]} />
    </EHSection>
    <EHClosing title="Du musst nicht alles wissen. Nur, was gerade los ist."
      text="Beginne mit deinem Anliegen. Den nächsten Schritt entscheidest du danach."
      href="/register?role=homeowner" label="Kostenloses Hauskonto anlegen"
      secondary={<EHButton href="/leistungen" variant="secondary">Leistungsbereiche ansehen</EHButton>} />
  </EHScope></MarketingShell>;
}

```
