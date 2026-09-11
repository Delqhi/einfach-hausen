"use client";
import {useEffect, useId, useRef, useState, type FormEvent} from 'react';
import {EHButton, EHText} from './primitives';
import {EHField, EHTextarea} from './app';
import s from './styles.module.css';

export type EHAssistantMessage = {role: 'user' | 'assistant'; content: string};
export type EHAssistantResult = {reply: string; kind: 'reply' | 'login' | 'quota' | 'error'};

/** User-opened customer assistant; data access and account policy belong to the consumer. */
export function EHAssistant({onSend, loginHref, settingsHref, aboveNavigation = false, placement = 'floating'}: {
  onSend: (messages: EHAssistantMessage[], signal: AbortSignal) => Promise<EHAssistantResult>;
  loginHref: string; settingsHref: string; aboveNavigation?: boolean; placement?: 'floating' | 'toolbar';
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const [messages, setMessages] = useState<EHAssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<EHAssistantResult | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, notice]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || request.current) return;
    const controller = new AbortController(); request.current = controller;
    setBusy(true); setNotice(null);
    const next: EHAssistantMessage[] = [...messages, {role: 'user', content: text}];
    try {
      const result = await onSend(next.slice(-12), controller.signal);
      if (controller.signal.aborted) return;
      if (result.kind === 'reply') { setMessages([...next, {role: 'assistant', content: result.reply}]); setInput(''); }
      else setNotice(result);
    } catch {
      if (!controller.signal.aborted) setNotice({kind: 'error', reply: 'Die Verbindung ist gerade unterbrochen. Deine Frage bleibt im Eingabefeld. Du kannst es erneut versuchen.'});
    } finally {
      if (request.current === controller) { request.current = null; setBusy(false); }
    }
  }

  return <div className={s.scope} data-eh-app>
    <button ref={launcher} type="button" className={s.assistantLauncher} data-placement={placement} data-above-nav={aboveNavigation || undefined}
      aria-label="Hausassistent öffnen" aria-haspopup="dialog" aria-controls={id} onClick={() => dialog.current?.showModal()}>
      <img src="/brand/logo-full.png" alt="" width={64} height={42} />
      <span><strong>{placement === 'toolbar' ? 'Hausassistent' : 'Frag deinen Hausassistenten'}</strong>{placement !== 'toolbar' && <small>KI-Hilfe rund um dein Zuhause</small>}</span>
    </button>
    <dialog ref={dialog} id={id} className={s.assistantDialog} aria-labelledby={id+'-title'} onClose={() => launcher.current?.focus()}>
      <header className={s.assistantHeader}>
        <img src="/brand/logo-full.png" alt="einfachhausen" width={72} height={46} />
        <div><h2 id={id+'-title'}>Dein Hausassistent</h2><span>KI-Unterstützung</span></div>
        <EHButton variant="quiet" aria-label="Chat schließen" onClick={() => dialog.current?.close()}>×</EHButton>
      </header>
      <div ref={log} className={s.assistantMessages} role="log" aria-label="Chatverlauf" aria-live="polite" aria-relevant="additions text">
        <div className={s.assistantWelcome}>
          <h3>Was beschäftigt dich an deinem Haus?</h3>
          <EHText>Beschreibe dein Anliegen. Ich helfe dir, Fragen zu klären und den nächsten Schritt zu finden.</EHText>
          <EHText size="meta" muted>Du sprichst mit einer KI. Antworten können Fehler enthalten. Ein Chat beauftragt keinen Betrieb.</EHText>
        </div>
        {messages.map((message, index) => <div key={index} className={s.assistantMessage} data-role={message.role}>
          <strong>{message.role === 'user' ? 'Du' : 'Hausassistent · KI'}</strong><p>{message.content}</p>
        </div>)}
        {busy && <p role="status">Deine Antwort wird vorbereitet …</p>}
        {notice && <div className={s.assistantNotice} role="status">
          <p>{notice.reply}</p>
          {notice.kind === 'login' && <EHButton href={loginHref}>Zum Hauskonto anmelden</EHButton>}
          {notice.kind === 'quota' && <EHButton href={settingsHref} variant="secondary">KI-Kontingent ansehen</EHButton>}
        </div>}
      </div>
      <form className={s.assistantComposer} onSubmit={send}>
        <EHField id={id+'-question'} label="Deine Frage" hint="Bitte keine Passwörter oder Zahlungsdaten eingeben.">
          <EHTextarea id={id+'-question'} value={input} onChange={event => setInput(event.target.value)}
            rows={3} maxLength={4000} required disabled={busy} aria-describedby={id+'-question-hint'} placeholder="Zum Beispiel: Meine Heizung macht ungewöhnliche Geräusche." />
        </EHField>
        <div className={s.assistantActions}>
          <a href="/kontakt">Persönlicher Kontakt</a>
          <EHButton type="submit" disabled={busy || !input.trim()} aria-busy={busy} arrow>{busy ? 'Wird gesendet …' : 'Frage senden'}</EHButton>
        </div>
      </form>
    </dialog>
  </div>;
}
