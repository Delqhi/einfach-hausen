"use client";
import {usePathname} from 'next/navigation';
import {EHAssistant, type EHAssistantMessage, type EHAssistantResult} from '@/design-system';

async function send(messages: EHAssistantMessage[], signal: AbortSignal): Promise<EHAssistantResult> {
  const response = await fetch('/api/ki', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({messages}), signal: AbortSignal.any([signal, AbortSignal.timeout(30000)])});
  const data = await response.json();
  const reply = typeof data.reply === 'string' ? data.reply : 'Eine Antwort ist gerade nicht verfügbar. Bitte versuche es später erneut.';
  if (response.status === 401) return {kind: 'login', reply};
  if (response.status === 402) return {kind: 'quota', reply};
  return {kind: response.ok ? 'reply' : 'error', reply};
}

export function HouseAssistant() {
  const path = usePathname();
  // Do not compete with authentication, provider work, payments, print or existing chat.
  if (!path || /^\/(login|register|auth|onboarding|pro|admin|ki-chat|checkout|pay|transfer|partner-invite|design-system)(\/|$)/.test(path)
      || /\/(passport|receipt)(\/|$)/.test(path) || /^\/app\/invoices\//.test(path)
      || ['/impressum', '/datenschutz', '/app/messages', '/app/hausmeister'].includes(path)) return null;
  return <EHAssistant key={path} onSend={send} loginHref="/login" settingsHref="/app/settings" aboveNavigation={path === '/app' || path.startsWith('/app/')} />;
}
