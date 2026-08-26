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
- [x] SEO/meta audited 2026-08-26 — the built `<head>` carries description, author,
  canonical, `robots: index, follow`, OpenGraph and Twitter-card tags, all four favicon
  sizes, and `robots.txt` points at `sitemap.xml`. No `og:image` is emitted, so link
  previews on Slack/X show no thumbnail; fold that into the design pass if wanted.
- [ ] favicon: the current icon is a **plain rounded square with no mark** (no initials,
  nothing identifying). Deferred to the design pass by the user on 2026-08-26.
- [ ] `/safari-pinned-tab.svg` is referenced by PaperMod's stock `head.html` on every
  page but the file does not exist, so every page fires one 404. Verified 2026-08-26 as
  the site's **only** broken internal reference. Deferred to the design pass; fix by
  adding the SVG (not by forking `head.html`, which would mean maintaining a theme copy).
- [ ] responsive + accessibility pass
- [ ] **Get the site on Google.** Audited 2026-08-26, the day it went live. Findings:
  - `site:taelee1085.github.io` returns **nothing** — not indexed yet. Expected for a
    hours-old site; nothing is blocking it. Live `robots.txt` allows all crawlers and
    points at `sitemap.xml`; every page carries `robots: index, follow`.
  - **An outdated Google Sites page ranks first** for "Kyungtae Lee economics CUNY":
    `https://sites.google.com/view/taelee/home`, titled "Kyungtae (Tae) Lee's personal
    website", with Home/CV/Research/Teaching tabs. It has **no job market paper**, no
    paper links, and no link here. So a search committee googling the owner today lands
    on a JMP-less page while this site is invisible. Two competing personal sites also
    split ranking signals. Decide: replace its content with an "I've moved →" pointer
    (safest — old circulated links still funnel here), or delete it. Owner's Google
    account, so the owner must do it.
  - **Google Search Console** is the actual accelerator (not Analytics — Analytics has
    zero effect on indexing). PaperMod already supports verification: put the code in
    `params.analytics.google.SiteVerificationTag` and it emits the `<meta>` tag. Owner
    fetches the code from Search Console, then we add it and submit the sitemap.
  - **Google Analytics** is optional and purely for measurement. Hugo has it built in via
    `services.googleAnalytics.ID` (the `google_analytics.html` partial is Hugo's own, not
    PaperMod's); `privacy.googleAnalytics` holds the privacy knobs. One line if wanted.
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
| 2026-08-26 | Deployed with the **current** CV rather than waiting for the user's three CV corrections | The three circulated PDF URLs (CV, JMP, poster) were verified returning **404 on the live site** — the links already in circulation were broken right then. Shipping today fixes all three; the CV's three known errors (stale paper title in Conference Presentations, "365 Fifth AVenue", the Quantitative Methods for Economics teaching-field line) get overwritten at the same URL later via `/update-cv`. |
| 2026-08-26 | favicon left as the stock plain rounded square; `/safari-pinned-tab.svg` 404 left in place | Both are cosmetic and belong to the Phase 5 design pass, where the accent color and any "KL" monogram get decided together rather than piecemeal. The missing mask-icon only affects Safari pinned tabs. |
| 2026-08-26 | Home-page heading and photo alt read **"Kyungtae (Tae) Lee"**; the nav logo, browser tab, and `<title>` stay **"Kyungtae Lee"** | Tae is the owner's everyday nickname, so the hero is where a first-time visitor should learn what to call them. The CV PDF's header is plain "Kyungtae Lee", and the nav logo doubles as the tab title on every page, so those stay matched to the CV. Only `profileMode.title` and `profileMode.imageTitle` changed — **do not** also change `hugo.yml`'s top-level `title:` or `content/_index.md`'s `title:`, which is what would leak the nickname into the tab and every page's header. |

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
