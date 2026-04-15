import { useEffect } from 'react';
import { useStore } from '../lib/store';

export function TimerDriver() {
  const running = useStore((s) => s.timerRunning);
  const alert = useStore((s) => s.timerAlert);
  const tick = useStore((s) => s.tickTimer);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [running, tick]);

  useEffect(() => {
    if (!alert) return;

    let ctx: AudioContext | null = null;
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new Ctor();
      void ctx.resume();
    } catch {
      return;
    }

    let cancelled = false;
    let count = 0;
    const maxBeeps = 14;

    const beep = () => {
      if (!ctx || cancelled) return;
      const now = ctx.currentTime;
      const pair = (offset: number, freq: number) => {
        const osc = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.6, now + offset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.25);
        osc.connect(gain).connect(ctx!.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.3);
      };
      pair(0, 988);
      pair(0.3, 1319);
      count++;
      if (count >= maxBeeps) cancelled = true;
    };

    beep();
    const id = window.setInterval(beep, 700);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      try {
        void ctx?.close();
      } catch {
        /* ignore */
      }
    };
  }, [alert]);

  return null;
}
