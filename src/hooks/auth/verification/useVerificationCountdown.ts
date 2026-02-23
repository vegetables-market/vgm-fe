"use client";

import { useEffect, useState } from "react";

export function useVerificationCountdown(expiresAt?: string) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const end = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      return Math.max(0, Math.floor((end - now) / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return { timeLeft };
}

export function useResendCooldown(nextResendAt?: string) {
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!nextResendAt) {
      setResendCooldown(0);
      return;
    }

    const calculateCooldown = () => {
      const end = new Date(nextResendAt).getTime();
      const now = new Date().getTime();
      return Math.max(0, Math.floor((end - now) / 1000));
    };

    const initial = calculateCooldown();
    setResendCooldown(initial);

    if (initial > 0) {
      const timer = setInterval(() => {
        const remaining = calculateCooldown();
        setResendCooldown(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [nextResendAt]);

  return { resendCooldown };
}
