# CLAUDE.md — Personal Academic Website

> Project rules. Claude reads this every session. This file is **ours** (Drawer 2) —
> edit anytime; Superpowers plugin updates never touch it. See `WORKFLOW.md` for the
> phased plan and its Decision Log for why choices were made.

## What this is

The personal academic website of **Kyungtae (Tae) Lee**, Ph.D. candidate in Economics at
CUNY Graduate Center (energy & environmental economics, applied econometrics, development).
Its purpose is the **economics job market**: present profile, research (job market paper
front and center), teaching, and CV. Built with **Hugo + PaperMod**, deployed to
**GitHub Pages** at `https://taelee1085.github.io/`.

## Stack

- **Hugo (extended) + PaperMod theme** (submodule at `themes/PaperMod`)
- **Config:** `hugo.yml` (YAML, repo root)
- **Content:** Markdown under `content/`
- **Hosting:** GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

## Hard rules

- **Light theme only.** No dark mode (`defaultTheme: light`, `disableThemeToggle: true`).
- **Mobile-responsive.** Every page must work on a phone (PaperMod default; don't break it).
- **Academic accuracy first.** NEVER invent paper titles, coauthors, years, venues, or
  links. State only facts the user has confirmed. When unsure, ask.
- **Job-market conventions.** The job market paper (JMP) is surfaced at the top of
  Research; the CV PDF is always current and reachable in one click from the home page;
  no broken or placeholder links ship.
- **Always buildable.** `hugo --gc --minify` must pass after every change.
- **Never commit secrets.** No `.env*` content in the repo/history.
- **Drawer discipline.** Our rules/skills/agents live only in this repo's `CLAUDE.md` +
  `.claude/`, never inside the Superpowers plugin.

## How we work

- **Methodology (Drawer 1 — Superpowers):** the plugin drives the process — brainstorm a
  spec, plan, build, review, verify. **Let it run.** New pages/features go
  `brainstorming → writing-plans → build`.
- **The user reviews, Claude builds.** Explain decisions in plain language; the user reads
  specs/plans rather than code line-by-line.
- Walk the phases in `WORKFLOW.md` one item at a time; keep that file updated.

## Dispatch table — which helper for which job

The main session routes each task to the right skill/agent (subagents can't spawn other
subagents, so routing happens here):

| Task | Build with | Review after (report-only) |
|------|-----------|----------------------------|
| Add a research paper | `/new-paper` skill | `academic-web-reviewer` |
| Add a teaching entry | `/new-teaching` skill | `academic-web-reviewer` |
| Update the CV PDF | `/update-cv` skill | `academic-web-reviewer` |
| New page / layout / styling | `brainstorming → writing-plans → build` | `academic-web-reviewer` |

`academic-web-reviewer` never edits — it reports. After content/build changes, run it and
fix CRITICAL/WARNING items. Run `/reload-plugins` after adding new agents or skills.

## Commands

- dev server: `hugo server -D`
- build: `hugo --gc --minify`
- new content: `hugo new content papers/<slug>.md` (prefer the `/new-paper` skill)

## Two drawers (where things live)

- **Drawer 1 — Superpowers plugin:** shared methodology + skills. Update via
  `/plugin update` then `/reload-plugins`. Don't edit in place.
- **Drawer 2 — this repo (`CLAUDE.md` + `.claude/`):** our own rules/skills/agent.
  Safe from plugin updates. This is where we customize.
