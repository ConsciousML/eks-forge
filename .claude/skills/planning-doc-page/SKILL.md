---
name: planning-doc-page
description: What a plan for an EKS Forge doc page must contain. Use when asked to plan a doc page, or when in plan mode for one, before writing the plan.
---

# Planning a Doc Page

A plan for a doc page has two parts, in this order. Write both, even when the user only asks for
"a plan".

## 1. GitHub Workflow

Load the `github-workflow` skill and plan every one of its steps, from the issue to the merge and
the worktree cleanup. Don't stop at the branches.

- Fill in what's already known: the issue number, the branch name, the repos touched, each commit
  subject, each PR title and body, and the merge subjects.
- Keep each **Wait** of the skill, at its step.
- Say which steps are skipped and why (e.g. the issue already exists).
- Put the implementation between the branches and the commits, pointing at part 2.

## 2. Doc Plan

Follow steps 1 to 3 of the `drafting-doc-page` skill: gather context, settle the design decisions
with the user, then write the outline as the page's headings with one bullet per paragraph, idea,
or code block.

Also give:
- The Diataxis type and why.
- Where the page lives: its source file, and its wrapper if the source is in a sibling repo.
- The facts checked against the code, and what's left to verify while drafting.
- How to verify the result (the site build, the links).
