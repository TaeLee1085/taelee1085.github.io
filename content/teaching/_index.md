---
title: "Teaching"
description: "Teaching and teaching assistant experience of Kyungtae (Tae) Lee in economics and statistics at Brooklyn College, Baruch College, The City College of New York, the CUNY Graduate Center, Hunter College, and New York University."
# Load-bearing build settings. Each was tested by deletion; every failure is SILENT
# (build exits 0, no warning). Do not remove any of these without re-testing:
#   outputs: ["html"]     Without it, an RSS index.xml reappears for this section, with
#                          empty <link/> elements on every item.
#   _target: {kind: page} Without it, this section's own /teaching/ page (this file's
#                          rendered output) disappears entirely from the site and the
#                          sitemap.
#   build.render: never   Without it, each individual entry under content/teaching/
#                          gets its own rendered page/URL (e.g. /teaching/<slug>/)
#                          instead of only appearing inlined into this list page.
#   build.list: local     Without it, individual entries leak into the site-wide RSS feed.
outputs: ["html"]
cascade:
  - _target:
      kind: page
    build:
      render: never
      list: local
---
