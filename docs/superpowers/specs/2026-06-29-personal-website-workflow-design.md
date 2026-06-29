# Personal Academic Website — Workflow Architecture & Site Design

> Design spec. Created 2026-06-29. Owner: Kyungtae (Tae) Lee, Ph.D. candidate in
> Economics, CUNY Graduate Center.

## 1. Purpose

Build a personal academic website to support the **economics job market**. The site
presents the candidate's profile, research (with the job market paper front and center),
teaching, and CV. This spec defines both the **workflow architecture** (how we build and
maintain the site with Claude) and the **site plan** (what we build, in what order).

Treated as a **fresh start**. The existing `old materials/taelee_website` Hugo project is
a barely-modified downloaded template; it is reference-only (content structure: Research /
Teaching / CV / profile, ORCID, Google Scholar, email).

## 2. Decisions (locked)

| Decision | Choice | Reason |
|----------|--------|--------|
| Static site generator | **Hugo** (PaperMod theme) | Purpose-built for academic sites; markdown content; free, low-maintenance |
| Hosting | **GitHub Pages** | Free, pairs naturally with Hugo, push-to-deploy |
| Primary goal | **Job market** | Drives content priority: JMP, CV, research surfaced first |
| Sections | Home/Profile · Research · Teaching · CV (PDF) | Standard econ job-market site |
| Architecture depth | **Balanced** | CLAUDE.md + WORKFLOW.md + a few recipe skills + one combined reviewer agent |
| Theme | Light theme only, no dark mode | Clean academic look; matches house style |

## 3. Two-Drawer Model

The site uses the same separation as the Platform project:

- **Drawer 1 — Superpowers plugin (methodology).** Drives *how* we work:
  `brainstorming → writing-plans → build → requesting-code-review →
  verification-before-completion`. Plugin-managed; updates never touch our files.
  Superpowers is **not replaced** by Drawer 2 — Drawer 2 *complements* it (recipes
  shortcut repetitive work; the reviewer agent adds static-site-specific review lenses).
- **Drawer 2 — this repo (`CLAUDE.md` + `.claude/`).** Holds *what* we build: this
  site's rules, recipe skills, and reviewer agent. Safe from plugin updates.

| Layer | Owns | Examples |
|-------|------|----------|
| Drawer 1 (Superpowers) | Working method | New page/feature = `brainstorming → writing-plans → build`; review + verify before done |
| Drawer 2 (this repo) | Site-specific knowledge | `/new-paper` recipe, `academic-web-reviewer`, job-market rules |

## 4. Repo Structure

```
personal_website/
├── CLAUDE.md              # Drawer 2: project rules (loaded every session)
├── WORKFLOW.md            # living doc: phased plan + Decision Log
├── .claude/
│   ├── agents/
│   │   └── academic-web-reviewer.md
│   └── skills/
│       ├── new-paper/     # /new-paper recipe
│       ├── new-teaching/  # /new-teaching recipe
│       └── update-cv/     # /update-cv recipe
├── hugo.yml               # Hugo config (baseURL = github.io)
├── content/               # _index.md (home), papers/, teaching/
├── themes/PaperMod/       # git submodule
├── static/                # cv.pdf, picture.jpeg, favicon
├── layouts/               # PaperMod overrides (only if needed)
├── docs/superpowers/      # specs/ + plans/ (spec→plan→build record)
└── .github/workflows/     # GitHub Pages auto-deploy
```

## 5. CLAUDE.md — Project Rules (hard rules)

- **Light theme only.** No dark mode.
- **Mobile-responsive.** PaperMod default; every page must work on a phone.
- **Academic accuracy first.** Never invent paper titles, authors, years, coauthors, or
  links. Only state facts the user has confirmed. When unsure, ask.
- **Job-market conventions.** JMP (job market paper) surfaced at the top of Research; CV
  PDF always current; no broken or placeholder links.
- **Always buildable.** `hugo` build must pass after every change.
- **Never commit secrets.** No `.env*` content in the repo/history.
- **Drawer discipline.** Our rules/skills/agents live only in this repo's `.claude/`,
  never inside the Superpowers plugin.
- **How we work (Superpowers leads).** Methodology is driven by the Superpowers plugin —
  let it run. The user reviews specs/plans; Claude builds. Walk `WORKFLOW.md` one item at
  a time and keep it updated.

CLAUDE.md also contains the **Dispatch Table** (Section 8) and a "Two Drawers" note.

## 6. WORKFLOW.md — Phased Plan (job-market driven)

Status keys: ⬜ todo · 🔄 in progress · ✅ done

- **Phase 0 — Scaffold.** `hugo new site`; add PaperMod as a submodule; `hugo.yml`
  (baseURL, menu, profile params); `.github/workflows` for GitHub Pages; empty site live.
- **Phase 1 — Home/Profile.** Photo + one-line intro + research fields + link buttons
  (CV, Email, Google Scholar, ORCID). PaperMod profile mode.
- **Phase 2 — Research.** JMP highlighted at top → working papers → work in progress
  (→ publications if any). Each entry: title, authors, year, abstract, PDF/link, status.
- **Phase 3 — CV.** Upload `static/cv.pdf` + prominent download link (web version optional).
- **Phase 4 — Teaching.** Teaching/TA experience, evaluations, course materials links.
- **Phase 5 — Polish.** Custom domain (optional, later), SEO/meta tags, favicon,
  responsive + accessibility pass.

A **Decision Log** records the choices in Section 2 (and future ones), Platform-style.

## 7. Drawer 2 Components

### Recipe Skills (3 to start)

- **`/new-paper`** — Add one paper to Research. Prompts for title, authors, year,
  abstract, PDF/link, and status (JMP / working paper / WIP / published); generates the
  markdown entry and places it correctly (JMP at top).
- **`/new-teaching`** — Add one teaching/TA entry.
- **`/update-cv`** — Replace `static/cv.pdf` and refresh the site's CV link/date.

### Reviewer Agent (1, combined)

- **`academic-web-reviewer`** — Run after content/build changes. Report-only (never edits):
  - *Academic lens:* job-market conventions (JMP prominent, CV current, links valid),
    tone/notation consistency, broken or empty links.
  - *Web lens:* light-theme compliance, mobile responsiveness, accessibility (image alt
    text, heading structure), metadata.

  Fix CRITICAL/WARNING items the agent reports.

## 8. Dispatch Table (lives in CLAUDE.md)

| Task | Build with | Review after (report-only) |
|------|-----------|----------------------------|
| Add a paper | `/new-paper` | `academic-web-reviewer` |
| Add teaching entry | `/new-teaching` | `academic-web-reviewer` |
| Update CV | `/update-cv` | `academic-web-reviewer` |
| New page / layout / styling | `brainstorming → writing-plans → build` | `academic-web-reviewer` |

## 9. Out of Scope (YAGNI / parking lot)

- Blog / posts, custom domain purchase (revisit in Phase 5), Google Analytics, comments,
  separate reviewer agents (start with one combined), search, multi-language. Add only if
  a real need appears.

## 10. Success Criteria

- The four-section site (Home, Research, Teaching, CV) builds with `hugo` and deploys to
  GitHub Pages with no broken links.
- JMP and CV PDF are reachable within one click from the home page.
- Adding a new paper is a single `/new-paper` invocation.
- `academic-web-reviewer` runs clean (no CRITICAL items) before any "done" claim.
