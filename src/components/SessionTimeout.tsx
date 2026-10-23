'use client';

import { useEffect, useRef } from 'react';
import { logoutAction } from '@/actions/auth';

export default function SessionTimeout({ timeoutMinutes = 15 }: { timeoutMinutes?: number }) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeoutMs = timeoutMinutes * 60 * 1000;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        try {
          await logoutAction();
        } catch {
          window.location.href = '/acceso-institucional?error=sesion_expirada';
        }
      }, timeoutMs);
    };

    // Eventos que denotan actividad del preceptor/docente
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));

    // Iniciar temporizador
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeoutMinutes]);

  return null;
}
