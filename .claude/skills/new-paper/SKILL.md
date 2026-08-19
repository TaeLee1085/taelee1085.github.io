---
name: new-paper
description: Add one research paper (job market paper, working paper, work in progress, or publication) to the Research section of the personal academic website, with correct front matter, ordering, and links. Use when the user wants to add or update a paper on the site.
---

# New Paper — Research Entry Recipe

Adds one paper to the Research section (`/research/`) the same way every time, enforcing
this project's rules (see `CLAUDE.md`). The section already has a working template
(`layouts/research/list.html`) — this skill is about writing a correct content file for
it, not building new layout.

## Rules this skill always enforces (from CLAUDE.md)

- **Academic accuracy first.** Never invent the title, coauthors, year, venue, or links.
  Use only what the user provides/confirms. If a field is unknown, ask — do not guess.
- **JMP front and center.** The job market paper's status group (`jmp`) is listed first
  on the page, ahead of Publications, Working Papers, and Work in Progress.
- **No broken or placeholder links.** If a link isn't ready, omit the `link` param
  entirely so the title renders as plain text — never link to `#` or write "coming soon".
- Light theme, mobile-responsive, site must still build
  (`hugo --gc --minify --cacheDir "$TMPDIR/hugocache"`).

## Inputs (ask for any not given, one at a time)

1. **Title** (exact) — becomes the front-matter `title`.
2. **Status** — one of `jmp`, `published`, `working`, `wip`. Determines which group on
   `/research/` the entry appears in (see `layouts/research/list.html`). **Only these
   four values render anything.** `layouts/research/list.html` filters by exact match
   against a fixed `$groups` slice, so any other value — e.g. `forthcoming`, a completely
   natural thing to write for an R&R — builds clean, exits 0, emits no warning, and the
   paper simply does not appear anywhere on the page.
3. **Year** — optional. Only renders in the byline if `venue` is also set (see Step 5
   below), so it's meaningful mainly for `published` entries.
4. **Coauthors** — a list of names, in the order they should appear, **excluding
   Kyungtae Lee**. Omit the key entirely for a solo paper.
5. **Venue** — only for `published` entries. Required for `year` to display at all.
6. **Link** — the href behind the title. Hosted PDF for the JMP, a DOI or journal page
   for `published`, an SSRN link for `working`. **Omit entirely if there's no link yet**
   — do not use `#` or a placeholder.
7. **Presentations** — optional list of strings (conference talks, posters). These may
   contain raw HTML, e.g. a link to a poster PDF — see Step 6.
8. **Abstract** — the page body (markdown after the front-matter fence). Omit entirely
   (leave the body empty) to withhold the abstract.

## Steps

1. Choose a slug: `content/research/<short-topic-slug>.md`, kebab-case, no year prefix
   (existing entries are named like `carbon-pricing-abatement-seven-cities.md`, not
   `2026-carbon-pricing...md`).

2. If a PDF needs hosting, place it at `static/<filename>.pdf` — site root, no `papers/`
   subdirectory (see `static/kyungtae-lee-jmp.pdf`,
   `static/from-one-late-to-another-poster.pdf`) — and link it site-relative with a
   leading slash, e.g. `link: "/kyungtae-lee-jmp.pdf"`. For a DOI, journal page, or SSRN
   URL, use it directly as `link`.

3. Write the front matter:

   ```yaml
   ---
   title: "<title>"
   weight: <n>
   params:
     status: <jmp|published|working|wip>
     year: <YYYY>                        # optional; only shown if venue is also set
     coauthors: ["<name>", "<name>"]      # omit entirely if solo
     venue: "<venue>"                     # published only
     link: "<href>"                       # omit entirely if none — never "#"
     presentations:
       - "<presentation text, may include raw HTML>"
   ---

   <abstract markdown, or leave the body empty to omit it>
   ```

4. **`weight` must be a top-level key**, a sibling of `title` — never nested under
   `params:`. It orders entries **only within their status group** (e.g. among the
   `working` papers); it cannot move an entry into a different group or reorder the
   groups themselves. Group order is fixed by the `$groups` slice in
   `layouts/research/list.html` (currently jmp → published → working → wip) — don't try
   to change it by editing weights. If `weight` is accidentally nested under `params:`,
   Hugo's `.Weight` silently stays `0`. The template sorts each group ascending with the
   generic `sort … "Weight"` (not Hugo's `ByWeight`), so a `0` sorts **first**, not
   last — the mis-weighted entry jumps to the top of its group, ahead of every correctly
   weighted entry including the flagship one. No build error, no warning. (Verified
   empirically: a test entry with `weight` nested under `params:` rendered above both
   existing Working Papers entries.)

5. `year` renders in the byline only when `venue` is also set — the template pairs them
   as "*Venue*, Year" and drops `year` entirely if `venue` is empty. This is why the JMP
   entry (which has a `year` but no `venue`) shows no year on the page — that's expected,
   not a bug. Don't try to force a lone year to display; the template doesn't support it.

6. Coauthor and venue text passes through Hugo's `safeHTML` so the surrounding `<em>`
   markup and the " · " joiner render correctly. That means: **don't put a raw `<`, `>`,
   or an `&` immediately followed by a letter/digit (e.g. "AT&T") in a coauthor name or
   venue.** It will render broken or ambiguous, with no build error. If such a name is
   unavoidable, HTML-escape it by hand (e.g. `AT&amp;T`) or ask the user how they want it
   shown. `presentations` entries are also passed through `safeHTML`, but on purpose —
   that's how the existing poster-link presentation embeds an `<a>` tag.

7. Verify: run `hugo --gc --minify --cacheDir "$TMPDIR/hugocache"` — must exit 0.
   Confirm `public/research/<slug>/` was **not** created as its own directory (individual
   research pages are `build.render: never` via `content/research/_index.md`'s cascade —
   they only ever appear inlined into `/research/`, never at their own URL). If a `link`
   points at a local file, confirm that file exists under `public/`. Then also:
   `rm -rf public`, build **unminified**
   (`hugo --cacheDir "$TMPDIR/hugocache"`), and
   `grep -q "<exact title>" public/research/index.html`, failing loudly if absent —
   because a `status:` value outside `jmp|published|working|wip` builds clean with zero
   errors while silently rendering nothing (see Step 2).

8. Run the `academic-web-reviewer` agent on the change; fix CRITICAL/WARNING items.

9. Show the user the rendered entry (`hugo server -D`) and commit once approved.

## Notes

- The layout for `/research/` already exists at `layouts/research/list.html` — adding an
  entry never requires new layout work. Only use `brainstorming → writing-plans` if the
  user wants to change how the section itself is structured or styled (e.g. a new status
  group, a different byline format) — not for adding a paper.
