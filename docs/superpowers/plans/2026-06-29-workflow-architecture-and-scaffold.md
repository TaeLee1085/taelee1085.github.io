# Workflow Architecture + Phase 0 Scaffold — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a deployed, live (empty-but-styled) Hugo academic site on GitHub Pages, plus the full Drawer-2 apparatus (CLAUDE.md, WORKFLOW.md, three recipe skills, one reviewer agent) that governs how the site is built and maintained.

**Architecture:** Hugo + PaperMod theme (theme as a git submodule), config in `hugo.yml`. Two-drawer model: Superpowers plugin = methodology (Drawer 1); this repo's `CLAUDE.md` + `.claude/` = site-specific rules/skills/agent (Drawer 2). GitHub Pages deploy via GitHub Actions. Content (Home/Research/Teaching/CV) is filled later via the recipe skills — not in this plan.

**Tech Stack:** Hugo v0.148.1+extended (installed), PaperMod theme, GitHub Pages + Actions, git. No Node build step.

## Global Constraints

- **SSG:** Hugo extended; theme = PaperMod via git submodule at `themes/PaperMod`.
- **Hosting:** GitHub Pages from a **user-pages repo `taelee1085.github.io`** (account `TaeLee1085`). Site URL `https://taelee1085.github.io/`.
- **baseURL:** `https://taelee1085.github.io/` (exact, trailing slash).
- **Config file:** `hugo.yml` at repo root (YAML).
- **Light theme only.** No dark mode (`disableThemeToggle: true`, `defaultTheme: light`).
- **Always buildable.** `hugo --gc --minify` must exit 0 after every task that touches site files.
- **Drawer discipline.** Site rules/skills/agent live only in this repo's `CLAUDE.md` + `.claude/`.
- **Never commit secrets.** No `.env*` content in repo/history.
- **Reuse existing assets** from `old materials/taelee_website/static/` where noted (photo, favicons). `cv.pdf`/`jmp.pdf` are reused as *starting placeholders* and must be confirmed/replaced by the user later.
- **Commit message footer:** end each commit body with
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Author identity for commits: `git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com"`.

## File Structure (created by this plan)

```
personal_website/
├── hugo.yml                         # Task 1
├── content/_index.md                # Task 1 (home stub, profile mode)
├── themes/PaperMod/                 # Task 1 (submodule)
├── .gitmodules                      # Task 1 (auto from submodule)
├── static/                          # Task 2 (picture.jpeg, favicons, cv.pdf, jmp.pdf)
├── .github/workflows/deploy.yml     # Task 3
├── CLAUDE.md                        # Task 4
├── WORKFLOW.md                      # Task 5
├── .claude/
│   ├── skills/new-paper/SKILL.md    # Task 6
│   ├── skills/new-teaching/SKILL.md # Task 7
│   ├── skills/update-cv/SKILL.md    # Task 8
│   └── agents/academic-web-reviewer.md  # Task 9
└── docs/superpowers/{specs,plans}/  # already exists
```

Already committed (do not recreate): `.gitignore`, `docs/superpowers/specs/2026-06-29-personal-website-workflow-design.md`, this plan.

---

### Task 1: Hugo scaffold + PaperMod + config + home stub

**Files:**
- Create: `hugo.yml`
- Create: `content/_index.md`
- Add submodule: `themes/PaperMod` (creates `.gitmodules`)

**Interfaces:**
- Produces: a buildable Hugo site whose home page renders PaperMod **profile mode** with title "Kyungtae Lee", subtitle, and four nav/profile buttons (Research, Teaching, CV, plus Email/ORCID social icons). Later content tasks add `content/papers/` and `content/teaching/`.

- [ ] **Step 1: Add the PaperMod theme as a submodule**

```bash
cd ~/Documents/CLO_Workspace/personal_website
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive
```

Expected: `themes/PaperMod/theme.toml` exists; `.gitmodules` created.

- [ ] **Step 2: Write `hugo.yml`**

