import Link from 'next/link';
import { Logo } from '@/components/logo';
import { adminLoginAction } from '@/app/actions';
export default async function AdminLogin({searchParams}:{searchParams:Promise<Record<string,string>>}){const sp=await searchParams;return <main className="auth-page"><form action={adminLoginAction} className="auth-card"><Logo/><h1>Plattform-Administration</h1><p>Partnerprüfung und Problemfälle verwalten.</p>{sp.error&&<div className="alert error">{sp.error}</div>}<label>Admin-Passwort<input type="password" name="password" required autoComplete="current-password"/></label><button className="btn primary wide">Admin anmelden</button><small><Link href="/">Zurück zur App</Link></small></form></main>}
