# 01 — Subject brief

## What was actually supplied

The repository at `637fb5a` contained one page and no personal data:

- `index.html` — a single-screen "Qintara" hero: brand, six nav labels (Services, How it
  works, AI, Security, Integrations, Resources), the headline *"When intelligence reaches
  out to instinct, the future takes shape"*, a subline about "an unlikely alliance", a
  `Get started` button, a `See it in action` button, and CSS-drawn abstract art (pixel
  hands, a cube assembly).
- `src/styles.css` — one dark-mode stylesheet with a violet/peach glow palette.
- `package.json` — Vite only; `src/main.js` — an `IntersectionObserver` reveal.

There was **no name, biography, employment history, project list, testimonial, award,
metric, location or contact detail** anywhere in the repository. That is why Phase 1
ended with three questions rather than assumptions.

## Decisions taken with the user

| Question | Answer |
| --- | --- |
| Whose story is this? | **Keep "Qintara" as the studio brand**, with **demo case studies clearly marked as demonstrations** |
| How deep? | **Multi-page**: landing page plus dedicated case-study pages |
| Stack? | "Whatever allows creative designs" → assessed and chosen in [09 — Architecture](09-architecture.md) |

Those three answers define the permission boundary of this project:

- The **brand** (Qintara), its tagline and its subject matter (intelligence meeting
  instinct) are authorised.
- The **case studies** are explicitly fictional demonstrations. Every one is labelled
  in-page, and no client, award, testimonial, metric or outcome is claimed.
- The **contact details** are placeholders on the reserved `.example` domain.
- **No personal information** — no name, photo, employer, education, location or social
  profile — is used, because none was supplied.

## The subject

**Qintara** — a small interface studio, positioned between design research and
production engineering. Verb: *design and build interfaces where human judgement and
computation meet.* Demonstrable capability (i.e. evidenced by this site itself):
interface systems, editorial web, motion and interaction, type and identity, research
and prototyping.

## Audience and purpose

| Audience | What they are deciding | What the site must do |
| --- | --- | --- |
| Prospective clients (technical founders, product leads) | "Is this studio worth a conversation?" | Show judgement in the first screen; make the work legible in under two minutes; make contact one click away |
| Hiring managers / collaborators | "Can this person design *and* build?" | Evidence of craft in the implementation itself — live component, real accessibility work, honest case-study structure |
| Peers and the design community | "Is there an original point of view here?" | A clear, opinionated art direction that is not another dark-mode gradient portfolio |

Success criteria: a visitor can state what Qintara believes, see one piece of working
proof, and reach contact without scrolling the whole page; the case studies survive a
skeptical read (no invented proof); the site remains fully usable on a mid-range phone,
without JavaScript, and with reduced motion enabled.

## Content inventory

| Content | Status | Source |
| --- | --- | --- |
| Studio name, tagline, subject | **Real (supplied)** | Repository hero |
| Positioning paragraph, manifesto, principles | Written for this build | Informed by the supplied tagline |
| Four case studies (context, constraint, decisions, trade-offs, signals) | **Written demonstrations** | Original writing; no real client |
| Capability list, method | Written for this build | Reflects what the site itself demonstrates |
| Imagery (4 plates) | Produced for this build | Image generation, art-directed to one palette |
| Contact address, domain | Placeholder (`.example`) | `content/site.json` |
| Names, photos, clients, awards, metrics, testimonials | **Deliberately absent** | Not supplied → not invented |

## Tone

Precise, dry, unsentimental — confident without adjectives. Short declaratives, concrete
verbs, no "passionate", no "we believe in the power of design". The writing takes
positions and names its own trade-offs, including the cost of the decisions it defends.

## Assumptions (documented, easy to replace)

1. **"Qintara" is a studio, not a person.** The supplied copy is brand-voiced ("an
   unlikely alliance"), not first-person, so a studio is the honest reading.
2. **A plausible timezone for a footer clock** (IST) was chosen as a neutral demo
   detail, not a claim about where a real practice sits.
3. **Project names, sectors and modelled durations** belong to the demonstrations.
4. The contact address is unreachable by design; the README explains how to replace it
   in one file.