```yaml
baseURL: "https://taelee1085.github.io/"
languageCode: "en-us"
title: "Kyungtae Lee"
theme: "PaperMod"

enableInlineShortcodes: true
enableRobotsTXT: true
pagination:
  pagerSize: 20

taxonomies:
  tag: tags

minify:
  disableXML: true

menu:
  main:
    - name: Research
      url: papers/
      weight: 1
    - name: Teaching
      url: teaching/
      weight: 2
    - name: CV
      url: cv.pdf
      weight: 3

params:
  description: "Kyungtae (Tae) Lee — Ph.D. candidate in Economics at CUNY Graduate Center. Energy and environmental economics, applied econometrics. CV, research, and teaching."
  author: "Kyungtae (Tae) Lee"
  DateFormat: "January 2006"
  defaultTheme: light
  disableThemeToggle: true
  hideFooter: false
  ShowShareButtons: false
  ShowReadingTime: false
  ShowPostNavLinks: false
  ShowBreadCrumbs: false
  ShowCodeCopyButtons: false
  ShowToc: false
  disableScrollToTop: true
  comments: false
  math: true
  profileMode:
    enabled: true
    title: "Kyungtae Lee"
    subtitle: "I am a Ph.D. candidate in Economics at CUNY Graduate Center. My fields are energy and environmental economics, applied econometrics, and development economics."
    imageUrl: "picture.jpeg"
    imageTitle: "Kyungtae Lee"
    imageWidth: 160
    imageHeight: 160
    buttons:
      - name: Research
        url: papers/
      - name: Teaching
        url: teaching/
      - name: CV
        url: cv.pdf
  socialIcons:
    - name: email
      url: "mailto:klee5@gradcenter.cuny.edu"
    - name: orcid
      url: "https://orcid.org/0009-0009-4661-9638"

markup:
  goldmark:
    renderer:
      unsafe: true
```

- [ ] **Step 3: Write `content/_index.md` (home stub)**

```markdown
---
title: "Kyungtae Lee"
---
```

(Profile mode renders from `hugo.yml`; the home stub just anchors the section.)

- [ ] **Step 4: Build to verify it compiles**

Run: `hugo --gc --minify`
Expected: exits 0, prints a page/static summary, no ERROR lines. Creates `public/`.

- [ ] **Step 5: Serve and eyeball (manual check)**

Run: `hugo server -D` then open `http://localhost:1313/`.
Expected: profile-mode home with name, subtitle, and Research/Teaching/CV buttons. The photo is broken until Task 2 (expected). Stop the server (Ctrl-C) when confirmed.

- [ ] **Step 6: Commit**

```bash
git add .gitmodules themes/.gitkeep hugo.yml content/_index.md 2>/dev/null; git add hugo.yml content/_index.md .gitmodules
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Scaffold Hugo site with PaperMod (profile mode home)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

Expected: commit succeeds; `git status` clean except untracked `public/` (gitignored).

---

### Task 2: Reuse existing static assets (photo, favicons, CV/JMP placeholders)

**Files:**
- Create (copy): `static/picture.jpeg`, `static/favicon.ico`, `static/favicon-16x16.png`, `static/favicon-32x32.png`, `static/apple-touch-icon.png`, `static/cv.pdf`, `static/jmp.pdf`

**Interfaces:**
- Produces: `static/picture.jpeg` (resolves the profile image), `static/cv.pdf` (resolves the CV menu/button link), favicons. `cv.pdf`/`jmp.pdf` are placeholders pending user confirmation.

- [ ] **Step 1: Copy assets from the old template**

```bash
cd ~/Documents/CLO_Workspace/personal_website
OLD="old materials/taelee_website/static"
cp "$OLD/picture.jpeg" "$OLD/favicon.ico" "$OLD/favicon-16x16.png" "$OLD/favicon-32x32.png" "$OLD/apple-touch-icon.png" "$OLD/cv.pdf" "$OLD/jmp.pdf" static/
ls -la static/
```

Expected: all 7 files present in `static/`.

- [ ] **Step 2: Rebuild and verify the photo + CV link resolve**

Run: `hugo --gc --minify && hugo server -D` → open `http://localhost:1313/`.
Expected: profile photo now displays; clicking **CV** downloads/opens `cv.pdf`; favicon shows in the tab. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add static/
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Add profile photo, favicons, CV/JMP placeholders to static/

