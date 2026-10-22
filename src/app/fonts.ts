/*
 * Type system (Phase 2) — self-contained, no external requests.
 *
 * One system sans family used for both roles; display becomes an active
 * design element through scale, weight and tight negative tracking rather
 * than a second family. No Google/Fontshare fetch at build time, so the
 * site works fully offline and has zero font-related layout shift.
 */
export const displayFont = {
  className: "",
  style: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
  },
};

export const textFont = {
  className: "",
  style: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
  },
};
