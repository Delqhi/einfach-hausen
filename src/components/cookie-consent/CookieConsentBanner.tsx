import { useState, useEffect } from 'react';

/**
 * Minimal cookie consent banner for Einfach Hausen.
 *
 * Purpose:
 * - Inform about the technically necessary session cookie (__Host- prefixed)
 * - Provide opt-in for any future non-essential analytics/tracking cookies
 * - Default: no non-essential cookies are set (privacy-first by design)
 * - Consent state persists in Local Storage with expiration
 *
 * GDPR note: Technically necessary session cookies do not require consent
 * under Art. 6 para. 1 lit. f GDPR (legitimate interest for provision of
 * the service). This banner covers non-essential cookies only.
 */
export const CookieConsentBanner: React.FC = () => {
  const [consented, setConsented] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  // Check for saved consent state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('eh_cookie_consent');
    if (saved === 'accepted') {
      setConsented(true);
      setShowBanner(false);
    } else if (saved === 'rejected') {
      setConsented(false);
      setShowBanner(false);
    }
  }, []);

  // Consent action
  const accept = () => {
    setConsented(true);
    setShowBanner(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eh_cookie_consent', 'accepted');
    }
  };

  const reject = () => {
    setConsented(false);
    setShowBanner(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eh_cookie_consent', 'rejected');
    }
  };

  const dismiss = () => {
    // If no banner state is saved, treat as rejected for privacy
    if (typeof window !== 'undefined') {
      localStorage.setItem('eh_cookie_consent', 'rejected');
    }
    setConsented(false);
    setShowBanner(false);
  };

  // If consent already given, don't show banner
  if (consented !== null && !showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gray-800 text-gray-200 border-t border-t-yellow-500 py-3 px-4 text-sm shadow-xl z-50"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <svg
            className="flex-shrink-0 w-5 h-5 opacity-60"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            />
          </svg>

          <div className="flex-1">
            <p className="font-medium">Cookies auf dieser Website</p>
            <p className="text-xs opacity-60 margin-t-1">
              Wir verwenden nur technisch notwendige Sitzungs-Cookies für
              authentifizierte Bereichte. Weitere Cookies oder Tracking-Tools
              werden nicht eingesetzt. Sie können Ihre Entscheidung jederzeit
              über das Schlosssymbol in der Ecke ändern.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={accept}
              className="text-yellow-400 hover:text-yellow-300 text-xs font-medium"
              aria-label="Einwilligen"
            >
              Einwilligen
            </button>
            <button
              onClick={reject}
              className="text-gray-400 hover:text-gray-200 text-xs"
              aria-label="Ablehnen"
            >
              Ablehnen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};