cv.pdf and jmp.pdf are starting placeholders pending user confirmation.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: GitHub Pages deploy workflow (GitHub Actions)

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: on push to `main`, GitHub Actions builds the site with the same Hugo version used locally and publishes to GitHub Pages. Requires the repo to exist with Pages source = "GitHub Actions" (set in Task 10 / by the user).

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.148.1
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Build with Hugo
        env:
          HUGO_ENVIRONMENT: production
        run: hugo --gc --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Validate the workflow YAML locally**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml')); print('YAML OK')"`
Expected: prints `YAML OK` (no exception). Confirms the `HUGO_VERSION` (0.148.1) matches local `hugo version`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Add GitHub Pages deploy workflow (Hugo extended 0.148.1)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: CLAUDE.md — Drawer-2 project rules + dispatch table

**Files:**
- Create: `CLAUDE.md`

**Interfaces:**
- Produces: the project rules Claude loads every session. Referenced by all skills/agents ("rules this skill enforces (from CLAUDE.md)").

- [ ] **Step 1: Write `CLAUDE.md`**

````markdown
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
````

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Add CLAUDE.md project rules and dispatch table

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: WORKFLOW.md — living phased plan + Decision Log

**Files:**
- Create: `WORKFLOW.md`

**Interfaces:**
- Produces: the living plan the team walks one item at a time. Mirrors the spec's Section 6 phases and Section 2 decisions.

- [ ] **Step 1: Write `WORKFLOW.md`**

````markdown
# Personal Academic Website — Workflow

> **Living document.** Revise as the project evolves — update phase status, move items,
> record decisions in the Decision Log. Last updated: 2026-06-29.

## 1. Vision

A personal academic website for the **economics job market**: profile, research (JMP
front and center), teaching, and CV. Hugo + PaperMod, deployed to GitHub Pages at
`https://taelee1085.github.io/`.

## 2. Tech Stack (the benchmark)

| Layer | Choice | Notes |
|-------|--------|-------|
| SSG | Hugo (extended) | Markdown content, fast, academic-friendly |
| Theme | PaperMod (submodule) | Light, responsive, profile mode |
| Config | `hugo.yml` | YAML at repo root |
| Hosting | GitHub Pages + Actions | Push-to-deploy from `taelee1085.github.io` |

## 3. Phased Plan

Status keys: ⬜ todo · 🔄 in progress · ✅ done

### Phase 0 — Scaffold  ⬜
- [ ] Hugo site + PaperMod submodule + `hugo.yml` (profile mode)
- [ ] Reuse static assets (photo, favicons, CV/JMP placeholders)
- [ ] GitHub Pages deploy workflow
- [ ] Drawer 2: `CLAUDE.md`, this `WORKFLOW.md`, recipe skills, reviewer agent
- [ ] Create `taelee1085.github.io` repo, push, enable Pages, confirm live

### Phase 1 — Home / Profile  ⬜
- [ ] Photo + one-line intro + research fields + link buttons (CV, Email, Scholar, ORCID)
- [ ] Confirm subtitle/bio copy with the user

### Phase 2 — Research  ⬜
- [ ] Research list page; JMP highlighted at the top
- [ ] Working papers, then work in progress (publications if any)
- [ ] Each entry: title, authors, year, abstract, PDF/link, status (use `/new-paper`)

### Phase 3 — CV  ⬜
- [ ] Confirm/replace `static/cv.pdf` with the current CV (use `/update-cv`)
- [ ] Prominent CV link from home (web CV version optional)

### Phase 4 — Teaching  ⬜
- [ ] Teaching/TA experience, evaluations, course-material links (use `/new-teaching`)

### Phase 5 — Polish  ⬜
- [ ] SEO/meta, favicon check, responsive + accessibility pass
- [ ] (optional) Custom domain (e.g. `kyungtaelee.com`) via CNAME

## 4. How We Work (dev workflow)

1. Pick the next unchecked item in the current phase.
2. Build it (recipe skill or `brainstorming → writing-plans → build`); user reviews/tests.
3. Run `academic-web-reviewer`; fix CRITICAL/WARNING items.
4. Mark the checkbox ✅ and commit. Keep each phase shippable.
5. Revise this file whenever scope or priorities change.

