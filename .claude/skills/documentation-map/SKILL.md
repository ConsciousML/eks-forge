---
name: documentation-map
description: Map of every EKS Forge site page. Read before searching, writing, editing, or removing docs.
---

Read `documentation-map.csv` at the repo root. It has one row per site page: its `route`, `type`
(Diataxis), `title`, `description`, and `source`.

Use it as a map:
- Find the pages related to your task and read them before you write.
- Link to the page that owns a concept, a prerequisite, or a next step instead of explaining it
  again. Take the link from `route` and its text from `title` (see the `linking-doc-pages` skill).
- When `source` is set, the page imports its content from those files (space separated): read
  them instead of opening the page to find them. When it is empty, the content is in the page's
  own file.
- Before renaming or removing a page, search `site/docs/` for its `route` and fix the links to it.

Never edit the CSV (see `<documentation_map>` in `system.xml`).
