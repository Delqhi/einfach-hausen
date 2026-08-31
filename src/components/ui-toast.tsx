"use client";

// EH T-0208: minimal design-system toast (sonner pattern, zero deps).
// Usage: uiToast("Gespeichert", { kind: "success" | "error" | "info" })

type ToastKind = "success" | "error" | "info";

let host: HTMLDivElement | null = null;

function ensureHost(): HTMLDivElement {
  if (host) return host;
  host = document.createElement("div");
  host.className = "eh-toast-host";
  host.setAttribute("role", "status");
  host.setAttribute("aria-live", "polite");
  document.body.appendChild(host);
  return host;
}

export function uiToast(message: string, options: { kind?: ToastKind; duration?: number } = {}): void {
  const { kind = "info", duration = 3200 } = options;
  const el = document.createElement("div");
  el.className = `eh-toast eh-toast-${kind}`;
  el.textContent = message;
  const container = ensureHost();
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add("eh-toast-in"));
  window.setTimeout(() => {
    el.classList.remove("eh-toast-in");
    el.classList.add("eh-toast-out");
    window.setTimeout(() => el.remove(), 260);
  }, duration);
  // Haptics-lite (Android; iOS Safari ignores navigator.vibrate).
  if (kind === "success" && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(12); } catch {}
  }
}
