---
name: drafting-doc-page
description: Workflow for drafting a single EKS Forge doc page with the user, from design discussion to outline to writing it one bullet per edit, then reviewing it against the reference pages. Use when asked to write, draft, or fill in a doc page on the site, including pages sourced from sibling repos under site/docs/_external/.
---

# Drafting a Doc Page

Write pages with the user, not for them. The user reviews every change through edit approvals, so keep each change small.

## 1. Gather context
- Read the pages and sources the user points to first.
- Load the `writing-doc-with-diataxis` skill and read the tagged examples for the page's type.
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
- Write only what the bullet says. Don't add trade-offs or discussions the outline doesn't have.
- Take definitions and claims from the code or a cited reference, not your own framing. When a
  reference defines a term, follow its wording.
- An accepted edit means continue: go straight to the next bullet without commenting.
- A rejected edit comes with feedback: apply it, then resume.
- Stop to talk only for a meaningful design decision.

## 5. Review against the references
Once every bullet is written, and before committing:
- Re-read the tagged examples of the page's type, starting with the siblings in the same category.
- Compare the page to them, section by section:
  - Sentence shape: subject and verb first, no fragments, no sentence opening on a bare noun
    phrase ("A ratio, not a count, ...").
  - Recurring markers: "This page explains ...", "The trade-off is ...", "That's why ...",
    "(see [link])".
  - Vocabulary: one term per concept across the page.
  - Intro, headings, and link style.
- Check that every claim traces to the code or to a cited reference. Quote the reference's
  wording, or cut the claim.
- Report the findings to the user as `section: issue, fix`, then apply the accepted ones, one
  Edit per finding.
