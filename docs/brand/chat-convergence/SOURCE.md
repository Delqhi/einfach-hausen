# Vollständige Quellen

## src/app/ki-chat/page.tsx
SHA256 3241673b4cd817c0ea6cd23e7d0252e7ad55c7fe0d1e7e89a21142b646971554
```tsx
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

```

## src/app/app/hausmeister/page.tsx
SHA256 224338028e535e93b078dabee1e69ed5029016166c9b3eb8795d0e0f15cf3732
```tsx
import { ChevronRight,ClipboardCheck,HelpCircle,MessageCircle,Sparkles,Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { HomeownerHausmeisterComposer } from '@/components/homeowner/homeowner-hausmeister-composer';
import { startHausmeisterRouteAction } from '@/app/actions';
import { requireUser } from '@/lib/auth';
import { EHAppHeader, EHPanel, EHErrorState } from '@/design-system';
import { db } from '@/lib/db';
import { aiQuotaSnapshot } from '@/lib/ai-engine';
import { HAUSMEISTER_LIMIT_HINTS } from '@/lib/orchestrator';
import { HausmeisterQuotaStatus } from '@/components/homeowner/hausmeister-quota-status';

export default async function Hausmeister({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const sp=await searchParams;
  const thread=db.prepare(`SELECT * FROM assistant_threads WHERE user_id=? AND channel='app' ORDER BY updated_at DESC LIMIT 1`).get(user.id) as any;
  const messages=thread?db.prepare('SELECT * FROM assistant_messages WHERE thread_id=? ORDER BY created_at DESC,id DESC LIMIT 20').all(thread.id).reverse() as any[]:[];
  const draft=thread?db.prepare('SELECT intent FROM assistant_drafts WHERE thread_id=?').get(thread.id) as {intent:'service'|'contact'}|undefined:undefined;
  const lastAssistant=[...messages].reverse().find(m=>m.role==='assistant');
  let lastMeta:any={}; try{lastMeta=lastAssistant?JSON.parse(lastAssistant.metadata_json||'{}'):{};}catch{}
  const showNextChoice=Boolean(lastMeta.assistantOnly&&!draft);
  const starterHints:Record<string,string>={garten:'Was soll draußen oder im Garten gemacht werden?',reparatur:'Was ist kaputt oder muss repariert werden?',pflege:'Was soll gereinigt oder gepflegt werden?',technik:'Wobei brauchst du Hilfe mit Technik oder Installation?'};
  const starterHint=sp.topic?starterHints[sp.topic]:undefined;

  const quota = aiQuotaSnapshot(user.id);
  return <AppShell role="homeowner" active="/app" title="Hausmeister" subtitle="Fragen klären oder etwas organisieren">
    <div className="housemaster-panel">
      <EHAppHeader eyebrow="Hausmeister · bereit" title={`Hallo ${user.first_name}.`} text="Beschreib einfach, was los ist. Wir klären zuerst die Frage. Erst danach entscheidest du bewusst zwischen weiter fragen, einem persönlichen Ansprechpartner oder einem echten Auftrag." />
      {sp.error&&<EHErrorState text={sp.error} />}
      <EHPanel title="KI-Kontingent & Limits">
        <div data-testid="hausmeister-quota" role="status" aria-live="polite">
          <p>KI-Kontingent: {quota.freemiumRemaining} von {quota.freemiumAllowed} frei · {quota.credits} Bonus-Aktionen{quota.byok ? ' · eigener Key aktiv' : ''}.</p>
          <p data-testid="hausmeister-limit-401">{HAUSMEISTER_LIMIT_HINTS.unauthenticated}</p>
          <p data-testid="hausmeister-limit-402">{HAUSMEISTER_LIMIT_HINTS.quotaExhausted}</p>
          <p data-testid="hausmeister-limit-429">{HAUSMEISTER_LIMIT_HINTS.rateLimited}</p>
        </div>
        <HausmeisterQuotaStatus />
      </EHPanel>
      <div className="agent-chat housemaster-chat">
        {messages.length===0&&<div className="agent-message assistant"><div className="message-head"><Sparkles size={14}/> Einfach Hausen</div><p>Beschreib einfach, was los ist. Ich helfe beim Einordnen und du entscheidest danach, ob du nur einen Ansprechpartner möchtest oder einen Auftrag organisieren willst.</p></div>}
        {messages.map(m=><div className={`agent-message ${m.role}`} key={m.id}><div className="message-head">{m.role==='user'?'Du':<><Sparkles size={14}/> Einfach Hausen</>}</div><p>{m.body}</p></div>)}
        {showNextChoice&&<EHPanel title="Wie soll es weitergehen?"><div role="region" aria-live="polite" aria-label="Wie soll der Hausmeister weitermachen?">
          <div className="resolution-copy"><strong>Wie soll es weitergehen?</strong><span>Keine Aktion passiert automatisch.</span></div>
          <div className="resolution-actions owner-resolution-actions">
            <a href="#hausmeister-composer" className="resolution-button question-choice"><HelpCircle/><span><strong>Frage klären</strong><small>Im Gespräch bleiben und erst einmal nichts beauftragen.</small></span><ChevronRight/></a>
            <form action={startHausmeisterRouteAction.bind(null,'contact')}><button className="resolution-button" type="submit"><MessageCircle/><span><strong>Ansprechpartner finden</strong><small>Mit einem passenden geprüften Menschen sprechen, ohne Auftrag.</small></span><ChevronRight/></button></form>
            <form action={startHausmeisterRouteAction.bind(null,'service')}><button className="resolution-button primary-choice" type="submit"><ClipboardCheck/><span><strong>Auftrag organisieren</strong><small>Erst jetzt Angebote, Termin und Ausführung organisieren.</small></span><ChevronRight/></button></form>
          </div>
        </div></EHPanel>}
        {draft&&<div className="route-progress" role="status" aria-live="polite"><span>{draft.intent==='contact'?<MessageCircle/>:<ClipboardCheck/>}</span><div><strong>{draft.intent==='contact'?'Ansprechpartner finden':'Auftrag organisieren'}</strong><small>{draft.intent==='contact'?'Nur noch eine kurze Info, dann suchen wir den passenden Menschen.':'Nur noch eine kurze Info, dann können passende Partner angefragt werden.'}</small></div></div>}
        <div id="hausmeister-composer" className="owner-housemaster-composer"><HomeownerHausmeisterComposer continuingIntent={draft?.intent} starterHint={starterHint} incomingDraft={typeof sp.draft === 'string' ? sp.draft : undefined}/></div>
      </div>
      <div className="trust-strip housemaster-trust"><span><HelpCircle/> Frage klären</span><span><MessageCircle/> Ansprechpartner auf Wunsch</span><span><Wrench/> Auftrag nur nach Freigabe</span></div>
    </div>
  </AppShell>;
}

```

