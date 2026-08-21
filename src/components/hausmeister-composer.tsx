'use client';

import { useRef,useState } from 'react';
import { Camera,Mic,Send,Square } from 'lucide-react';
import { sendHausmeisterAction } from '@/app/actions';

export function HausmeisterComposer({continuingIntent}:{continuingIntent?:'service'|'contact'|null}){
  const [text,setText]=useState(''); const [listening,setListening]=useState(false); const recognition=useRef<any>(null);
  function toggleVoice(){
    if(listening){recognition.current?.stop();setListening(false);return;}
    const Ctor=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
    if(!Ctor){alert('Spracheingabe wird von diesem Browser nicht unterstützt.');return;}
    const r=new Ctor(); recognition.current=r; r.lang='de-DE'; r.interimResults=true; r.continuous=false;
    r.onresult=(event:any)=>{let value='';for(let i=event.resultIndex;i<event.results.length;i++)value+=event.results[i][0].transcript;setText(value.trim());};
    r.onend=()=>setListening(false); r.onerror=()=>setListening(false); setListening(true); r.start();
  }
  const placeholder=continuingIntent==='contact'
    ?'Beantworte nur noch die kurze Rückfrage, damit ich deinen Ansprechpartner finde …'
    :continuingIntent==='service'
      ?'Beantworte nur noch die kurze Rückfrage, damit ich den Auftrag organisieren kann …'
      :'Frag deinen KI-Hausmeister alles rund ums Eigenheim …';
  return <form action={sendHausmeisterAction} className="agent-composer">
    <textarea name="description" value={text} onChange={e=>setText(e.target.value)} rows={3} required placeholder={placeholder}/>
    <div className="agent-actions">
      <label className="icon-action" title="Foto hinzufügen"><Camera size={19}/><span>Foto</span><input name="photo" type="file" accept="image/*"/></label>
      <button className={listening?'icon-action recording':'icon-action'} type="button" onClick={toggleVoice}>{listening?<Square size={18}/>:<Mic size={19}/>}<span>{listening?'Stop':'Sprechen'}</span></button>
      <button className="send-action" type="submit" disabled={text.trim().length<4}><Send size={18}/><span>{continuingIntent?'Weiter':'Senden'}</span></button>
    </div>
  </form>;
}
