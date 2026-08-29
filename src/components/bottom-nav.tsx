'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { isNavActive, ownerMoreNav, ownerNav, providerNav } from './nav-config';

export { isNavActive, ownerNav, providerNav } from './nav-config';

export function BottomNav({ role, active }: { role: 'homeowner' | 'provider'; active: string }) {
  const items = role === 'provider' ? providerNav : ownerNav;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const moreTriggerRef = useRef<HTMLAnchorElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  function openMore(event: React.MouseEvent<HTMLAnchorElement>) {
    if (role !== 'homeowner' || !dialogRef.current?.showModal) return;
    event.preventDefault();
    dialogRef.current.showModal();
    setMoreOpen(true);
  }

  function closeMore({ restoreFocus = true }: { restoreFocus?: boolean } = {}) {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    setMoreOpen(false);
    if (restoreFocus) queueMicrotask(() => moreTriggerRef.current?.focus());
  }

  return <>
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      {items.map(([href, Icon, label]) => {
        const activeItem = isNavActive(active, href);
        if (role === 'homeowner' && href === '/app/more') {
          return <Link
            key={href}
            ref={moreTriggerRef}
            href={href}
            className={activeItem ? 'active' : ''}
            aria-current={activeItem ? 'page' : undefined}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            aria-controls="owner-more-menu"
            onClick={openMore}
          ><Icon size={20}/><span>{label}</span></Link>;
        }
        return <Link key={href} href={href} className={activeItem ? 'active' : ''} aria-current={activeItem ? 'page' : undefined}><Icon size={20}/><span>{label}</span></Link>;
      })}
    </nav>

    {role === 'homeowner' && <dialog
      ref={dialogRef}
      id="owner-more-menu"
      className="mobile-menu-sheet"
      aria-labelledby="owner-more-menu-title"
      onCancel={(event) => {
        event.preventDefault();
        closeMore();
      }}
      onClose={() => {
        setMoreOpen(false);
        queueMicrotask(() => moreTriggerRef.current?.focus());
      }}
    >
      <div className="mobile-menu-sheet-handle" aria-hidden="true"/>
      <div className="mobile-menu-sheet-head">
        <div><span>Navigation</span><h2 id="owner-more-menu-title">Mehr für dein Zuhause</h2></div>
        <button type="button" className="mobile-menu-sheet-close" onClick={() => closeMore()} aria-label="Menü schließen"><X size={20}/></button>
      </div>
      <nav className="mobile-menu-sheet-links" aria-label="Weitere Navigation">
        {ownerMoreNav.map(([href, Icon, title, subtitle]) => <Link href={href} key={href} onClick={() => closeMore({ restoreFocus: false })}>
          <span className="mobile-menu-sheet-icon"><Icon size={19}/></span>
          <span><strong>{title}</strong><small>{subtitle}</small></span>
        </Link>)}
      </nav>
      <Link href="/app/more" className="mobile-menu-sheet-all" onClick={() => closeMore({ restoreFocus: false })}>Alle Bereiche anzeigen</Link>
    </dialog>}
  </>;
}
