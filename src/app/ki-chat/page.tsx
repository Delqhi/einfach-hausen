import { redirect } from 'next/navigation';

/** Preserve old entry links without maintaining a second customer chat. */
export default async function KiChatPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const prompt = typeof params.prompt === 'string' ? params.prompt : '';
  const question = typeof params.q === 'string' ? params.q : '';
  const draft = prompt.trim() ? prompt : question;
  const query = new URLSearchParams();
  if (draft.trim()) query.set('draft', draft);
  redirect('/app/hausmeister' + (query.size ? '?' + query.toString() : ''));
}
