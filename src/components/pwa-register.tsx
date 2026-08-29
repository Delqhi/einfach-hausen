'use client';

import { useEffect } from 'react';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

declare global {
  interface Window {
    __ehInstallPrompt?: InstallPromptEvent;
  }
}

function emit(name: 'eh-install-ready' | 'eh-install-complete' | 'eh-service-worker-ready') {
  window.dispatchEvent(new Event(name));
}

// Browser Push is explicitly unavailable (per T-0033 / issue-12 decision).
// No subscription request is shown; the settings page explains why.
function requestBrowserPushSubscription() {
  throw new Error('Browser Push is unavailable — per issue-12 decision, PWA is the approved launch channel and push is disabled in settings.');
}

export function PwaRegister() {
  useEffect(() => {
    let cancelled = false;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then(() => navigator.serviceWorker.ready)
        .then(() => {
          if (!cancelled) emit('eh-service-worker-ready');
        })
        .catch(() => {
          // Registration failure must not break the web app. The settings page
          // reports whether this browser is actually controlled by the worker.
        });
    }

    // Deliberately do NOT request push permission — push is unavailable.
    // If a future task requires native store distribution, a new canonical task
    // through sin-gpt-web-state must create the proper infrastructure.

    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.__ehInstallPrompt = event as InstallPromptEvent;
      emit('eh-install-ready');
    };

    const onInstalled = () => {
      window.__ehInstallPrompt = undefined;
      emit('eh-install-complete');
    };

    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      cancelled = true;
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  return null;
}
