export function Logo({ inverse=false, compact=false }: { inverse?: boolean; compact?: boolean } = {}) {
  if (compact) {
    return (
      <div style={{ position: "relative", display: "inline-block", paddingTop: 6 }}>
        <svg width="72" height="78" viewBox="0 0 72 78" fill="none" style={{ position: "absolute", left: -56, top: -4 }} aria-hidden="true">
          <path d="M10 34 L36 12 L62 34 V70 H30" stroke="#14735c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="30" y="22" width="3.2" height="3.2" rx="0.8" fill="#14735c" />
          <rect x="36" y="22" width="3.2" height="3.2" rx="0.8" fill="#14735c" />
        </svg>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: "var(--green)", letterSpacing: -1 }}>einfach</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: "var(--ink)", letterSpacing: -1 }}>hausen</span>
        </div>
      </div>
    );
  }
  return <div className="brand brand-issue-nine" data-inverse={inverse} data-compact={compact} aria-label="einfachhausen – Dein Zuhause. Wir kümmern uns.">
    <span className="brand-house" aria-hidden="true"><img src="/brand/einfachhausen-mark.svg" alt=""/></span>
    {!compact&&<span className="brand-copy"><strong>einfachhausen</strong><small>Dein Zuhause. <b>Wir kümmern uns.</b></small></span>}
  </div>;
}
export default Logo;
