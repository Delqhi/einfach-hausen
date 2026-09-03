import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';

// "Ansprechpartner" entry point. The contacts surface (threads, categories,
// composer) lives at /app/messages; this route keeps the canonical menu target
// from the Notion design working without new backend behavior.
export default async function PartnersIndex() {
  await requireUser('homeowner');
  redirect('/app/messages');
}
