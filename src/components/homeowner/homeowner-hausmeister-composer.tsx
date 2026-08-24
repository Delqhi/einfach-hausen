'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Camera, Mic, Send, Square } from 'lucide-react';
import { sendHausmeisterAction } from '@/app/actions';

export function HomeownerHausmeisterComposer({
  continuingIntent,
  starterHint,
}: {
  continuingIntent?: 'service' | 'contact' | null;
  starterHint?: string;
}) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [offline, setOffline] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognition = useRef<any>(null);
  const descriptionId = useId();
  const fileId = useId();
  const statusId = useId();

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
    <form action={sendHausmeisterAction} className="agent-composer" aria-describedby={connectionStatus ? statusId : undefined}>
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
          <span>Medien</span>
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
          <span>{listening ? 'Stop' : speechSupported ? 'Sprechen' : 'Nur Text'}</span>
        </button>
        <button className="send-action" type="submit" disabled={offline || text.trim().length < 4}>
          <Send size={18} aria-hidden="true" />
          <span>{continuingIntent ? 'Weiter' : 'Senden'}</span>
        </button>
      </div>
      {connectionStatus && (
        <p id={statusId} className="owner-composer-status" role="status" aria-live="polite" aria-atomic="true">
          {connectionStatus}
        </p>
      )}
    </form>
  );
}
