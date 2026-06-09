"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function AnimatedCounter({ value, suffix, label }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const observed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || observed.current) return;
        observed.current = true;

        let start: number | null = null;
        const duration = 1400;

        const tick = (ts: number) => {
          if (!start) start = ts;
          const t = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(eased * value));
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{
        fontSize: 44, fontWeight: 700, color: "#fff",
        lineHeight: 1, marginBottom: 8,
        display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4,
      }}>
        <span>{display}</span>
        {suffix && <span style={{ fontSize: 22, color: "var(--g)", fontWeight: 700 }}>{suffix}</span>}
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{label}</div>
    </div>
  );
}
