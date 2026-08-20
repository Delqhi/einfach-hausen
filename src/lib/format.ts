export const euro = (cents: number | null | undefined) =>
  typeof cents === 'number' ? new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(cents / 100) : '–';

export const dateLabel = (value?: string | null) => {
  if (!value) return 'Flexibel';
  const d = new Date(value.length === 10 ? value + 'T12:00:00' : value);
  return new Intl.DateTimeFormat('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:value.length>10?'2-digit':undefined,minute:value.length>10?'2-digit':undefined}).format(d);
};

const STATUS_LABELS: Record<string,string> = {
  open:'Offen', quoted:'Angebote da', accepted:'Beauftragt', in_progress:'In Arbeit', completed:'Erledigt', cancelled:'Storniert',
  pending:'Offen', approved:'Freigegeben', rejected:'Abgelehnt', reviewing:'In Prüfung', resolved:'Gelöst', withdrawn:'Zurückgezogen', confirmed:'Bestätigt', paid:'Bezahlt', failed:'Fehlgeschlagen', refunded:'Erstattet',
};
export const statusLabel = (status?: string | null) => status ? (STATUS_LABELS[status] ?? status) : '–';
