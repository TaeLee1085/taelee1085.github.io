# Research / Teaching / Home Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill the currently-empty Hugo site with the real Home, Research, and Teaching content, and make the CV reachable in one click.

**Architecture:** One Markdown file per paper and per teaching entry, carrying structured front matter; two section-scoped Go templates group those entries onto a single page each. Per-paper URLs are never built. Both templates render inside PaperMod's `.md-content` wrapper so that link underlines, heading sizes, and list spacing come from the theme instead of hand-written CSS.

**Tech Stack:** Hugo v0.148.1 extended, PaperMod (git submodule, requires Hugo ≥ 0.146.0), YAML config, Python 3.12 + Pillow for the one image crop.

**Spec:** `docs/superpowers/specs/2026-08-19-research-teaching-home-content-design.md`

## Global Constraints

- **Light theme only.** `defaultTheme: light`, `disableThemeToggle: true`. Do not add dark-mode CSS.
- **Mobile-responsive.** Every page must work at 375px width.
- **Academic accuracy.** Titles, coauthors, years, venues, and links come only from this plan. Never invent, correct, or "improve" any of them. If something looks wrong, stop and ask.
- **No broken or placeholder links.** A paper with no link renders as plain text. No "coming soon", no `#` hrefs.
- **Always buildable.** `hugo --gc --minify --cacheDir "$TMPDIR/hugocache"` must exit 0 after every task.
- **Never commit secrets**, and never move anything out of `private-manuscripts/` — it holds an unreleased coauthored manuscript.
- **URL paths are permanent** once published: `/research/`, `/teaching/`, `/kyungtae-lee-cv.pdf`, `/kyungtae-lee-jmp.pdf`, `/from-one-late-to-another-poster.pdf`. Do not rename them later.
- Work happens on branch `content/research-teaching-home`.

### Why the verification steps are greps, not unit tests

Hugo has no test runner. The equivalent of a failing test here is a build whose *output* is asserted: a `grep` against the generated HTML in `public/`. Several of this project's real failure modes — a suppressed page that still emits a file, a dead internal link, a group heading with nothing under it — all leave `hugo` exiting 0. Asserting on output is the only thing that catches them, so every task ends with an output assertion, not just a green build.

Two build flags matter throughout:
- `--cacheDir "$TMPDIR/hugocache"` — without it `--gc` fails in this sandbox on the default cache directory.
- `rm -rf public` before a verification build — `--gc` does **not** delete stale files, so an orphaned page from an earlier build will still be sitting there and will make a "no per-paper pages" assertion pass or fail for the wrong reason.

---

## File Structure

**Create:**
- `assets/profile.jpg` — square 320×320 headshot; PaperMod resizes it through Hugo Pipes
- `content/research/_index.md` — section page; carries the build cascade that suppresses per-paper URLs
- `content/research/*.md` — six paper entries (one file per paper)
- `content/teaching/_index.md` — section page; same cascade
- `content/teaching/*.md` — nine teaching entries
- `layouts/research/list.html` — groups papers by status onto one page
- `layouts/teaching/list.html` — groups teaching entries by institution
- `assets/css/extended/zz-site.css` — spacing and muted meta text only

**Modify:**
- `hugo.yml` — menu, profile mode, CV link
- `.claude/skills/new-paper/SKILL.md` — match the new content model
- `.claude/skills/new-teaching/SKILL.md` — same
- `WORKFLOW.md` — mark Phases 1–4 done

**Rename (git mv):**
- `static/CV Tae Lee.pdf` → `static/kyungtae-lee-cv.pdf`
- `static/JMP Tae Lee.pdf` → `static/kyungtae-lee-jmp.pdf`
- `static/From One LATE to Another Machine Learning and the External Validity of IV Estimates_poster.pdf` → `static/from-one-late-to-another-poster.pdf`

**Delete:**
- `static/head_shot.JPG` (replaced by `assets/profile.jpg`)
- `static/.claude/` (empty stray directory created by tooling)

---

## Task 1: Assets

Get every binary file to its permanent name and shape before a single link is written, so no link ever has to be rewritten.

**Files:**
- Rename: the three PDFs listed above
- Create: `assets/profile.jpg`
- Delete: `static/head_shot.JPG`, `static/.claude/`

**Interfaces:**
- Consumes: nothing.
- Produces: the permanent URLs `/kyungtae-lee-cv.pdf`, `/kyungtae-lee-jmp.pdf`, `/from-one-late-to-another-poster.pdf`, and the Hugo asset `profile.jpg` (referenced by `hugo.yml` as `imageUrl: "profile.jpg"`, resolved via `resources.Get`, so it must live in `assets/`, **not** `static/`).

- [ ] **Step 1: Confirm the source files are exactly where the plan expects**

```bash
cd /Users/taelee/Documents/CLO_Workspace/personal_website
ls -la static/
```

