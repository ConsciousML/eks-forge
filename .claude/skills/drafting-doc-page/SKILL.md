---
name: drafting-doc-page
description: Workflow for drafting a single EKS Forge doc page with the user, from design discussion to outline to writing it one bullet per edit. Use when asked to write, draft, or fill in a doc page on the site, including pages sourced from sibling repos under site/docs/_external/.
---

# Drafting a Doc Page

Write pages with the user, not for them. The user reviews every change through edit approvals, so keep each change small.

The `mode` is `autonomous` when the caller's prompt says so (e.g. the `pr-agent` subagent), and
`interactive` otherwise. In autonomous mode, the user reviews the page in the pull request instead.

## 1. Gather context
- Read the pages and sources the user points to first.
- Load the `writing-doc-with-diataxis` skill.
- If the page comes from a sibling repo, load the `cross-repo-aggregated-docs` skill.
- A sibling repo doc is legacy if the eks-forge site doesn't import it, or imports it from a wrapper without a `diataxis-tag`. Don't take its claims for granted: check them against the code.

## 2. Discuss the design
- Propose what the page should cover and in which order. Make no edits yet.
- Flag gaps, wrong ordering, and content that belongs to another documentation type.
- autonomous: decide from the caller's spec, and list each decision in the PR body.
- interactive: settle every design decision with the user before writing.

## 3. Write the outline
- Write the plan as the page's section headings, with one short bullet per paragraph, idea, or code block.
- autonomous: continue to step 4.
- interactive: wait for the user's approval.

## 4. Write the page, one bullet per edit

autonomous: write the page from the outline in one pass. The rest of this step
is interactive.

- If the page is sourced from a sibling repo, create its wrapper under `site/docs/` first,
  so the user can watch each edit live on the dev server.
- Make one Edit per outline bullet, in order.
- An accepted edit means continue: go straight to the next bullet without commenting.
- A rejected edit comes with feedback: apply it, then resume.
- Stop to talk only for a meaningful design decision.
- Never batch several bullets into parallel edits.

