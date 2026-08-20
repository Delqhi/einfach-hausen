import { Home } from 'lucide-react';

export function Logo({ inverse=false }: { inverse?: boolean }) {
  return <div className="brand" data-inverse={inverse}>
    <span className="brand-icon"><Home size={22} strokeWidth={2.5}/><b>HA</b></span>
    <span><strong>Mein Hausmeister</strong><small>Dein digitaler Hausmeister</small></span>
  </div>;
}
