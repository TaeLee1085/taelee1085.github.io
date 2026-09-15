---
title: "Research"
description: "Kyungtae (Tae) Lee's research: a job market paper on machine learning and the external validity of IV estimates, plus work on clean energy and carbon pricing."
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
