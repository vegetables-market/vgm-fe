"use client";

import { useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type PWAInstallPromptVariant = "chromium" | "ios" | "manual" | null;

export type PWAInstallPromptOptions = {
  dismissDays?: number;
  iosDelayMs?: number;
  manualDelayMs?: number;
  storageKey?: string;
};

const DEFAULT_OPTIONS: Required<PWAInstallPromptOptions> = {
  dismissDays: 14,
  iosDelayMs: 2000,
  manualDelayMs: 5000,
  storageKey: "vgm.installPrompt.dismissedUntil",
};

function getIsStandalone(): boolean {
  // iOS Safari: navigator.standalone
  const isIOSStandalone =
    "standalone" in window.navigator &&
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true;
  return (
    isIOSStandalone ||
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches
  );
}

function isIOSDevice(): boolean {
  const ua = window.navigator.userAgent ?? "";
  return /iPad|iPhone|iPod/i.test(ua);
}

function setDismissedForDays(storageKey: string, days: number) {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  window.localStorage.setItem(storageKey, String(until));
}

function isDismissed(storageKey: string): boolean {
  const dismissedUntilRaw = window.localStorage.getItem(storageKey);
  const dismissedUntil = dismissedUntilRaw ? Number(dismissedUntilRaw) : NaN;
  return Number.isFinite(dismissedUntil) && Date.now() < dismissedUntil;
}

export function usePWAInstallPrompt(options?: PWAInstallPromptOptions) {
  const resolved = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...(options ?? {}) }),
    [options],
  );

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [showManualHint, setShowManualHint] = useState(false);

  useEffect(() => {
    setIsStandalone(getIsStandalone());
    setIsIOS(isIOSDevice());
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);

    try {
      setDismissed(isDismissed(resolved.storageKey));
    } catch {
      // localStorage can fail in some privacy modes; fail open (show prompt).
      setDismissed(false);
    }
  }, [resolved.storageKey]);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      // Chromium only. Prevent default mini-infobar and allow custom UI.
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowIOSHint(false);
      setShowManualHint(false);

      // Hide for a long time once installed.
      try {
        setDismissedForDays(resolved.storageKey, 3650);
      } catch {
        // ignore
      }
      setDismissed(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      onBeforeInstallPrompt as EventListener,
    );
    window.addEventListener("appinstalled", onAppInstalled);

    const mql = window.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = () => setIsStandalone(getIsStandalone());
    mql.addEventListener("change", onDisplayModeChange);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt as EventListener,
      );
      window.removeEventListener("appinstalled", onAppInstalled);
      mql.removeEventListener("change", onDisplayModeChange);
    };
  }, [resolved.storageKey]);

  useEffect(() => {
    if (!window.isSecureContext) {
      setShowIOSHint(false);
      return;
    }

    if (isStandalone || dismissed || deferredPrompt || !isIOS) {
      setShowIOSHint(false);
      return;
    }

    const t = window.setTimeout(() => setShowIOSHint(true), resolved.iosDelayMs);
    return () => window.clearTimeout(t);
  }, [
    deferredPrompt,
    dismissed,
    isIOS,
    isStandalone,
    resolved.iosDelayMs,
  ]);

  useEffect(() => {
    if (!window.isSecureContext) {
      setShowManualHint(false);
      return;
    }

    if (isStandalone || dismissed || deferredPrompt || isIOS || !isMobile) {
      setShowManualHint(false);
      return;
    }

    const t = window.setTimeout(
      () => setShowManualHint(true),
      resolved.manualDelayMs,
    );
    return () => window.clearTimeout(t);
  }, [
    deferredPrompt,
    dismissed,
    isIOS,
    isMobile,
    isStandalone,
    resolved.manualDelayMs,
  ]);

  const variant: PWAInstallPromptVariant =
    window.isSecureContext && !isStandalone && !dismissed
      ? deferredPrompt
        ? "chromium"
        : showIOSHint
          ? "ios"
          : showManualHint
            ? "manual"
            : null
      : null;

  const dismiss = () => {
    setShowIOSHint(false);
    setShowManualHint(false);
    try {
      setDismissedForDays(resolved.storageKey, resolved.dismissDays);
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  const install = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowIOSHint(false);
    setShowManualHint(false);

    if (outcome !== "accepted") {
      dismiss();
    }

    return outcome;
  };

  return { variant, install, dismiss };
}

