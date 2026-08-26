# Personal Academic Website — Workflow

> **Living document.** Revise as the project evolves — update phase status, move items,
> record decisions in the Decision Log. Last updated: 2026-08-26.

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

### Phase 1 — Home / Profile  ✅
- [x] Photo + bio + research-field sentence + link buttons (Research, Teaching, CV)
- [x] Icons: email, ORCID (Google Scholar icon declined by the user — see Decision Log)

### Phase 2 — Research  ✅
- [x] Research list page at `/research/`; JMP in its own group at the top
- [x] Four groups in order: Job Market Paper → Publications → Working Papers → Work in
  Progress; six papers total (use `/new-paper` for future additions)
- [x] Each entry: title (linked or plain), coauthors, venue/year, abstract, presentations —
  all conditional, nothing empty rendered

### Phase 3 — CV  ✅
- [x] `static/kyungtae-lee-cv.pdf` is current (August 2026) (use `/update-cv` for updates)
- [x] CV linked from the nav and as a one-click home-page button

### Phase 4 — Teaching  ✅
- [x] Teaching page at `/teaching/`, grouped by institution, most recent first; nine
  entries across six institutions (use `/new-teaching` for future additions)
- [x] Evaluation scores deliberately omitted (D7); no materials links yet

### Phase 5 — Polish  ⬜
- [ ] SEO/meta, favicon check, responsive + accessibility pass
- [ ] Register site in Google Search Console + submit `sitemap.xml` (get it on Google)
- [ ] Design pass (accent color / fonts / layout — currently stock PaperMod)
- [ ] (optional) Custom domain (e.g. `kyungtaelee.com`) via CNAME
- [ ] A responsive/visual pass at 375px was never performed — the sandbox used to build
  this branch could bind neither a dev-server port nor open `file://` pages, so mobile
  rendering remains unverified. Do this on a real device after deploy.
- [ ] Full bio rewrite (see Open Questions — the subtitle wording was updated to match
  the owner's Google Sites "About me" text, but a complete rewrite is still pending)
- [x] The empty `/tags/` page no longer enters `sitemap.xml`. Fixed 2026-08-26 by adding
  `disableKinds: ["taxonomy", "term", "rss"]` to `hugo.yml`; a clean rebuild now emits
  6 pages instead of 9, no `public/tags/`, and a sitemap of exactly `/`, `/research/`,
  `/teaching/`. **Do not** "fix" this instead by deleting the `taxonomies:` block — that
  restores Hugo's default taxonomies (tag *and* category) and adds an empty
  `/categories/` page on top of `/tags/`, which is worse.

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
| 2026-08-19 | Research lives at **`/research/`**, not `/papers/` | Matches the nav label; permanent once the URL is circulated, so chosen deliberately now |
| 2026-08-19 | Teaching evaluations are **not published** | The one 5.00/5.00 score came from a single respondent, so the number is not meaningful and invites awkward questions; course history still ships |
| 2026-08-19 | `private-manuscripts/` holds unreleased coauthored work, stays git-ignored | `External_Validity_in_Practice_20260819.pdf` (WIP source) must never enter the build or git history; verified clean at Task 7 |
| 2026-08-19 | `/kyungtae-lee-cv.pdf`, `/kyungtae-lee-jmp.pdf`, and `/from-one-late-to-another-poster.pdf` are permanent URLs | Already circulated (CV link, JMP link, poster link); once shared they must never be renamed |

## 6. Open Questions

- **Bio/subtitle text** was updated in this branch (`hugo.yml` `profileMode.subtitle`:
  "My fields are…" → "My primary fields of interest are…") so the wording now matches
  the owner's Google Sites "About me" text; a full rewrite of the bio is still pending
  and remains outstanding.
- **Photo + CV PDF**: supplied and live — `assets/profile.jpg` (cropped/downscaled square;
  lives in `assets/`, not `static/`, because `hugo.yml`'s `profileMode.imageUrl` resolves
  through PaperMod's `resources.Get`, which reads from the assets pipeline that does the
  resizing — do not move it to `static/`) and `static/kyungtae-lee-cv.pdf` (August 2026). ✓
- **Email** `klee5@gradcenter.cuny.edu` — carried over from old config; matches the email
  in the JMP PDF footer, but has not been explicitly reconfirmed by the user as current.
- **ORCID** `0009-0009-4661-9638` — confirmed correct by user 2026-06-29. ✓
- **Google Scholar icon** — declined by the user (2026-08-19); not added.
- **Job-market-cycle statement** on the home page — declined by the user (2026-08-19); not
  added.
- **The abstract for "From One LATE to Another"** — outstanding; the user will add it after
  the paper is finalised in September 2026 (title, coauthor, and presentations ship now;
  see D10 in the design spec).
- Custom domain — wanted for the job market, or stay on github.io? (Phase 5)
