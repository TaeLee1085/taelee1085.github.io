---
title: "Research"
description: "Research by Kyungtae (Tae) Lee: job market paper on clean energy access, labor supply, and gender differences in Nepal; published work on external validity in instrumental variable settings and on household cookstove choice; working papers on carbon pricing and clean energy access."
# Load-bearing build settings. Each was tested by deletion; every failure is SILENT
# (build exits 0, no warning). Do not remove any of these without re-testing:
#   outputs: ["html"]     Without it, an RSS index.xml reappears for this section, with
#                          empty <link/> elements on every item.
#   _target: {kind: page} Without it, this section's own /research/ page (this file's
#                          rendered output) disappears entirely from the site and the
#                          sitemap.
#   build.render: never   Without it, each individual paper under content/research/
#                          gets its own rendered page/URL (e.g. /research/<slug>/)
#                          instead of only appearing inlined into this list page.
#   build.list: local     Without it, individual papers leak into the site-wide RSS feed.
outputs: ["html"]
cascade:
  - _target:
      kind: page
    build:
      render: never
      list: local
---