## 5. Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-06-29 | Hugo + PaperMod, static site | Purpose-built for academic sites; markdown; low maintenance |
| 2026-06-29 | GitHub Pages from user-pages repo `taelee1085.github.io` | Free; clean URL `https://taelee1085.github.io/` (no subpath) |
| 2026-06-29 | Primary goal = job market | Drives content priority: JMP, CV, research first |
| 2026-06-29 | Light theme only, no dark mode | Clean academic look |
| 2026-06-29 | Balanced workflow: CLAUDE.md + WORKFLOW.md + 3 recipe skills + 1 combined reviewer | Right-sized for a static site; one reviewer with academic + web lenses |
| 2026-06-29 | Keep account `TaeLee1085` (no rename/new account); custom domain deferred to Phase 5 | `taelee` username taken; domain is the proper fix later and needs no site change |

## 6. Open Questions

- Is the reused `cv.pdf` / `jmp.pdf` current, or should the user supply new ones? (Phase 2/3)
- Confirm Google Scholar URL to add as a social icon (was commented out in the old config).
- Custom domain — wanted for the job market, or stay on github.io? (Phase 5)
````

- [ ] **Step 2: Commit**

```bash
git add WORKFLOW.md
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Add WORKFLOW.md living phased plan and Decision Log

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: `/new-paper` recipe skill

**Files:**
- Create: `.claude/skills/new-paper/SKILL.md`

**Interfaces:**
- Produces: a skill that adds one paper to `content/papers/` with correct front matter and ordering (JMP first). Consumes the conventions in `CLAUDE.md`.

- [ ] **Step 1: Write `.claude/skills/new-paper/SKILL.md`**

````markdown
---
name: new-paper
description: Add one research paper (job market paper, working paper, work in progress, or publication) to the Research section of the personal academic website, with correct front matter, ordering, and links. Use when the user wants to add or update a paper on the site.
---

# New Paper — Research Entry Recipe

Adds one paper to the Research section the same way every time, enforcing this project's
rules (see `CLAUDE.md`).

## Rules this skill always enforces (from CLAUDE.md)

- **Academic accuracy first.** Never invent the title, coauthors, year, venue, or links.
  Use only what the user provides/confirms. If a field is unknown, ask — do not guess.
- **JMP front and center.** A job market paper sorts to the top of Research.
- **No broken links.** If a PDF/link isn't ready, omit it rather than ship a dead link.
- Light theme, mobile-responsive, site must still build (`hugo --gc --minify`).

## Inputs (ask for any not given, one at a time)

1. **Title** (exact).
2. **Authors** (order as they should appear; mark the user if coauthored).
3. **Year** (or "in progress").
4. **Status** — one of: `jmp` (job market paper), `working` (working paper),
   `wip` (work in progress), `published` (with venue).
5. **Venue** (only if `published`).
6. **Abstract** (optional but recommended).
7. **PDF** — a file the user provides (placed in `static/papers/`) or an external URL.
   Omit if not ready.

## Steps

1. If the Research section doesn't exist yet, create `content/papers/_index.md`:

   ```markdown
   ---
   title: "Research"
   ---
   ```

2. Choose a slug: `content/papers/<year>-<short-title>.md` (e.g. `2026-energy-prices.md`).
   If status is `wip`/no year, use `content/papers/<short-title>.md`.

3. If a PDF file was provided, place it at `static/papers/<slug>.pdf` and link it as
   `/papers/<slug>.pdf`. For an external URL, use it directly.

4. Write the entry file. Use `weight` for ordering: JMP = `1`, working = `10`,
   wip = `20`, published = `30` (lower = higher on the page). Front matter:

   ```markdown
   ---
   title: "<title>"
   date: <year>-01-01
   weight: <by status>
   params:
     authors: "<authors>"
     status: "<jmp|working|wip|published>"
     venue: "<venue, if published>"
     pdf: "/papers/<slug>.pdf"   # or external URL; omit if none
   ---

   <abstract, if provided>
   ```

5. If status is `jmp`, ensure the home/Research framing labels it "Job Market Paper".

6. Build to verify: `hugo --gc --minify` → exits 0, no broken-ref warnings.

7. Run the `academic-web-reviewer` agent on the change; fix CRITICAL/WARNING items.

8. Show the user the rendered entry (`hugo server -D`) and commit once approved.

## Notes

- This skill is intentionally small. For a redesign of how Research renders (custom
  layout), use `brainstorming → writing-plans` instead.
````

- [ ] **Step 2: Validate the SKILL.md front matter parses**

Run: `python3 -c "import yaml; s=open('.claude/skills/new-paper/SKILL.md').read().split('---')[1]; d=yaml.safe_load(s); assert d['name']=='new-paper' and d['description']; print('OK')"`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/new-paper/SKILL.md
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Add /new-paper recipe skill

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: `/new-teaching` recipe skill

**Files:**
- Create: `.claude/skills/new-teaching/SKILL.md`

**Interfaces:**
- Produces: a skill that adds one teaching/TA entry to `content/teaching/`.

- [ ] **Step 1: Write `.claude/skills/new-teaching/SKILL.md`**

````markdown
---
name: new-teaching
description: Add one teaching or TA entry (course, role, term, institution, evaluations, materials link) to the Teaching section of the personal academic website. Use when the user wants to add or update a teaching record.
---

# New Teaching — Teaching Entry Recipe

Adds one teaching/TA record to the Teaching section, enforcing this project's rules
(see `CLAUDE.md`).

## Rules this skill always enforces (from CLAUDE.md)

- **Academic accuracy first.** Never invent course titles, terms, institutions, or
  evaluation numbers. Use only what the user confirms; ask if unknown.
- **No broken links.** Omit a materials/evaluations link rather than ship a dead one.
- Light theme, mobile-responsive, site must still build (`hugo --gc --minify`).

## Inputs (ask for any not given, one at a time)

1. **Course title** (exact).
2. **Role** — e.g. Instructor, Teaching Assistant.
3. **Institution**.
4. **Term(s)** — e.g. "Fall 2025".
5. **Evaluation** (optional) — a number/summary the user provides.
6. **Materials link** (optional) — URL or a file placed in `static/teaching/`.

## Steps

1. If the Teaching section doesn't exist, create `content/teaching/_index.md`:

   ```markdown
   ---
   title: "Teaching"
   ---
   ```

2. Slug: `content/teaching/<term>-<short-course>.md` (e.g. `2025-fall-intro-micro.md`).

3. Write the entry. Order newest first via `date` (most recent term = newest date):

   ```markdown
   ---
   title: "<course title>"
   date: <YYYY>-<MM>-01
   params:
     role: "<role>"
     institution: "<institution>"
     term: "<term>"
     evaluation: "<eval, if provided>"
     materials: "<URL or /teaching/<file>; omit if none>"
   ---
   ```

4. Build to verify: `hugo --gc --minify` → exits 0.

5. Run the `academic-web-reviewer` agent; fix CRITICAL/WARNING items.

6. Show the rendered entry and commit once approved.
````

- [ ] **Step 2: Validate the SKILL.md front matter parses**

Run: `python3 -c "import yaml; s=open('.claude/skills/new-teaching/SKILL.md').read().split('---')[1]; d=yaml.safe_load(s); assert d['name']=='new-teaching' and d['description']; print('OK')"`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/new-teaching/SKILL.md
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Add /new-teaching recipe skill

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: `/update-cv` recipe skill

**Files:**
- Create: `.claude/skills/update-cv/SKILL.md`

**Interfaces:**
- Produces: a skill that replaces `static/cv.pdf` and confirms the CV link/date are current.

- [ ] **Step 1: Write `.claude/skills/update-cv/SKILL.md`**

````markdown
---
name: update-cv
description: Replace the CV PDF on the personal academic website with a new version and confirm the CV link is current and reachable from the home page. Use when the user has an updated CV to publish.
---

# Update CV — CV Refresh Recipe

Swaps in a new CV PDF and verifies it's correctly linked, enforcing this project's rules
(see `CLAUDE.md`).

## Rules this skill always enforces (from CLAUDE.md)

- **Job-market convention:** the CV PDF is always current and reachable in one click from
  the home page.
- **No broken links.** Verify the CV link resolves after the swap.
- Site must still build (`hugo --gc --minify`).

## Inputs

1. The **new CV file** — the user provides a path to the updated PDF.

## Steps

1. Copy the user's new PDF to `static/cv.pdf` (overwrite). Keep the filename `cv.pdf` so
   existing links (`hugo.yml` menu + profile button → `cv.pdf`) stay valid.

   ```bash
   cp "<user's new cv path>" static/cv.pdf
   ```

2. Confirm the home page links to it: `hugo.yml` `menu.main` CV entry and the profile
   `buttons` CV entry both point to `cv.pdf`. If missing, add them.

3. Build to verify: `hugo --gc --minify` → exits 0.

4. Serve (`hugo server -D`), open the home page, click **CV**, confirm the new PDF opens.

5. Run the `academic-web-reviewer` agent (link-validity + currency lens).

6. Commit once approved:

   ```bash
   git add static/cv.pdf
   git commit -m "Update CV PDF"
   ```
````

- [ ] **Step 2: Validate the SKILL.md front matter parses**

Run: `python3 -c "import yaml; s=open('.claude/skills/update-cv/SKILL.md').read().split('---')[1]; d=yaml.safe_load(s); assert d['name']=='update-cv' and d['description']; print('OK')"`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/update-cv/SKILL.md
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Add /update-cv recipe skill

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: `academic-web-reviewer` agent

**Files:**
- Create: `.claude/agents/academic-web-reviewer.md`

**Interfaces:**
- Produces: a report-only reviewer agent invoked after content/build changes. Referenced by the dispatch table and every recipe skill.

- [ ] **Step 1: Write `.claude/agents/academic-web-reviewer.md`**

````markdown
---
name: academic-web-reviewer
description: Reviews the personal academic website after content or build changes for academic/job-market conventions AND web quality. Report-only — it never edits. Use after adding a paper/teaching entry, updating the CV, or changing any page/layout/styling.
tools: Read, Grep, Glob, Bash
---

# Academic Web Reviewer

You review the personal academic website of Kyungtae (Tae) Lee (Hugo + PaperMod, for the
economics job market). You **report findings only — you never edit files.** The main
session applies fixes.

## Before you review — read context

1. Read `CLAUDE.md` (hard rules) and `WORKFLOW.md` (current phase) so your review fits.
2. Identify what changed (the session will tell you, or check `git status` / `git diff`).

## Two lenses

Review through both lenses and label each finding by severity:
**CRITICAL** (must fix before shipping), **WARNING** (should fix), **NOTE** (optional).

### Academic / job-market lens

- **JMP prominence:** if a job market paper exists, is it surfaced at the top of Research
  and clearly labeled "Job Market Paper"?
- **CV currency & reach:** is the CV reachable in one click from the home page and is the
  link valid (`static/cv.pdf` exists)?
- **No fabrication signals:** flag any paper/teaching field that looks like a placeholder
  or guess (e.g. "TBD", lorem text, a year that contradicts the content).
- **Link validity:** check internal links resolve and external links are well-formed
  (flag obviously dead/placeholder URLs).
- **Tone/notation consistency:** author-name format, capitalization, date format
  consistent across entries.

### Web lens

- **Light theme:** no dark-mode styles introduced; `defaultTheme: light` /
  `disableThemeToggle: true` intact.
- **Build health:** run `hugo --gc --minify` — it must exit 0 with no ERROR/ref-not-found.
- **Responsiveness:** no fixed-width layouts or overflow that would break on a phone.
- **Accessibility:** images have alt text; heading levels are ordered (one h1, then h2…);
  link text is descriptive.
- **Metadata:** page has a title and description; the profile image resolves.

## Output format

Report grouped by severity:

```
## CRITICAL
- [academic|web] <file:line> — <issue> → <suggested fix>

