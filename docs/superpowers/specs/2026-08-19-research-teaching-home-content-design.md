# Design — Research, Teaching, and Home content (Phases 1–4)

Date: 2026-08-19
Status: awaiting user review

## 1. Purpose

Fill the site with real content. Today `content/` holds only `_index.md`; the site is live
but empty. This design covers the Home profile, the Research section, the Teaching section,
and the CV link — i.e. `WORKFLOW.md` Phases 1 through 4 in one pass.

## 2. Where the content comes from

Two sources, with a clear precedence rule.

| Source | What it gives | Authority |
|---|---|---|
| `https://sites.google.com/view/taelee/` | Page structure, long abstracts for 4 papers, teaching list | Superseded where it conflicts |
| `static/CV Tae Lee.pdf` ("Updated: August 2026") | Current teaching, presentations, venues | **Wins on conflict** |
| `static/JMP Tae Lee.pdf` (December 2025) | The JMP abstract | **Wins for the JMP abstract** |
| `private-manuscripts/External_Validity_in_Practice_20260819.pdf` (August 19, 2026) | Confirms the WIP title and author order | Not published |

Verbatim extractions are kept in the session scratchpad (`google-sites-source.md`,
`cv-source-2026-08.md`). Nothing on the site is written from memory or inference.

### Conflicts found and how they are resolved

1. **JMP abstract.** The Google Sites abstract reports "2.5 more hours and 25 more days" for
   men; the December 2025 PDF reports "about 20 additional days" for men and "about 20 fewer
   days" for women, and adds the identification strategy (average land slope as an
   instrument). The user confirmed the PDF is current and the site text was a compression of
   it. **The PDF abstract ships verbatim.**
2. **WIP paper title.** The CV lists it twice under different names. The user confirmed, and
   the manuscript title page agrees: **"From One LATE to Another: Machine Learning and the
   External Validity of IV Estimates"**. Authors on the manuscript are Alexander Kwon then
   Kyungtae Lee.
3. **Teaching.** The CV adds Brooklyn College (two courses, Spring 2026) and extends Baruch
   to Spring 2026. **The CV list ships.**
4. **Abstracts for the two publications and two working papers** are taken verbatim from the
   user's own Google Sites, which carry fuller text than the CV's compressed variants. These
   have *not* been checked against the journals' published abstracts — flagged for the user.

## 3. Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | Research lives at **`/research/`**, not `/papers/` | Matches the nav label. Permanent once the URL is circulated, so chosen deliberately now. |
| D2 | One page lists all papers; **no per-paper pages yet** | User's call. Of 25 economics job-market sites sampled, 0 used per-paper pages. Detail pages are deferred, not rejected. |
| D3 | **Full abstracts inline** | 17 of 25 sampled sites do this. The JMP abstract is ~230 words — normal length. Easy to shorten later. |
| D4 | Paper **titles are the hyperlink**: JMP → hosted PDF, working → SSRN, published → journal/DOI | User's specification. |
| D5 | Papers with no link render as **plain text titles** | No dead links, no "coming soon". Applies to *Carbon Pricing* and *From One LATE*. |
| D6 | **Conference presentations shown per paper** | Deliberate deviation: ~85% of sampled sites keep these in the CV only. User asked for them, and the USAEE Top-4 finalist note is a genuine signal. |
| D7 | **Teaching evaluations are NOT published** | The 5.00/5.00 came from a single respondent, so the number is not meaningful and invites awkward questions. Course history still ships. |
| D8 | **No Google Scholar icon** | User's call. |
| D9 | **No job-market-cycle statement** on the home page | User's call. |
| D10 | *From One LATE* ships with **title, coauthor, presentations, and the conference poster** — no abstract, title unlinked | Manuscript is not cleared for release; the coauthor is first author. The user supplied the poster for publication, so it is hosted in the repo and linked from the presentation line. The abstract follows once the paper is finalised in September 2026. |
| D11 | Group order is **JMP → Publications → Working Papers → Work in Progress** | The convention in every sampled site that had all four. |
| D12 | Author lines **omit the user's own name**: "with Alexander Kwon" | Convention. Full author lists belong in formal citations only. |
| D13 | **Coauthor names are not hyperlinked** | Linking is all-or-nothing; the two coauthors on *Carbon Pricing* have no confirmed URLs, so nobody is linked. Revisit if the user supplies all URLs. |
| D14 | PDFs are **hosted in the repo**, not linked to Google Drive | The AEA job-market guide warns that Drive links can deny access to anyone not logged into Google. |
| D15 | The **CV is a direct PDF link** in the nav and as a home button — no CV page | `CLAUDE.md` requires one-click CV access from home. The Google Sites CV page was only an embedded viewer. |

