'use client';

// T-0117 CWV field telemetry: collects LCP/INP/CLS/TTFB/FCP via web-vitals and
// reports each metric once to /api/telemetry. Payload is privacy-safe: metric
// values and the route path only — no user identifiers, no content.
import { useEffect } from 'react';
import { onLCP, onINP, onCLS, onTTFB, onFCP } from 'web-vitals';

declare global {
  interface Window { __ehTelemetry?: Set<string>; }
}

export function CwvTelemetry() {
  useEffect(() => {
    window.__ehTelemetry = window.__ehTelemetry ?? new Set<string>();
    const report = (metric: { name: string; value: number; rating: string }) => {
      if (window.__ehTelemetry!.has(metric.name)) return; // final value only
      window.__ehTelemetry!.add(metric.name);
      const body = JSON.stringify({
        metric: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        path: window.location.pathname,
      });
      try { navigator.sendBeacon('/api/telemetry', new Blob([body], { type: 'application/json' })); }
      catch { void fetch('/api/telemetry', { method: 'POST', body, keepalive: true }); }
    };
    onLCP(report); onINP(report); onCLS(report); onTTFB(report); onFCP(report);
  }, []);
  return null;
}
