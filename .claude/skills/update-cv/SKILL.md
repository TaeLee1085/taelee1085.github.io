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
   git commit -m "Update CV PDF

   Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
   ```