## 4. Files and URLs

```
/                       Home (PaperMod profile mode)
/research/              Research — all six papers, grouped
/teaching/              Teaching — nine entries, grouped by institution
/kyungtae-lee-cv.pdf    CV (direct download, linked from nav + home button)
/kyungtae-lee-jmp.pdf   Job market paper (linked from the JMP title)
```

### Asset renames

| Now | Becomes | Why |
|---|---|---|
| `static/CV Tae Lee.pdf` | `static/kyungtae-lee-cv.pdf` | Spaces become `%20` in URLs |
| `static/JMP Tae Lee.pdf` | `static/kyungtae-lee-jmp.pdf` | Same |
| `static/From One LATE to Another … _poster.pdf` | `static/from-one-late-to-another-poster.pdf` | Same |
| `static/head_shot.JPG` | `static/profile.jpg` | Cropped square and downscaled (see §7) |

`private-manuscripts/` is already in `.gitignore` and stays out of the build.

## 5. Page content

### 5.1 Home

PaperMod profile mode. Photo, name, three-sentence bio (unchanged from the current site —
the user has not rewritten it yet), three buttons, two social icons.

> **Kyungtae Lee**
>
> I am a Ph.D. candidate in Economics at CUNY Graduate Center. My primary fields of interest
> are energy and environmental economics. I am also interested in applied econometrics and
> development economics.
>
> [Research] [Teaching] [CV]
>
> icons: email · ORCID

Nav: Research · Teaching · CV.

### 5.2 Research

Four groups. A group with no entries renders nothing at all (no empty heading).

**Job Market Paper**

- Title (links to `/kyungtae-lee-jmp.pdf`): *Clean Energy Access and Home Production
  Improvement: Labor Supply and Gender Difference*
