'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __ehInstallPrompt?: Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
  }
}

export function PwaRegister(){
  useEffect(()=>{
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').catch(()=>{});
    }
    const onInstallPrompt=(event:Event)=>{
      event.preventDefault();
      window.__ehInstallPrompt=event as Window['__ehInstallPrompt'];
      window.dispatchEvent(new Event('eh-install-ready'));
    };
    window.addEventListener('beforeinstallprompt',onInstallPrompt);
    return ()=>window.removeEventListener('beforeinstallprompt',onInstallPrompt);
  },[]);
  return null;
}
