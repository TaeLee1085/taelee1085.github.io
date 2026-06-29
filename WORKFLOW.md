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

### Phase 0 — Scaffold  🔄
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
- The reused `static/jmp.pdf` is a placeholder; when the job market paper is added via `/new-paper`, use it as the starting source (or replace it) and place the final PDF under `static/papers/`.