Expected: `CV Tae Lee.pdf`, `JMP Tae Lee.pdf`, `From One LATE to Another Machine Learning and the External Validity of IV Estimates_poster.pdf`, `head_shot.JPG`, four favicon files, and a stray empty `.claude/`. If any name differs, stop and ask — do not guess at a rename.

- [ ] **Step 2: Rename the three PDFs**

```bash
git mv "static/CV Tae Lee.pdf" static/kyungtae-lee-cv.pdf
git mv "static/JMP Tae Lee.pdf" static/kyungtae-lee-jmp.pdf
git mv "static/From One LATE to Another Machine Learning and the External Validity of IV Estimates_poster.pdf" static/from-one-late-to-another-poster.pdf
```

`git mv` fails on an untracked file. If it does, `git add static/` first, then re-run.

- [ ] **Step 3: Crop and resize the headshot**

The source is 3360×3858 (portrait). Profile mode renders a square, so a square crop is required or the face will be squashed. This box is a head-and-shoulders crop centred on the face, chosen by inspecting the image; a full-width top-anchored crop `(0, 0, 3360, 3360)` is the fallback if the result looks wrong.

```bash
mkdir -p assets
python3 - <<'PY'
from PIL import Image
im = Image.open('static/head_shot.JPG')
assert im.size == (3360, 3858), f"unexpected source size {im.size}"
box = (408, 74, 2783, 2449)          # 2375x2375 square
out = im.crop(box).resize((320, 320), Image.LANCZOS)
out.convert('RGB').save('assets/profile.jpg', quality=90, optimize=True)
print('wrote assets/profile.jpg', out.size)
PY
```

- [ ] **Step 4: Look at the result before trusting it**

Open `assets/profile.jpg` and confirm the head is not clipped and the face is centred. This is a person's photograph on a job-market site — a bad crop is worse than no photo. If it is wrong, re-run Step 3 with `box = (0, 0, 3360, 3360)`.

- [ ] **Step 5: Remove the originals that are now superseded**

```bash
git rm --cached static/head_shot.JPG 2>/dev/null || true
rm -f static/head_shot.JPG
rmdir static/.claude/.cc-writes static/.claude 2>/dev/null || true
ls -la static/ assets/
```

Expected: `static/` holds four favicons plus the three renamed PDFs; `assets/` holds `profile.jpg`.

- [ ] **Step 6: Verify the private manuscript is still ignored**

```bash
git check-ignore -v private-manuscripts/External_Validity_in_Practice_20260819.pdf
git status --short | grep -i "private-manuscripts" && echo "LEAK" || echo "ok: not tracked"
```

Expected: the first command prints the matching `.gitignore` rule; the second prints `ok: not tracked`. If it prints `LEAK`, stop — an unreleased manuscript must never enter this public repo.

- [ ] **Step 7: Commit**

```bash
git add -A static assets
git commit -m "Rename site assets to permanent URLs; add square profile image

PDF filenames had spaces, which percent-encode into URLs that must never
change once the department page lists them. The headshot was 3360x3858 and
would have been squashed by profile mode's square rendering."
```

---

## Task 2: Site configuration and Home page

**Files:**
- Modify: `hugo.yml`

**Interfaces:**
- Consumes: `assets/profile.jpg`, `/kyungtae-lee-cv.pdf` from Task 1.
- Produces: the `/research/` and `/teaching/` URLs that Tasks 3 and 4 fill; nav and profile buttons pointing at them.

- [ ] **Step 1: Replace the `menu` and `params` blocks in `hugo.yml`**

Keep the file's existing top matter (`baseURL`, `languageCode`, `title`, `theme`, `enableInlineShortcodes`, `enableRobotsTXT`, `pagination`, `taxonomies`, `minify`) and the trailing `markup` block exactly as they are. Replace only from `menu:` through the end of `socialIcons:`.

```yaml
menu:
  main:
    - name: Research
      url: research/
      weight: 1
    - name: Teaching
      url: teaching/
      weight: 2
    - name: CV
      url: kyungtae-lee-cv.pdf
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
    subtitle: "I am a Ph.D. candidate in Economics at CUNY Graduate Center. My primary fields of interest are energy and environmental economics. I am also interested in applied econometrics and development economics."
    imageUrl: "profile.jpg"
    imageWidth: 160
    imageHeight: 160
    imageTitle: "Kyungtae Lee"
    buttons:
      - name: Research
        url: research/
      - name: Teaching
        url: teaching/
      - name: CV
        url: kyungtae-lee-cv.pdf
  socialIcons:
    - name: email
      url: "mailto:klee5@gradcenter.cuny.edu"
    - name: orcid
      url: "https://orcid.org/0009-0009-4661-9638"
```

No Google Scholar icon and no job-market statement — both were declined by the site owner.

- [ ] **Step 2: Build and assert the home page**

```bash
rm -rf public
hugo --gc --minify --cacheDir "$TMPDIR/hugocache"
grep -c 'profile_inner' public/index.html
grep -o 'href="[^"]*kyungtae-lee-cv.pdf"' public/index.html | head -3
grep -o '<img[^>]*profile[^>]*>' public/index.html | head -2
```