## WARNING
- ...

## NOTE
- ...

## Build
- `hugo --gc --minify`: <PASS/FAIL + key output>
```

If nothing is found in a lens, say so explicitly. Do not edit any file.
````

- [ ] **Step 2: Validate the agent front matter parses**

Run: `python3 -c "import yaml; s=open('.claude/agents/academic-web-reviewer.md').read().split('---')[1]; d=yaml.safe_load(s); assert d['name']=='academic-web-reviewer' and d['tools']; print('OK')"`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/academic-web-reviewer.md
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Add academic-web-reviewer agent

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Create GitHub repo, push, enable Pages, confirm live

**Files:** none (infrastructure).

**Interfaces:**
- Consumes: the committed site + workflow from Tasks 1–9.
- Produces: a live site at `https://taelee1085.github.io/`.

> **User action required:** `gh` is installed but not logged in, and repo creation needs
> the user's GitHub account. If `gh auth status` fails, ask the user to run
> `! gh auth login` (or create the repo on github.com) before this task.

- [ ] **Step 1: Confirm auth**

Run: `gh auth status`
Expected: logged in as `TaeLee1085`. If not, stop and ask the user to `gh auth login`.

- [ ] **Step 2: Create the user-pages repo and push**

```bash
cd ~/Documents/CLO_Workspace/personal_website
git branch -M main
gh repo create taelee1085.github.io --public --source=. --remote=origin --push
```

