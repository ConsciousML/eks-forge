---
name: drafting-doc-page
description: Workflow for drafting a single EKS Forge doc page with the user, from design discussion to outline to writing it one bullet per edit, then aligning its prose with the reference pages. Use when asked to write, draft, or fill in a doc page on the site, including pages sourced from sibling repos under site/docs/_external/.
---

# Drafting a Doc Page

Write pages with the user, not for them. The user reviews every change through edit approvals, so keep each change small.

## 1. Gather context
- Read the pages and sources the user points to first.
- Load the `writing-doc-with-diataxis` skill.
- If the page comes from a sibling repo, load the `cross-repo-aggregated-docs` skill.
- A sibling repo doc is legacy if the eks-forge site doesn't import it, or imports it from a wrapper without a `diataxis-tag`. Don't take its claims for granted: check them against the code.

## 2. Discuss the design
- Propose what the page should cover and in which order. Make no edits yet.
- Flag gaps, wrong ordering, and content that belongs to another documentation type.
- Settle every design decision with the user before writing.

## 3. Write the outline
- Write the plan as the page's section headings, with one short bullet per paragraph, idea, or code block.
- Wait for the user's approval.

## 4. Write the page, one bullet per edit
- If the page is sourced from a sibling repo, create its wrapper under `site/docs/` first,
  so the user can watch each edit live on the dev server.
- Make one Edit per outline bullet, in order.
- An accepted edit means continue: go straight to the next bullet without commenting.
- A rejected edit comes with feedback: apply it, then resume.
- Stop to talk only for a meaningful design decision.
- Never batch several bullets into parallel edits, and never commit before step 5 is done.

## 5. Align the prose with the references (required)
Once every bullet is written, spawn a subagent to run the `aligning-doc-prose` skill. Don't run it
yourself. Spawn it with `subagent_type: general-purpose` and `model: sonnet`, and this prompt,
filling in the brackets:

```text
Run the `aligning-doc-prose` skill (load it with the Skill tool) on the EKS Forge repo at
<repo root>.

Pages to align:
- <source path> (<diataxis type>), wrapper <wrapper path>
- <other edited file>: only the hunks in `git -C <repo> diff -- <file>`

References to read first (don't search for others):
- <sibling source path>
- ...

Keep these unchanged: <headings or anchors other pages link to>.

Don't commit, push, or build.
```

List as references the sources of the siblings with the same `diataxis-tag` in the page's
category, which you read in step 1. After it reports, review its edits before committing.