Expected: build exits 0; `profile_inner` count is 1 (profile mode is intact); the CV link appears (nav + button); an `<img>` referencing a processed `profile` image is present.

- [ ] **Step 3: Assert the CV file actually exists at the URL that links to it**

```bash
test -f public/kyungtae-lee-cv.pdf && echo "cv ok" || echo "CV MISSING"
```

Expected: `cv ok`. Hugo does not warn about a link to a missing static file, so this must be asserted directly.

- [ ] **Step 4: Commit**

```bash
git add hugo.yml
git commit -m "Point nav and profile at /research/, /teaching/, and the CV PDF

Adds the profile photo and the one-click CV link required by CLAUDE.md."
```

---

## Task 3: Research section

**Files:**
- Create: `content/research/_index.md` and six entry files
- Create: `layouts/research/list.html`

**Interfaces:**
- Consumes: `/kyungtae-lee-jmp.pdf` and `/from-one-late-to-another-poster.pdf` from Task 1.
- Produces: the front-matter contract that Task 6 documents in `/new-paper`:
  `weight` (top-level int, orders within a group only), and under `params:` —
  `status` (`jmp` | `published` | `working` | `wip`), `year` (int, display only),
  `coauthors` (list of strings, the user's own name omitted), `venue` (string),
  `link` (string, the title's href), `presentations` (list of strings, may contain HTML).

- [ ] **Step 1: Create the section page with the page-suppressing cascade**

`content/research/_index.md`:

```markdown
---
title: "Research"
outputs: ["html"]
cascade:
  - _target:
      kind: page
    build:
      render: never
      list: local
---
```

Three things here are load-bearing and none of them fail the build if you get them wrong:
- `_target: {kind: page}` scopes the cascade to child pages. **Unscoped, it also deletes `/research/index.html`.**
- `list: local` is required. `render: never` on its own does *not* remove pages from collections in Hugo 0.148.1, despite the documentation.
- `outputs: ["html"]` suppresses `research/index.xml`, an RSS feed whose every item would have an empty `<link/>`.

- [ ] **Step 2: Create the job market paper**

`content/research/clean-energy-access-home-production.md`:

```markdown
---
title: "Clean Energy Access and Home Production Improvement: Labor Supply and Gender Difference"
weight: 10
params:
  status: jmp
  year: 2025
  link: "/kyungtae-lee-jmp.pdf"
  presentations:
    - "IAEE session, 2026 ASSA Conference"
    - "2025 USAEE/IAEE North American Conference (Top 4 Finalist, Dennis J. O'Brien Best Student Paper Award)"
---

This paper examines how improvements in home production technology influence labor supply and time allocation within households. Using nationally representative data from Nepal, I estimate the causal impact of adopting liquefied petroleum gas (LPG) cookstoves, a cleaner and more efficient technology, on men's and women's labor market outcomes. To address endogeneity in stove adoption, I exploit geographic variation in average land slope as an instrumental variable that affects the cost and accessibility of LPG distribution but is otherwise unrelated to labor supply. The results show gender differences in response to the LPG stove adoption. LPG adoption increases men's likelihood of employment and the number of workdays per year, while women's employment and workdays decline modestly. On average, men work about 20 additional days per year following adoption, whereas women work about 20 fewer days per year. Time-use data indicate that LPG stoves substantially reduce time spent on fuel collection and cooking for both genders. Women reallocate much of this saved time to other domestic or caregiving tasks rather than market work. These findings provide empirical evidence that men and women respond differently to improvements in home production due to gender norms, labor-demand-side inequality, and intra-household bargaining power dynamics.
```

This abstract is transcribed from `static/kyungtae-lee-jmp.pdf` (December 2025). It deliberately differs from the abstract on the owner's old Google Sites, which was an older, compressed version reporting different numbers. Do not reconcile them.

- [ ] **Step 3: Create the two publications**

`content/research/external-validity-iv-setting.md`:

```markdown
---
title: "External Validity in an Instrumental Variable Setting"
weight: 10
params:
  status: published
  year: 2025
  coauthors: ["Alexander Kwon"]
  venue: "Evaluation Review"
  link: "https://doi.org/10.1177/0193841X251342619"
  presentations:
    - "2025 ASSA Conference (Lightning Session)"
---

We study external validity within the context of instrumental variable estimation. The key assumption we impose for external validity is conditional external unconfoundedness among compliers, which means that the treatment effect and target selection are independent among compliers conditional on covariates. We study this assumption by using a case study about the impact of solid fuel usage on women's average cooking time. Among the six countries examined, we find no statistical evidence that the assumptions for external validity are violated for four countries (Ethiopia, Honduras, Kenya, and Zambia). Conversely, in Cambodia and Nepal, we find low external validity. These results provide suggestive evidence that the assumptions for external validity are violated for these two countries.
```

`content/research/geographical-factors-cookstove-nepal.md`:

```markdown
---
title: "Geographical Factors Influencing Household Cookstove Choices in Nepal"
weight: 20
params:
  status: published
  year: 2025
  coauthors: ["Alexander Kwon"]
  venue: "Social Sciences & Humanities Open"
  link: "https://www.sciencedirect.com/science/article/pii/S2590291124004509"
---

Using data from the Multi-Tier Framework Survey (MTF) conducted in Nepal, we explore how geographical factors, specifically land slope and elevation, impact the adoption of LPG stoves. We employ a logit model to analyze the factors influencing households' choices regarding LPG stove adoption and generate slope and elevation data. Overall, we find that the estimates of the average slope are robust and statistically significant, but those for the average elevation are sensitive to model specifications and smaller compared to the slope. We find that the Kathmandu region is important in the analysis, and slope and elevation have nonlinear effects. Additionally, we show that geographical factors are similarly important across different household expenditure quintile groups, except for the lowest.
```

- [ ] **Step 4: Create the two working papers**

`content/research/carbon-pricing-abatement-seven-cities.md` — note there is **no** `link`, so the title renders as plain text:

```markdown
---
title: "Carbon Pricing and Heterogeneous Abatement Responses: Evidence from Seven U.S. Cities"
weight: 10
params:
  status: working
  coauthors: ["Maggie Rong Hu", "Jun Yoo"]
---

This paper examines whether carbon-pricing policies accelerate greenhouse gas reductions beyond those achieved by disclosure-based programs. Using a building-level panel from seven U.S. cities, we compare New York City's Local Law 97, an emissions-penalty regime, with disclosure-focused policies elsewhere. A difference-in-differences design finds modest but statistically significant average reductions, with substantial cross-building heterogeneity. We document a nonmonotonic, inverted U-shaped response to expected penalties: abatement rises with anticipated penalty salience up to a threshold and then flattens. Taken together, the estimates imply that the prevailing penalty is below the response-maximizing range.
```

`content/research/accessibility-clean-energy-stoves.md`:

```markdown
---
title: "The Role of Accessibility in the Adoption of Clean Energy Stoves"
weight: 20
params:
  status: working
  link: "https://dx.doi.org/10.2139/ssrn.5314869"
---

I examine how accessibility influences LPG stove demand and provide empirical evidence that household transportation ownership positively affects the adoption of LPG stoves. Using data from Nepal's Multi-Tier Framework Survey (MTF), I apply Propensity Score Matching to address self-selection bias; the Average Treatment Effect on the Treated (ATET) is positive and significant across model specifications. To control community-level information, I merge MTF data with the Household Risk and Vulnerability Survey (HRVS) at the district level. Although this reduces the sample size, the results remain robust, with a larger and still significant ATET.
```

- [ ] **Step 5: Create the work in progress**

`content/research/from-one-late-to-another.md` — deliberately has **no body and no `link`**. The manuscript is unreleased and the abstract is being withheld until the paper is finalised in September 2026. The poster is the only public artifact, and it is linked from inside the presentation line.

```markdown
---
title: "From One LATE to Another: Machine Learning and the External Validity of IV Estimates"
weight: 10
params:
  status: wip
  coauthors: ["Alexander Kwon"]
  presentations:
    - "2026 Africa Meeting of the Econometric Society (accepted)"
    - '2026 ASSA Conference (<a href="/from-one-late-to-another-poster.pdf">poster</a>)'
---
```

- [ ] **Step 6: Create the Research template**

`layouts/research/list.html`. It must be at this path — **not** `layouts/list.html` or `layouts/_default/list.html`, both of which are lower priority *and* would replace the theme's list template on the home page, silently destroying profile mode.

The whole body is wrapped in `post-content md-content` so that PaperMod's own `.md-content a:not(.anchor)` rule underlines every link. Outside that wrapper, PaperMod renders links in exactly the same colour as body text with no underline, which would leave the DOI and PDF links invisible as links.

```go-html-template
{{- define "main" }}
<header class="page-header">
  <h1>{{ .Title }}</h1>
</header>

<div class="post-content md-content">
  {{- .Content -}}

  {{- $groups := slice
      (dict "key" "jmp"       "label" "Job Market Paper")
      (dict "key" "published" "label" "Publications")
      (dict "key" "working"   "label" "Working Papers")
      (dict "key" "wip"       "label" "Work in Progress")
  -}}

  {{- range $g := $groups }}
    {{- $entries := sort (where $.RegularPages "Params.status" $g.key) "Weight" }}
    {{- with $entries }}
  <h2 class="research-group">{{ $g.label }}</h2>
      {{- range $p := . }}
  <article class="paper">
    <h3 class="paper-title">
      {{- with $p.Params.link }}<a href="{{ . }}">{{ $p.Title }}</a>{{ else }}{{ $p.Title }}{{ end -}}
    </h3>
        {{- $bits := slice }}
        {{- with $p.Params.coauthors }}
          {{- $bits = $bits | append (printf "with %s" (delimit . ", " " and ")) }}
        {{- end }}
        {{- if and $p.Params.venue $p.Params.year }}
          {{- $bits = $bits | append (printf "<em>%s</em>, %v" $p.Params.venue $p.Params.year) }}
        {{- else with $p.Params.venue }}
          {{- $bits = $bits | append (printf "<em>%s</em>" .) }}
        {{- end }}
        {{- with $bits }}
    <p class="paper-meta">{{ delimit . " &middot; " | safeHTML }}</p>
        {{- end }}
        {{- with $p.Content }}
    <div class="paper-abstract">{{ . }}</div>
        {{- end }}
        {{- with $p.Params.presentations }}
    <p class="paper-presentations"><span class="paper-label">Presented at:</span> {{ delimit . " &middot; " | safeHTML }}</p>
        {{- end }}
  </article>
      {{- end }}
    {{- end }}
  {{- end }}
</div>
{{- end }}
```

Every block is guarded by `with`, so the JMP emits no author line, the working paper with no link emits no anchor, and the work in progress emits no abstract block. `.Paginate` is never called — calling it inside a grouped list returns the wrong pages on the second call without erroring.

- [ ] **Step 7: Build and assert the grouping, the links, and the absence of per-paper pages**

```bash
rm -rf public
hugo --gc --minify --cacheDir "$TMPDIR/hugocache"

echo "--- groups present and in order ---"
grep -o '<h2 class="research-group">[^<]*</h2>' public/research/index.html

echo "--- six paper titles ---"
grep -c '<article class="paper">' public/research/index.html

echo "--- no per-paper directories ---"
find public/research -mindepth 1 -type d | grep -v '^$' && echo "STRAY PAGES" || echo "ok: none"

echo "--- no RSS ---"
test -f public/research/index.xml && echo "STRAY RSS" || echo "ok: none"

echo "--- section page exists ---"
test -f public/research/index.html && echo "ok" || echo "SECTION PAGE MISSING"

echo "--- linked assets exist ---"
for f in kyungtae-lee-jmp.pdf from-one-late-to-another-poster.pdf; do
  test -f "public/$f" && echo "ok: $f" || echo "MISSING: $f"
done

echo "--- unlinked papers really are unlinked ---"
grep -c 'Carbon Pricing and Heterogeneous' public/research/index.html
grep -o '<h3 class="paper-title">[^<]*Carbon Pricing[^<]*</h3>' public/research/index.html && echo "ok: plain text" || echo "CHECK: Carbon Pricing may be linked"
```

Expected: exactly the four group headings in the order Job Market Paper, Publications, Working Papers, Work in Progress; `6` articles; `ok: none` for stray directories and RSS; `ok` for the section page; both linked assets present; Carbon Pricing's title inside the `h3` with no anchor.

- [ ] **Step 8: Confirm the home page survived the new template**

```bash
grep -c 'profile_inner' public/index.html
```

Expected: `1`. If this is `0`, the template landed at the wrong path and hijacked the home page.

- [ ] **Step 9: Commit**

```bash
git add content/research layouts/research
git commit -m "Add Research section: six papers on one grouped page

Per-paper URLs are suppressed via a kind-scoped build cascade; group order
lives in the template rather than in weight, so a wrong or missing weight
cannot move a paper into the wrong group."
```

---

## Task 4: Teaching section

**Files:**
- Create: `content/teaching/_index.md` and nine entry files
- Create: `layouts/teaching/list.html`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: the teaching front-matter contract that Task 6 documents: `weight` (top-level int, orders within an institution) and under `params:` — `role`, `institution`, `terms` (all strings). The course name is the page `title`.

- [ ] **Step 1: Create the section page**

`content/teaching/_index.md` — same three load-bearing settings as Research:

```markdown
---
title: "Teaching"
outputs: ["html"]
cascade:
  - _target:
      kind: page
    build:
      render: never
      list: local
---
```

- [ ] **Step 2: Create the two Brooklyn College entries**

`content/teaching/2026-spring-financial-economics.md`:

```markdown
---
title: "Financial Economics"
weight: 10
params:
  role: "Adjunct Instructor"
  institution: "Brooklyn College"
  terms: "Spring 2026"
---
```

`content/teaching/2026-spring-intro-business-statistics.md`:

```markdown
---
title: "Intro Business Statistics"
weight: 20
params:
  role: "Adjunct Instructor"
  institution: "Brooklyn College"
  terms: "Spring 2026"
---
```

- [ ] **Step 3: Create the Baruch College entry**

`content/teaching/2025-baruch-intro-micro.md`:

```markdown
---
title: "Introduction to Microeconomics"
weight: 10
params:
  role: "Adjunct Instructor"
  institution: "Baruch College"
  terms: "Spring 2025 – Spring 2026"
---
```

- [ ] **Step 4: Create the three City College entries**

`content/teaching/2025-fall-ccny-principles-micro.md`:

```markdown
---
title: "Principles of Microeconomics"
weight: 10
params:
  role: "Teaching Assistant"
  institution: "The City College of New York"
  terms: "Fall 2025"
---
```

`content/teaching/2025-spring-ccny-principles-statistics.md`:

```markdown
---
title: "Principles of Statistics"
weight: 20
params:
  role: "Adjunct Instructor"
  institution: "The City College of New York"
  terms: "Spring 2025"
---
```

`content/teaching/2022-ccny-intermediate-macro.md`:

```markdown
---
title: "Intermediate Macroeconomics"
weight: 30
params:
  role: "Adjunct Instructor"
  institution: "The City College of New York"
  terms: "Spring 2022 – Spring 2023, Summer 2025"
---
```

- [ ] **Step 5: Create the Graduate Center, Hunter, and NYU entries**

`content/teaching/2022-fall-gc-math-for-economists.md`:

```markdown
---
title: "Math for Economists (Ph.D. program)"
weight: 10
params:
  role: "Teaching Assistant"
  institution: "The Graduate Center, CUNY"
  terms: "Fall 2022"
---
```

`content/teaching/2022-summer-hunter-math-camp.md`:

```markdown
---
title: "Math Camp (M.A. program)"
weight: 10
params:
  role: "Instructor"
  institution: "Hunter College"
  terms: "Summer 2022"
---
```

`content/teaching/2021-fall-nyu-math-for-economists.md`:

```markdown
---
title: "Mathematics for Economists (M.A. program)"
weight: 10
params:
  role: "Teaching Assistant"
  institution: "New York University"
  terms: "Fall 2021"
---
```

No evaluation scores appear anywhere. The site owner asked for them to be left off, because the one perfect score came from a single respondent.

- [ ] **Step 6: Create the Teaching template**

`layouts/teaching/list.html`. Institution order is explicit and most-recent-first; an institution with no entries emits nothing.

```go-html-template
{{- define "main" }}
<header class="page-header">
  <h1>{{ .Title }}</h1>
</header>

<div class="post-content md-content">
  {{- .Content -}}

  {{- $institutions := slice
      "Brooklyn College"
      "Baruch College"
      "The City College of New York"
      "The Graduate Center, CUNY"
      "Hunter College"
      "New York University"
  -}}

  {{- range $inst := $institutions }}
    {{- $entries := sort (where $.RegularPages "Params.institution" $inst) "Weight" }}
    {{- with $entries }}
  <h2 class="teaching-institution">{{ $inst }}</h2>
  <ul class="teaching-list">
      {{- range $e := . }}
    <li>{{ $e.Params.role }}, {{ $e.Title }}<span class="teaching-terms"> &mdash; {{ $e.Params.terms }}</span></li>
      {{- end }}
  </ul>
    {{- end }}
  {{- end }}
</div>
{{- end }}
```

- [ ] **Step 7: Build and assert**

```bash
rm -rf public
hugo --gc --minify --cacheDir "$TMPDIR/hugocache"

echo "--- institutions in order ---"
grep -o '<h2 class="teaching-institution">[^<]*</h2>' public/teaching/index.html

echo "--- nine entries ---"
grep -c '<li>' public/teaching/index.html

echo "--- no stray pages or RSS ---"
find public/teaching -mindepth 1 -type d | grep -v '^$' && echo "STRAY PAGES" || echo "ok: none"
test -f public/teaching/index.xml && echo "STRAY RSS" || echo "ok: none"

echo "--- no evaluation scores leaked ---"
grep -Ei '[0-9]\.[0-9]{2}\s*/\s*5' public/teaching/index.html && echo "EVAL LEAKED" || echo "ok: none"

echo "--- home still profile mode ---"
grep -c 'profile_inner' public/index.html
```

Expected: six institution headings in the listed order; `9` list items; `ok: none` three times; `1` for profile mode.

- [ ] **Step 8: Commit**

```bash
git add content/teaching layouts/teaching
git commit -m "Add Teaching section: nine entries grouped by institution

Includes Brooklyn College (Spring 2026) and the extended Baruch run, both of
which the old site was missing. Evaluation scores are deliberately omitted."
```

---

## Task 5: Styling, accessibility, and mobile

Because both templates render inside `.md-content`, the theme already supplies link underlines, heading sizes, list spacing, and the responsive container. Only spacing between entries and the muted meta text are missing.

**Files:**
- Create: `assets/css/extended/zz-site.css`

**Interfaces:**
- Consumes: the class names emitted in Tasks 3 and 4 — `.paper`, `.paper-title`, `.paper-meta`, `.paper-abstract`, `.paper-presentations`, `.paper-label`, `.research-group`, `.teaching-institution`, `.teaching-list`, `.teaching-terms`.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Write the stylesheet**

The filename must sort after the theme's own files: extended CSS is concatenated last, in alphabetical order, from a **single-level** glob (`css/extended/*.css` — subdirectories are silently ignored).

```css
/* Research and Teaching list pages.
   Both render inside .md-content, so links, heading sizes and list spacing
   already come from the theme. Only rhythm and de-emphasis are added here. */

.research-group,
.teaching-institution {
    margin-top: 40px;
}

.paper {
    margin-bottom: 32px;
}

.paper-title {
    margin-bottom: 6px;
}

.paper-meta,
.paper-presentations {
    color: var(--secondary);
    font-size: 15px;
    line-height: 1.5;
    margin: 6px 0;
}

.paper-label {
    font-weight: 600;
}

.paper-abstract p {
    margin: 8px 0;
}

.teaching-list {
    margin-top: 8px;
}

.teaching-terms {
    color: var(--secondary);
}

/* Mobile overrides MUST live inside their own media query.
   Extended CSS is concatenated after the theme's own media queries, and a
   media query adds no specificity, so an unqualified rule here would beat
   the theme's mobile rules at every width. */
@media (max-width: 768px) {
    .research-group,
    .teaching-institution {
        margin-top: 32px;
    }

    .paper {
        margin-bottom: 26px;
    }
}
```

- [ ] **Step 2: Build and confirm the stylesheet was picked up**

```bash
rm -rf public
hugo --gc --minify --cacheDir "$TMPDIR/hugocache"
grep -rl 'paper-presentations' public/assets/css/ 2>/dev/null || grep -rl 'paper-presentations' public/ --include='*.css'
```

Expected: at least one generated stylesheet contains the rule. If nothing matches, the file is in the wrong directory — it must be `assets/css/extended/`, at the repo root, not under `themes/`.

- [ ] **Step 3: Check the pages at phone width and desktop width**

Start a server and look at both pages at 375px and at full width:

```bash
hugo server -D
```

Confirm:
- No horizontal scrolling at 375px on `/research/` or `/teaching/`.
- Long paper titles wrap rather than overflow.
- DOI, SSRN, PDF, and poster links are visibly links (underlined), not plain text.
- Heading order reads h1 → h2 → h3 with no skipped level.

Stop the server when done.

- [ ] **Step 4: Commit**

```bash
git add assets/css/extended/zz-site.css
git commit -m "Add spacing and muted meta styling for research and teaching lists"
```

---

## Task 6: Update the recipe skills

The two skills currently describe a content model that no longer exists: they point at `content/papers/`, use an `authors` string, and carry weight numbers that sort publications below work in progress. Leaving them stale would mean the next `/new-paper` run quietly produces a broken entry.

**Files:**
- Modify: `.claude/skills/new-paper/SKILL.md`
- Modify: `.claude/skills/new-teaching/SKILL.md`

**Interfaces:**
- Consumes: the front-matter contracts produced by Tasks 3 and 4.
- Produces: nothing.

- [ ] **Step 1: Rewrite the body of `new-paper/SKILL.md`**

Keep the YAML frontmatter (`name`, `description`) as it is. Replace the `Inputs`, `Steps`, and `Notes` sections so they describe the real model:

- Path is `content/research/<slug>.md`, not `content/papers/`.
- Inputs are: title; status (`jmp`/`published`/`working`/`wip`); year; coauthors **excluding Kyungtae Lee**; venue (published only); link (the title's href — hosted PDF for the JMP, DOI or journal page for published, SSRN for working; omit entirely if none); presentations (optional list); abstract (the page body, omit if withholding).
- `weight` is a **top-level** key and orders entries **within a group only**. Group order lives in `layouts/research/list.html` and must not be changed by editing weights. Note explicitly that nesting `weight` under `params:` leaves it at 0, which sorts the entry last.
- Verification: `hugo --gc --minify --cacheDir "$TMPDIR/hugocache"`, then confirm no `public/research/<slug>/` directory appeared and any linked file exists in `public/`.
- Keep the existing instruction to run the `academic-web-reviewer` agent afterwards.
- Replace the old note about needing `brainstorming → writing-plans` for a custom layout: the layout now exists at `layouts/research/list.html`.

- [ ] **Step 2: Rewrite the body of `new-teaching/SKILL.md`**

- Path is `content/teaching/<slug>.md`.
- Inputs: course title (the page `title`), role, institution, terms. `weight` orders within an institution.
- **A new institution must also be added to the ordered `$institutions` slice in `layouts/teaching/list.html`, or its entries will not render at all.** This is the single most likely way to silently lose a teaching entry — state it prominently.
- Document that the `evaluation` and `materials` parameters are intentionally unused: the site owner asked for evaluation scores to be left off.

- [ ] **Step 3: Verify the skills describe files that exist**

```bash
grep -n 'content/papers' .claude/skills/new-paper/SKILL.md && echo "STALE PATH" || echo "ok"
grep -n 'content/research' .claude/skills/new-paper/SKILL.md | head -3
grep -n 'institutions' .claude/skills/new-teaching/SKILL.md | head -3
```

Expected: `ok` for the stale path check; the new paths present.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills
git commit -m "Update recipe skills to the real content model

Both skills described content/papers/ with weights that sorted publications
below work in progress. Also flags that a new teaching institution must be
added to the template's ordered list or its entries silently vanish."
```

---

## Task 7: Whole-site verification and handoff

**Files:**
- Modify: `WORKFLOW.md`

**Interfaces:**
- Consumes: everything above.
- Produces: nothing.

- [ ] **Step 1: Clean build from scratch**

```bash
rm -rf public resources/_gen
hugo --gc --minify --cacheDir "$TMPDIR/hugocache"
echo "exit: $?"
```

Expected: exit 0, no ERROR or WARN lines about missing refs or templates.

- [ ] **Step 2: Assert every internal link resolves to a real file**

Hugo does not error on a link to a file that does not exist, so this must be checked directly.

```bash
grep -ho 'href="/[^"]*"' public/research/index.html public/teaching/index.html public/index.html \
  | sed 's/href="//; s/"//' | sort -u \
  | while read -r u; do
      case "$u" in
        */) p="public${u}index.html" ;;
        *)  p="public${u}" ;;
      esac
      test -e "$p" && echo "ok   $u" || echo "DEAD $u"
    done
```

Expected: every line starts with `ok`. Any `DEAD` line is a broken link that the build did not catch.

- [ ] **Step 3: Assert the private manuscript never entered the build or the repo**

```bash
find public -iname '*External_Validity_in_Practice*' | grep . && echo "LEAKED TO BUILD" || echo "ok: not in build"
git log --all --diff-filter=A --name-only --pretty=format: | grep -i 'External_Validity_in_Practice' && echo "LEAKED TO HISTORY" || echo "ok: not in history"
```

Expected: `ok` twice. If either fails, stop immediately and report — this is an unreleased coauthored manuscript in a public repository.

- [ ] **Step 4: Diff the rendered content against the spec**

Read `public/research/index.html` and `public/teaching/index.html` and compare, field by field, against §5 of the spec: every title, coauthor list, venue, year, link target, presentation line, and teaching term. This is a manual read, not a grep — a transposed year or a wrong coauthor is exactly the kind of error that no automated check here will catch.

- [ ] **Step 5: Run the reviewer agent**

Dispatch the `academic-web-reviewer` agent over the changes. It reports and never edits. Fix every CRITICAL and WARNING item it raises, then re-run it.

- [ ] **Step 6: Update `WORKFLOW.md`**

Mark Phases 1 through 4 done, tick their checkboxes, and revise the Open Questions section: the photo and CV are supplied, ORCID is confirmed, Google Scholar was declined, and the bio rewrite plus the *From One LATE* abstract (September 2026) remain outstanding. Add Decision Log rows dated 2026-08-19 for the `/research/` path, the no-evaluations rule, and the private-manuscripts directory.

- [ ] **Step 7: Commit and hand back**

```bash
git add WORKFLOW.md
git commit -m "Mark Phases 1-4 complete; log content decisions"
git log --oneline main..HEAD
```

Then show the site owner the running site (`hugo server -D`) and ask whether to merge `content/research-teaching-home` into `main`, which triggers the GitHub Pages deploy. **Do not merge or push without that approval.**

---

## Self-Review

**Spec coverage.** §2 sources → Task 3 content and its transcription notes. §3 D1–D15 → D1 Task 2/3, D2 Task 3 Step 1, D3 Task 3, D4/D5 Task 3 Step 6 template, D6 Task 3, D7 Task 4 Step 5 and its assertion, D8/D9 Task 2, D10 Task 3 Step 5, D11 Task 3 Step 6, D12 template `with` guard on coauthors, D13 no coauthor anchors anywhere, D14 Task 1 renames, D15 Task 2 menu and buttons. §4 URLs → Task 1. §5.1 → Task 2; §5.2 → Task 3; §5.3 → Task 4. §6.1 → Tasks 3 and 4 front matter; §6.2 → Tasks 3, 4, 5; §6.3 → Task 3 Step 1; §6.4 → Task 5. §6.5 → Task 6. §7 photo → Task 1. §9 verification → Tasks 3, 4, 7. No gaps found.

**Placeholders.** None. Every content file, template, and stylesheet is written out in full; every verification step names the command and the expected output.

**Type consistency.** The class names in the Task 5 stylesheet match those emitted in Tasks 3 and 4 exactly. The front-matter keys used in Task 3 (`status`, `year`, `coauthors`, `venue`, `link`, `presentations`) and Task 4 (`role`, `institution`, `terms`) match what the templates read and what Task 6 documents. `weight` is top-level in every entry file, as the templates sort on `.Weight`.

**One judgment call flagged for the executor.** Task 1's crop box was chosen by looking at the photograph; Step 4 requires looking at the result before accepting it, with a stated fallback.
