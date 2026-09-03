export default function ProLoading() {
  return (
    <main className="app-page app-shell-v3 pro-theme" aria-busy="true" aria-live="polite">
      <div className="workspace-shell">
        <div className="workspace-main">
          <section className="screen-v3 provider-loading">
            <span className="provider-loading-bar" />
            <span className="provider-loading-row" />
            <span className="provider-loading-row" />
            <span className="provider-loading-row" />
            <span className="sr-only">Partnerbereich wird geladen.</span>
          </section>
        </div>
      </div>
    </main>
  );
}
