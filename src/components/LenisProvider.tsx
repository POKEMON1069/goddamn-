"use client";

import { useMemo } from "react";
import { useSmoothScroll } from "@/lib/scroll";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const opts = useMemo(() => ({ lerp: 0.08, duration: 1.2 }), []);
  useSmoothScroll(opts);
  return <>{children}</>;
}
