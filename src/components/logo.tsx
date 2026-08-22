export function Logo({ inverse=false, compact=false }: { inverse?: boolean; compact?: boolean }) {
  return <div className="brand brand-issue-nine" data-inverse={inverse} data-compact={compact} aria-label="einfachhausen – Dein Zuhause. Wir kümmern uns.">
    <span className="brand-house" aria-hidden="true"><img src="/brand/einfachhausen-mark.svg" alt=""/></span>
    {!compact&&<span className="brand-copy"><strong>einfachhausen</strong><small>Dein Zuhause. <b>Wir kümmern uns.</b></small></span>}
  </div>;
}