## src/components/homeowner/homeowner-hausmeister-composer.tsx
SHA256 267cb3f12b0f729fbe021ad84a81c14fdb4784d41d9df6dfdd1a3b97c6a66d1f
```tsx
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Camera, Mic, Send, Square } from 'lucide-react';
import { sendHausmeisterAction } from '@/app/actions';
import { EHPanel, EHText, EHButton, EHActions } from '@/design-system';

// T-0155: the intake draft survives network failures. The text is mirrored to
// localStorage on every keystroke, restored on mount, and only cleared after
// the action resolved (redirect counts as success). Server-action errors are
// caught inline - the error boundary must never eat the user's draft.

export function HomeownerHausmeisterComposer({
  continuingIntent,
  starterHint,
  incomingDraft,
}: {
  continuingIntent?: 'service' | 'contact' | null;
  starterHint?: string;
  incomingDraft?: string;
}) {
  const [text, setText] = useState(() => {
    // Draft restore via lazy initializer (T-0155): survives network loss and
    // accidental reloads without an extra render pass.
    try { return window.localStorage.getItem('eh-draft:hausmeister-intake') ?? ''; } catch { return ''; }
  });
  const [handledDraft, setHandledDraft] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [listening, setListening] = useState(false);
  const [offline, setOffline] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognition = useRef<any>(null);
  const descriptionId = useId();
  const fileId = useId();
  const statusId = useId();
  const draftKey = 'eh-draft:hausmeister-intake';

  useEffect(() => {
    try {
      if (text) window.localStorage.setItem(draftKey, text);
      else window.localStorage.removeItem(draftKey);
    } catch {}
  }, [text]);

  async function submitDraft(formData: FormData) {
    if (submitting) return; // double-action guard
    setSubmitting(true);
    setSubmitError('');
    try {
      await sendHausmeisterAction(formData);
      // Redirect inside the action navigates away; reaching here without one
      // means the action handled the request (e.g. clarify flow).
      try { window.localStorage.removeItem(draftKey); } catch {}
      setText('');
    } catch (error) {
      // Next.js redirect() throws a control-flow error with a NEXT_REDIRECT
      // digest - it must bubble so the router navigates.
      const digest = (error as { digest?: string })?.digest ?? '';
      if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) throw error;
      setSubmitError('Senden fehlgeschlagen (mögliche 429 – zu viele Anfragen). Dein Text bleibt erhalten - versuch es erneut, sobald du wieder online bist.');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const syncNetwork = () => setOffline(!navigator.onLine);
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const syncCapabilities = () => setSpeechSupported(Boolean(Ctor));
    syncCapabilities();
    syncNetwork();
    window.addEventListener('online', syncNetwork);
    window.addEventListener('offline', syncNetwork);
    return () => {
      recognition.current?.stop?.();
      window.removeEventListener('online', syncNetwork);
      window.removeEventListener('offline', syncNetwork);
    };
  }, []);

  function toggleVoice() {
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      setVoiceStatus('Spracheingabe beendet. Du kannst den Text vor dem Senden noch ändern.');
      return;
    }

    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      setSpeechSupported(false);
      setVoiceStatus('Spracheingabe ist in diesem Browser nicht verfügbar. Text und Medien funktionieren weiterhin.');
      return;
    }

    const instance = new Ctor();
    recognition.current = instance;
    instance.lang = 'de-DE';
    instance.interimResults = true;
    instance.continuous = false;
    instance.onresult = (event: any) => {
      let value = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) value += event.results[i][0].transcript;
      setText(value.trim());
    };
    instance.onend = () => {
      setListening(false);
      setVoiceStatus('Spracheingabe beendet. Prüfe den erkannten Text und sende ihn dann ab.');
    };
    instance.onerror = () => {
      setListening(false);
      setVoiceStatus('Spracheingabe hat nicht funktioniert. Du kannst dein Anliegen weiterhin tippen oder ein Medium hinzufügen.');
    };
    setListening(true);
    setVoiceStatus('Spracheingabe läuft. Sprich jetzt dein Anliegen.');
    instance.start();
  }

  const placeholder = continuingIntent === 'contact'
    ? 'Beantworte nur noch die kurze Rückfrage, damit ich deinen Ansprechpartner finde …'
    : continuingIntent === 'service'
      ? 'Beantworte nur noch die kurze Rückfrage, damit ich den Auftrag organisieren kann …'
      : starterHint || 'Beschreib kurz, was bei dir zu Hause los ist …';

  const connectionStatus = offline
    ? 'Du bist offline. Dein Text bleibt hier erhalten; senden kannst du wieder mit Internetverbindung.'
    : !speechSupported
      ? 'Spracheingabe ist in diesem Browser nicht verfügbar. Text und Medien funktionieren weiterhin.'
      : voiceStatus;

  return (
    <form action={submitDraft} className="agent-composer" aria-describedby={connectionStatus ? statusId : undefined}>
      {incomingDraft?.trim() && incomingDraft !== handledDraft && <EHPanel title="Deine mitgebrachte Frage">
        <EHText>{incomingDraft}</EHText>
        <EHText>Übernimm den Text in dein Eingabefeld und prüfe ihn vor dem Senden. Ein vorhandener Entwurf bleibt erhalten.</EHText>
        <EHActions>
          <EHButton type="button" disabled={submitting} onClick={() => {
            setText(current => current.trim() && current.trim() !== incomingDraft.trim()
              ? current + '\n\n' + incomingDraft : incomingDraft);
            setHandledDraft(incomingDraft);
            document.getElementById(descriptionId)?.focus();
          }}>{text.trim() ? 'Zum Entwurf hinzufügen' : 'In Eingabefeld übernehmen'}</EHButton>
          <EHButton type="button" variant="secondary" disabled={submitting} onClick={() => {
            setHandledDraft(incomingDraft);
            document.getElementById(descriptionId)?.focus();
          }}>Vorschlag verwerfen</EHButton>
        </EHActions>
      </EHPanel>}
      <label className="owner-visually-hidden" htmlFor={descriptionId}>Anliegen an den Hausmeister</label>
      <textarea
        id={descriptionId}
        name="description"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        required
        placeholder={placeholder}
        aria-describedby={connectionStatus ? statusId : undefined}
      />
      <div className="agent-actions">
        <label className="icon-action" htmlFor={fileId} title="Foto, Video oder Sprachnachricht hinzufügen">
          <Camera size={19} aria-hidden="true" />
          <span>Foto</span>
          <input
            id={fileId}
            name="photo"
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime,video/x-m4v,audio/aac,audio/mpeg,audio/mp4,audio/ogg,audio/opus,audio/wav,audio/x-wav"
          />
        </label>
        <button
          className={listening ? 'icon-action recording' : 'icon-action'}
          type="button"
          onClick={toggleVoice}
          aria-pressed={listening}
          aria-describedby={!speechSupported ? statusId : undefined}
          aria-label={listening ? 'Spracheingabe beenden' : speechSupported ? 'Spracheingabe starten' : 'Spracheingabe nicht verfügbar; Alternativen anzeigen'}
        >
          {listening ? <Square size={18} aria-hidden="true" /> : <Mic size={19} aria-hidden="true" />}
          <span>{listening ? 'Stopp' : speechSupported ? 'Sprache' : 'Nur Text'}</span>
        </button>
        <button className="send-action" type="submit" disabled={offline || submitting || text.trim().length < 4} aria-busy={submitting}>
          <Send size={18} aria-hidden="true" />
          <span>{submitting ? 'Wird gesendet…' : continuingIntent ? 'Weiter' : 'Senden'}</span>
        </button>
        {submitError && (
          <p className="owner-composer-status" role="alert" data-tone="error">{submitError}</p>
        )}
      </div>
      {connectionStatus && (
        <p id={statusId} className="owner-composer-status" role="status" aria-live="polite" aria-atomic="true">
          {connectionStatus}
        </p>
      )}
    </form>
  );
}

```
