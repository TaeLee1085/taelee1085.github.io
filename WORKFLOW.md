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

### Phase 0 — Scaffold  ✅
- [x] Hugo site + PaperMod submodule + `hugo.yml` (profile mode)
- [x] Static assets: favicons kept; old photo/CV/JMP removed as outdated (2026-06-29)
- [x] GitHub Pages deploy workflow
- [x] Drawer 2: `CLAUDE.md`, this `WORKFLOW.md`, recipe skills, reviewer agent
- [x] Create `taelee1085.github.io` repo, push, enable Pages, confirm live —
  live at https://taelee1085.github.io/ (Pages build type = GitHub Actions)

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
- [ ] Register site in Google Search Console + submit `sitemap.xml` (get it on Google)
- [ ] Design pass (accent color / fonts / layout — currently stock PaperMod)
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

- **Bio/subtitle text** is still the OLD copy ("Ph.D. candidate … energy/environmental,
  applied econometrics, development") — user wants to rewrite it later (Phase 1).
- **Photo + CV PDF**: old ones were removed as outdated; user to supply current files
  (photo → profile `imageUrl`; CV → `/update-cv`, which re-adds the CV menu/button).
- **Email** `klee5@gradcenter.cuny.edu` — carried over from old config; confirm it's current.
- **ORCID** `0009-0009-4661-9638` — confirmed correct by user 2026-06-29. ✓
- Google Scholar URL to add as a social icon (was commented out in the old config).
- Custom domain — wanted for the job market, or stay on github.io? (Phase 5)
