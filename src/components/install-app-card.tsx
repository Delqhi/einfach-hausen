'use client';

import { useEffect,useState } from 'react';
import { Download,Share2,Smartphone } from 'lucide-react';

type Mode='loading'|'installed'|'prompt'|'ios'|'manual';

export function InstallAppCard({dark=false}:{dark?:boolean}){
  const [mode,setMode]=useState<Mode>('loading');
  useEffect(()=>{
    const detect=()=>{
      const standalone=window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & {standalone?:boolean}).standalone);
      if(standalone){setMode('installed');return;}
      if(window.__ehInstallPrompt){setMode('prompt');return;}
      setMode(/iPhone|iPad|iPod/i.test(navigator.userAgent)?'ios':'manual');
    };
    const frame=requestAnimationFrame(detect);
    window.addEventListener('eh-install-ready',detect);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('eh-install-ready',detect);};
  },[]);
  if(mode==='loading')return null;
  const install=async()=>{
    const prompt=window.__ehInstallPrompt;
    if(!prompt)return;
    await prompt.prompt();
    const choice=await prompt.userChoice.catch(()=>null);
    if(choice?.outcome==='accepted'){window.__ehInstallPrompt=undefined;setMode('installed');}
  };
  return <div className={dark?'pwa-install-card dark':'pwa-install-card'}>
    <span className="pwa-install-icon"><Smartphone/></span>
    <div className="grow"><strong>{mode==='installed'?'Einfach Hausen ist als App installiert':'Einfach Hausen aufs Handy'}</strong>{mode==='installed'?<p>Du kannst die App direkt vom Home-Bildschirm öffnen.</p>:mode==='ios'?<p>In Safari auf <b>Teilen</b> und danach <b>Zum Home-Bildschirm</b> tippen.</p>:mode==='prompt'?<p>Installiere die Web-App ohne App Store. Deine Anmeldung bleibt erhalten.</p>:<p>Öffne das Browser-Menü und wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.</p>}</div>
    {mode==='prompt'&&<button type="button" className="btn ghost" onClick={install}><Download size={16}/>Installieren</button>}
    {mode==='ios'&&<span className="pwa-install-hint"><Share2 size={17}/></span>}
  </div>;
}
