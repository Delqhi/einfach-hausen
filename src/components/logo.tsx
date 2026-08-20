import { Home } from 'lucide-react';

export function Logo({ inverse=false }: { inverse?: boolean }) {
  return <div className="brand" data-inverse={inverse}>
    <span className="brand-icon"><Home size={22} strokeWidth={2.5}/><b>EH</b></span>
    <span><strong>Einfach Hausen</strong><small>Dein KI-Hausmeister</small></span>
  </div>;
}
