import { redirect } from 'next/navigation';

/** Legacy-Duplikat von /app/home (kanonische Hausakte) — Redirect, kein Delete. */
export default function MeinHausRedirect() {
  redirect('/app/home');
}
