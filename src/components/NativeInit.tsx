"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Keyboard, KeyboardStyle } from "@capacitor/keyboard";

export default function NativeInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    StatusBar.setBackgroundColor({ color: "#faf6ef" }).catch(() => {});
    Keyboard.setStyle({ style: KeyboardStyle.Light }).catch(() => {});
    Keyboard.setResizeMode({ mode: "native" } as any).catch(() => {});
  }, []);
  return <>{children}</>;
}
