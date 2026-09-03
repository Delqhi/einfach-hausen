'use client';

import { useState } from 'react';
import Link from 'next/link';

function initiallyVisible(): boolean {
  try {
    return localStorage.getItem('eh_consent_status') === null;
  } catch {
    // Fallback für Umgebungen ohne localStorage-Zugriff
    return false;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(initiallyVisible);

  const handleDecision = (decision: 'necessary' | 'all') => {
    try {
      localStorage.setItem('eh_consent_status', decision);
      localStorage.setItem('eh_consent_date', new Date().toISOString());
    } catch {
      // Fallback
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie- und Datenschutzeinstellungen"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        right: '24px',
        maxWidth: '560px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '1px solid #e4e2dc',
        borderRadius: '20px',
        padding: '20px 24px',
        boxShadow: '0 12px 36px rgba(16, 34, 42, 0.12)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#10222a' }}>
          Datenschutz &amp; Privatsphäre
        </h4>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#4b5b60' }}>
          Wir nutzen essenzielle Speicherungen für deinen sicheren Login sowie optionale anonyme Reichweitenmessungen, um Einfach Hausen stetig zu verbessern.{' '}
          <Link href="/datenschutz" style={{ color: '#105258', textDecoration: 'underline', fontWeight: 600 }}>
            Mehr erfahren
          </Link>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleDecision('necessary')}
          type="button"
          style={{
            border: '1px solid #e4e2dc',
            background: 'transparent',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#10222a',
            cursor: 'pointer',
          }}
        >
          Nur essenzielle
        </button>
        <button
          onClick={() => handleDecision('all')}
          type="button"
          style={{
            border: 'none',
            background: '#105258',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Alle akzeptieren
        </button>
      </div>
    </aside>
  );
}
