# Design — Interactive JMP results page

Date: 2026-11-14
Status: approved by the owner on 2026-11-14; built and reviewed
Size: small change. The page content is finished and was reviewed as a sample (claude.ai
artifact `HPy8nTacxj7QetR1b5Gtne`, version 5, "humanized wording"). This design moves it into
the site and links it from the JMP entry.

## 1. Intent

A visitor to `/research/`, usually someone on a search committee, clicks a button on the job
market paper entry and lands on a page that shows the paper's main claim in interactive
figures. The owner's three goals, in their words from this session:

- the visitor understands what the paper claims at a glance, from the figures;
- the page makes the visitor think the owner is good at visualization;
- the page was built with AI, so it should also show skill in using AI (the footer says so).

## 2. Goals, non-goals, anti-goals

**Goals**

- A new page at `/jmp-results/` with the v5 sample's text, numbers, figures and controls.
- The site's own header, menu and footer around it, so a visitor can get back to Research,
  the CV or Home.
- A small "Interactive results" button on the JMP entry of `/research/` (option A).

**Non-goals**

- No new results, no 3D, no rewording beyond the removals listed in section 5.
- No item in the top menu. The page is reached from the JMP entry.
- No button on any other paper.

**Anti-goals** (failure even if it technically works)

- Any number on the page that cannot be traced to Table 2, 3 or 15 of the November 13, 2026
  draft.
- The button reads as an ad on an otherwise plain Research page (the reason for A over B).
- The page is hard to use on a phone, or loads any outside script, font or tracker.
- `/research/` or the build breaks.

## 3. Constraints

- `CLAUDE.md` hard rules: light theme only, works on a phone, academic accuracy, `hugo --gc
  --minify` passes, no broken or placeholder links.
- `content/research/_index.md` cascades `build.render: never` to every page under
  `content/research/`, so the new page lives outside that folder.
- RSS is off site-wide (`disableKinds`). The new page enters `sitemap.xml` by default, which is
  wanted for search.
- PaperMod's reading column is 720px wide (`--main-width`). The sample was laid out for 820px.
- The numbers belong to the November 13, 2026 draft. A later draft can change them (section 8).

## 4. Approaches

| | How | Gains | Costs |
|---|---|---|---|
| **A. Hugo page with its own layout (picked)** | `content/jmp-results.md` plus a layout that fills PaperMod's `main` block; numbers in `data/jmp_results.json`; script and styles loaded only on this page | Site header, menu, footer and fonts; one build; the numbers sit in a readable data file | Porting work; the page's styles must not clash with the theme's |
| B. Copy the sample into `static/jmp-results/index.html` | Serve the reviewed file as is | Exactly what the owner saw; almost no work | No site menu or footer, a different look from the rest of the site, two styles to maintain, not in `sitemap.xml` |
| C. Hugo page that shows B in an iframe | Site page with a frame | Site menu, no style clashes | Frame height must be synced by script, tooltips clip at the frame edge, awkward scrolling on phones |

A is my call. I told the owner on 2026-11-14 that the site menu would stay so visitors can get
back, and they moved on to this design. B and C give up the site's look or phone usability to
save porting work.

## 5. Decisions

**The owner's**

- Link style A: a small outlined button under the coauthor line and above "Presentations:",
  visible without opening the abstract. Sketch the owner approved:

  ```
  From One LATE to Another: Machine Learning and ...   ← title, opens the PDF
  with Alexander Kwon
  [ ▶ Interactive results ]                             ← new button
  Presentations: 2027 ASSA Conference (poster) · ...
  + Abstract
  ```

- Move from the sample to the site with the v5 content. I asked whether the sample was final
  enough and the owner answered "A안으로 하고 설계 문서 넘어가자".

**Mine, open to correction**

