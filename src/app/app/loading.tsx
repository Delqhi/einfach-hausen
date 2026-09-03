export default function HomeownerLoading() {
  return (
    <main className="owner-route-state owner-loading-state" aria-busy="true" aria-live="polite">
      <span className="owner-state-kicker">Einfach Hausen</span>
      <div className="owner-skeleton owner-skeleton-title" />
      <div className="owner-skeleton owner-skeleton-copy" />
      <div className="owner-skeleton owner-skeleton-composer" />
      <span className="owner-visually-hidden">Inhalte werden geladen.</span>
    </main>
  );
}