- Abstract: the December 2025 PDF abstract, verbatim.
- Presented at: IAEE session, 2026 ASSA Conference · 2025 USAEE/IAEE North American
  Conference (Top 4 Finalist, Dennis J. O'Brien Best Student Paper Award)

**Publications**

- *External Validity in an Instrumental Variable Setting* → `https://doi.org/10.1177/0193841X251342619`
  with Alexander Kwon · *Evaluation Review*, 2025
  Presented at: 2025 ASSA Conference (Lightning Session)
- *Geographical Factors Influencing Household Cookstove Choices in Nepal* →
  `https://www.sciencedirect.com/science/article/pii/S2590291124004509`
  with Alexander Kwon · *Social Sciences & Humanities Open*, 2025

**Working Papers**

- *Carbon Pricing and Heterogeneous Abatement Responses: Evidence from Seven U.S. Cities*
  (no link) — with Maggie Rong Hu and Jun Yoo
- *The Role of Accessibility in the Adoption of Clean Energy Stoves* →
  `https://dx.doi.org/10.2139/ssrn.5314869`

**Work in Progress**

- *From One LATE to Another: Machine Learning and the External Validity of IV Estimates*
  (title unlinked — the manuscript is not public; no abstract yet) — with Alexander Kwon
  Presented at: 2026 Africa Meeting of the Econometric Society (accepted) ·
  2026 ASSA Conference ([poster](/from-one-late-to-another-poster.pdf))

  The poster is the only public artifact for this paper. It is hosted in the repo, not on
  Google Drive, and the word "poster" in the presentation line is the link.

Each entry renders as: title (linked or plain) → author/venue meta line → abstract →
"Presented at" line. Every element is conditional; nothing empty is emitted.

### 5.3 Teaching

Grouped by institution, most recent first. No evaluations, no materials links.

| Institution | Entries |
|---|---|
| Brooklyn College | Adjunct Instructor, Financial Economics — Spring 2026<br>Adjunct Instructor, Intro Business Statistics — Spring 2026 |
| Baruch College | Adjunct Instructor, Introduction to Microeconomics — Spring 2025–Spring 2026 |
| The City College of New York | Teaching Assistant, Principles of Microeconomics — Fall 2025<br>Adjunct Instructor, Principles of Statistics — Spring 2025<br>Adjunct Instructor, Intermediate Macroeconomics — Spring 2022–Spring 2023, Summer 2025 |
| The Graduate Center, CUNY | Teaching Assistant, Math for Economists (Ph.D. program) — Fall 2022 |
| Hunter College | Instructor, Math Camp (M.A. program) — Summer 2022 |
| New York University | Teaching Assistant, Mathematics for Economists (M.A. program) — Fall 2021 |

Nine entries total.

## 6. Technical design

### 6.1 Content model

One Markdown file per paper. Structured front matter drives rendering; the abstract is the
page body so it stays real Markdown.

```yaml
---
title: "External Validity in an Instrumental Variable Setting"
weight: 10                    # top-level; orders WITHIN a group only
params:
  status: published           # jmp | published | working | wip
  year: 2025
  coauthors: ["Alexander Kwon"]
  venue: "Evaluation Review"
  link: "https://doi.org/10.1177/0193841X251342619"   # title href; omit if none
  presentations:
    - "2025 ASSA Conference (Lightning Session)"
---

We study external validity within the context of instrumental variable estimation. …
```

Teaching entries use `params: role, course, institution, terms`.

Group order is an **explicit ordered slice in the template**, not `weight`. This removes the
existing `/new-paper` weight bug (`published: 30` sorts below `wip: 20`, which would push both
journal articles to the bottom of the page) rather than merely renumbering around it: a paper
with a wrong or missing weight can no longer change which group it lands in.

**Order within a group is `weight` ascending only.** `year` is displayed but is never a sort
key — two of the papers have no year at all, and missing sort keys silently sink entries to the
bottom. The intended order, matching the user's existing site:

| Group | Order | `weight` |
|---|---|---|
| Job Market Paper | Clean Energy Access and Home Production Improvement | 10 |
| Publications | External Validity in an Instrumental Variable Setting | 10 |
| | Geographical Factors Influencing Household Cookstove Choices in Nepal | 20 |
| Working Papers | Carbon Pricing and Heterogeneous Abatement Responses | 10 |
| | The Role of Accessibility in the Adoption of Clean Energy Stoves | 20 |
| Work in Progress | From One LATE to Another | 10 |

The job market paper appears **once**, under its own heading. It is not repeated under Working
Papers and carries no "(Job Market Paper)" tag — sampled sites use one treatment or the other,
never both.

### 6.2 Templates

- `layouts/research/list.html` — the Research page.
- `layouts/teaching/list.html` — the Teaching page.
- `assets/css/extended/zz-site.css` — link chips, heading sizes, `.sr-only`.

Never `layouts/list.html` or `layouts/_default/list.html`: both are lower priority *and* would
replace the theme's list template for the home page, silently killing profile mode.

The templates do not reuse PaperMod's `.post-entry` card. That card ends with an empty
`<a class="entry-link">` absolutely positioned over the whole card, which would make every
link inside it unclickable.

### 6.3 Suppressing per-paper pages

`content/research/_index.md` carries:

```yaml
outputs: ["html"]
cascade:
  - _target: {kind: page}
    build: {render: never, list: local}
```

Three verified subtleties, none of which fail the build loudly:
- the cascade **must** be scoped with `_target: {kind: page}`; unscoped it deletes
  `/research/index.html` too;
- `render: never` alone does **not** remove pages from collections in Hugo 0.148.1 despite the
  docs — `list: local` is required;
- without `outputs: ["html"]` Hugo still emits `research/index.xml`, an RSS feed whose items
  all have empty `<link/>`.

### 6.4 Accessibility and mobile

- Outside `.md-content`, PaperMod renders links in the same colour as body text with no
  underline. The link row therefore needs explicit chip styling — otherwise links are
  invisible as links (WCAG 1.4.1, no colour cue at all).
- Heading outline: `h1` page title → `h2` group heading → `h3` paper title. Demoting titles to
  `h3` loses PaperMod's `.entry-header h2 {font-size:24px}`, so the size is re-declared.
- Any mobile override in extended CSS must sit inside its own `@media` block; extended CSS is
  concatenated *after* the theme's media queries and would otherwise win at every width.
- Long titles and abstracts are checked at 375px.

### 6.5 Recipe skill updates

`.claude/skills/new-paper/SKILL.md` currently hardcodes `content/papers/`, an `authors` string,
and the inverted weight numbers. It is rewritten to match this design: `content/research/`,
`coauthors` list, `link`, `presentations`, `year`, and weight documented as within-group only.
`.claude/skills/new-teaching/SKILL.md` gets the matching treatment; its `evaluation` parameter
stays defined but is documented as deliberately unused (D7).

## 7. Photo handling

`head_shot.JPG` is 3360×3858 — not square, 922 KB, and file mode 700. Profile mode renders it
at 160×160, so a non-square source would be squashed. It is centre-cropped to a square, resized
to 320×320 (2× for high-density screens), saved as `static/profile.jpg`, and visually checked
before shipping.

## 8. Out of scope (deferred)

- Per-paper detail pages with figures. Figure 4 of the JMP (regional LPG adoption vs.
  employment, with male and female fits diverging) is the strongest candidate; if used it must
  be captioned as a descriptive regional correlation, since the paper's causal estimates come
  from the land-slope instrument.
- The abstract for *From One LATE to Another* — the user will add it after the paper is
  finalised in September 2026.
- Rewriting the home-page bio.
- Design pass (colours, fonts), Google Search Console, custom domain — `WORKFLOW.md` Phase 5.

## 9. Verification

1. `hugo --gc --minify` exits 0. In this sandbox `--gc` needs an explicit `--cacheDir`.
2. `public/research/index.html` exists; **no** `public/research/<slug>/` directories; **no**
   `public/research/index.xml`. `--gc` does not delete stale output, so verify after
   `rm -rf public`.
3. Every internal link resolves to a file that exists in `static/`. Note that a reference to a
   `render: never` page does not raise an error, so the build passing is not proof.
4. Home page still renders profile mode (i.e. the templates did not hijack it).
5. Read the rendered `/research/` and `/teaching/` at 375px and at desktop width.
6. Run the `academic-web-reviewer` agent; fix CRITICAL and WARNING items.
7. Diff every paper title, coauthor, venue, year, and link against §5 before commit.

## 10. Open items

Resolved by the user on 2026-08-19:

- The four non-JMP abstracts (taken from the user's own Google Sites) are **confirmed correct**.
- The home-page bio is knowingly still the old wording; rewriting it stays deferred.
- The poster was supplied as a repo-hosted file and **is published** (D10).

Still outstanding, to be picked up later:

- The abstract for *From One LATE to Another*, after the paper is finalised in September 2026.
- The home-page bio rewrite.