- URL `/jmp-results/`.
- Removed from the sample: the "Sample for review · not on the website yet" strip and the
  "Sample wording" tag in the footer. The first-person footer sentence stays ("I built this
  page with Claude Code, an AI coding assistant, from the November 13, 2026 draft. …").
- The paper link at the top becomes site-relative, `/kyungtae-lee-jmp.pdf`.
- The page opens on the same scene as the sample: spread σX = 10, curved instrument, step
  outcome. That is the scene where I2SLS has the smaller total error only because its Term I
  and Term IV partly cancel.
- Browser tab: "From One LATE to Another: Interactive Results | Kyungtae Lee". A one-sentence
  meta description for search results.
- This page alone gets the sample's 820px column, so the charts keep their width on a
  laptop. Every other page keeps 720px.
- Button: a new front-matter field `params.interactive: "/jmp-results/"` on the JMP entry.
  `layouts/research/list.html` shows the button only when the field is set. The label is fixed
  ("Interactive results"), the ▶ is hidden from screen readers. Outlined in the page's DML
  blue `#2a78d6`, rounded, small type, light blue fill on hover and keyboard focus.
- The data file holds only what the page uses (Tables 2, 3 and 15) plus a `_source` entry
  naming the draft date and table numbers.
- The sample's checking script (13 scenes, numbers and no blanks) is run during the build
  check but not committed. The site has no test setup and this is one page.
- A `WORKFLOW.md` Decision Log row records the page, the button field and the upkeep rule
  in section 8.

**Changed after the final reviews and the owner's look (2026-11-14)**

- The owner's wording. Every control is a named level: Spread of X, Instrument nonlinearity,
  Outcome nonlinearity and Treatment effect nonlinearity are "low / high"; Difference between
  sample and target is "none / moderate / strong". Pressing a button shows one line on what
  that level means and names the paper's design label ("linear", "cubic", "step"). "Straight"
  became "linear" everywhere, and the page carries no Greek symbols because the paper's
  notation is changing between drafts.
- The instrument's low level is never called linear. The paper (p. 29) says the "linear" label
  refers to the index inside the logistic link, and the probability of getting the instrument
  is nonlinear in X even then. Every number is unchanged.
- A wording review against the paper, approved by the owner: outcome levels describe only the
  part of the outcome that depends directly on X (eq. 34); the Card note no longer says
  "doubled" (footnote 10); negative totals compare "in size"; DML's definition names the
  outcome, treatment and instrument (p. 20); the Card tabs say the instrument and outcome stay
  as calibrated (Table 3 notes); "DML's flexibility does not help with this error" replaces
  "DML has no advantage here".
- A value label that a neighbouring bar partly covered (I2SLS total, −16.769, on the opening
  scene) is drawn on top of the bars with a white halo.
- Accessibility: grey text darkened to 5.0:1, toggle buttons instead of half-built tabs, focus
  kept on Card-part presses, chart bars announced, controls hidden when JavaScript is off, ▶ and
  ↗ forced to text style. Search data carries `date: 2026-11-14`.

## 6. Verification

1. `hugo --gc --minify` exits 0.
2. `public/jmp-results/index.html` exists. On `/research/` the button appears once, on the
   JMP entry, and points to `/jmp-results/`.
3. The page's script parses, and the 13-scene check reports all clean against the data the
   built page actually carries.
4. The built page loads no outside script, style or font, and contains neither "Sample
   wording" nor "not on the website yet".
5. `academic-web-reviewer` runs; CRITICAL and WARNING items are fixed.
6. A look at the real pages. The sandbox cannot run a local server, so I'll ask the owner to
   start `hugo server` in their own terminal, then look at `/jmp-results/` and `/research/`
   through Chrome at laptop width and at phone width (375px). If the owner prefers, they check
   on their own phone after the push instead.
7. Commit after the owner has seen it. Push only on the owner's yes.

## 7. Left to the builder

- How the page's styles are scoped so the theme's rules for paragraphs, lists, tables and
  `<details>` do not change the figures, and the page's rules do not leak onto other pages.
- How the data reaches the script (inline JSON in the page or a fingerprinted file).
- Small spacing between the site header and the page's own title.

## 8. Upkeep

The page states which draft its numbers come from. When the JMP PDF on the site is replaced,
compare Tables 2, 3 and 15 of the new draft with `data/jmp_results.json`, update the data and
the footer's draft date if they differ, and rerun the checks in section 6. The `/new-paper`
skill does not know about `params.interactive`; `.claude/skills` is write-protected in the
sandbox, so the owner can add a line there if wanted.
