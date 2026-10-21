"use client";

import { useEffect, useState } from "react";

export function Clock({ timeZone, label }: { timeZone: string; label: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            timeZone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        setTime("");
      }
    };
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span className="clock">
      <span className="clock__dot" aria-hidden="true" />
      {label} <span className="clock__time">{time || "--:--"}</span>
    </span>
  );
}
