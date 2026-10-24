# 04 — Pinterest investigation (mandatory step)

## Result: Pinterest was not accessible from this environment

I attempted the investigation as required, rather than substituting a general web
search and calling it Pinterest research. Everything below is what actually happened.

### Attempts made

| Attempt | Target | Result |
| --- | --- | --- |
| Direct page fetch | `https://www.pinterest.com/search/pins/?q=editorial%20web%20design%20portfolio` | **HTTP 403** (blocked — Pinterest disallows unauthenticated automated access) |
| Direct network request | `https://www.pinterest.com/` via `curl` | **Connection failed (exit code 6/000)** — the host is not in this sandbox's outbound allowlist (only GitHub, npm, PyPI and Hugging Face are reachable) |
| Web search, Pinterest-scoped | `pinterest creative developer portfolio editorial web design inspiration` | Returned **third-party** results: a Medium article about a Pinterest-*inspired* portfolio, a Reddit thread listing design galleries, and listicles. **No Pinterest board or pin was returned**, so no Pinterest page could be inspected. |

### Why this matters, stated plainly

- A Pinterest board is a set of images with no interaction to study. Even if the pages
  had loaded, they could not have told me how a site behaves, what its focus order is, or
  whether its motion respects `prefers-reduced-motion`.
- I will not describe pins I did not see. There are **no invented Pinterest findings in
  this project** — no board URLs, no pin titles, no "inspired by this pin" claims.

### What replaced it (and is labelled as such)

The visual research was carried out on the live sites listed in
[03 — References](03-references.md) — fourteen sites, inspected rather than pinned — plus
the three design galleries that *were* reachable (Awwwards, Siteinspire, Land-book) and
Minimal Gallery. Those delivered the same thing a Pinterest board would have been used
for (composition, hierarchy, type and colour relationships) with the additional ability
to inspect behaviour.

### Recommended follow-up (for a human with Pinterest access)

Search these combinations, which are the ones this brief would have used, and record the
*underlying decision* rather than the image:

1. `creative developer portfolio` — look for how proof is placed above the fold.
2. `experimental portfolio design` — separate usable experimentation from novelty.
3. `editorial web design` — column measures, margin notes, rules and captions.
4. `typography-driven portfolio` — display/body pairing and line-length discipline.
5. `interactive portfolio design` — what the interaction is *for*.
6. `motion design website` — entrance pacing and reduced-motion handling.
7. `unconventional navigation` — does it remain learnable and keyboard-usable?
8. `project case-study layouts` — how much of the process is shown before the result.
9. `minimalist portfolio layout` — the crowded lane this build deliberately avoids.
10. `mobile portfolio experience` — composition changes, not shrunk desktop layouts.

**Honest status: Phase 4 is incomplete due to access restrictions, and this is documented
rather than fabricated.**
