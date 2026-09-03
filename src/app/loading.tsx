/*
 * P0 UI-Convergence: Der öffentliche Ladezustand rendert keinen
 * vollflächigen "Wir bereiten die Inhalte vor"-Block mehr. Der Block
 * erschien über bereits geladenem Inhalt und ließ fertige Seiten unfertig
 * aussehen. Stattdessen: eine ruhige Fortschrittsleiste an der oberen
 * Kante und eine Statusmeldung nur für Screenreader.
 */

const css = `
.ehn-route-progress {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 9999;
  height: 2px;
  overflow: hidden;
  background: oklch(0.945 0.008 200);
  pointer-events: none;
}
.ehn-route-progress > span {
  display: block;
  height: 100%;
  width: 36%;
  border-radius: 999px;
  background: oklch(0.44 0.075 195);
  will-change: transform;
  transform: translate3d(-110%, 0, 0);
  animation: ehn-route-progress 1.15s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}
@keyframes ehn-route-progress {
  from { transform: translate3d(-110%, 0, 0); }
  to { transform: translate3d(320%, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .ehn-route-progress > span {
    width: 100%;
    opacity: 0.5;
    transform: none;
    animation: none;
  }
}
`;

const srOnly = {
  position: 'absolute' as const,
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  border: 0,
  overflow: 'hidden' as const,
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap' as const,
};

export default function Loading() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ehn-route-progress" aria-hidden="true"><span /></div>
      <p role="status" aria-live="polite" style={srOnly}>Inhalt wird geladen.</p>
    </>
  );
}