Expected: repo `TaeLee1085/taelee1085.github.io` created; `main` pushed.

- [ ] **Step 3: Set Pages source to GitHub Actions**

```bash
gh api -X POST repos/TaeLee1085/taelee1085.github.io/pages -f build_type=workflow 2>/dev/null \
  || gh api -X PUT repos/TaeLee1085/taelee1085.github.io/pages -f build_type=workflow
```

Expected: Pages enabled with `build_type: workflow`. (If the API call is finicky, set it
in the repo's Settings → Pages → "Build and deployment" → Source = GitHub Actions.)

- [ ] **Step 4: Watch the deploy**

Run: `gh run watch` (or `gh run list`)
Expected: the "Deploy Hugo site to Pages" workflow completes successfully.

- [ ] **Step 5: Confirm live (manual)**

Open `https://taelee1085.github.io/`.
Expected: profile-mode home with photo, subtitle, and Research/Teaching/CV buttons; CV
button opens the PDF; no console 404s for the photo/favicon.

- [ ] **Step 6: Mark Phase 0 done in WORKFLOW.md**

Edit `WORKFLOW.md` Phase 0 checkboxes to ✅, then commit:

```bash
git add WORKFLOW.md
git -c user.name="Kyungtae Lee" -c user.email="taelee1080@gmail.com" commit -m "Mark Phase 0 (scaffold) complete — site live on GitHub Pages

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push
```

---

## Self-Review

**Spec coverage:**
- Repo structure (spec §4) → Tasks 1–9 create every listed file. ✓
- Two-drawer model (spec §3) → CLAUDE.md "How we work" + "Two drawers" (Task 4). ✓
- CLAUDE.md rules (spec §5) → Task 4 verbatim. ✓
- WORKFLOW.md phased plan + Decision Log (spec §6) → Task 5. ✓
- 3 recipe skills (spec §7) → Tasks 6–8. ✓
- 1 combined reviewer agent (spec §7) → Task 9. ✓
- Dispatch table (spec §8) → Task 4. ✓
- Hosting/GitHub Pages (spec §2) → Tasks 3 + 10. ✓
- Success criteria (spec §10): four-section site builds + deploys (Tasks 1–3,10), JMP/CV one-click (Task 4 rules + Task 2 CV link), `/new-paper` single invocation (Task 6), reviewer clean before "done" (Task 9 + dispatch). Content sections themselves (Research/Teaching pages with entries) are **deferred to later content plans** that use these recipes — Phase 0 ships the empty-but-live shell, by design (spec §1, §6 phases). ✓

**Placeholder scan:** No "TBD"/"implement later"/vague-handling steps. `cv.pdf`/`jmp.pdf` are explicitly labeled reused placeholders (Global Constraints), not plan placeholders.

**Type/name consistency:** Skill names (`new-paper`, `new-teaching`, `update-cv`), agent name (`academic-web-reviewer`), config file (`hugo.yml`), baseURL (`https://taelee1085.github.io/`), repo (`taelee1085.github.io`), and the `weight` ordering convention (JMP=1) are used identically across CLAUDE.md, WORKFLOW.md, the skills, the agent, and the dispatch table.

**Scope note:** This plan is Workflow Architecture + Phase 0 only. Content Phases 1–5 become their own short plans / recipe invocations once the user supplies real content (papers, CV, teaching). This keeps each plan independently shippable.
