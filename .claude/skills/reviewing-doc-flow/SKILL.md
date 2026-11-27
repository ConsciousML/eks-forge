---
name: reviewing-doc-flow
description: Second stage of a doc pull request review, read-only. Reads each page one eks-forge doc pull request and its submodule pull requests change, in full, and checks a reader can use it, by its Diataxis type. Use when asked to check the flow, style, or structure of the pages in a docs pull request.
---

# Reviewing the Flow of a Doc Pull Request

Check that a reader can use each page one eks-forge pull request (PR) and the submodule PRs it bumps
change: its flow, its writing style, and its structure and links. Report findings, and change
nothing: no edits, commits, pushes, comments, reviews, or merges. `reviewing-doc-facts` checks that
the change is correct and complete.

Load `writing-doc-with-diataxis`, `aligning-doc-prose`, `cross-repo-aggregated-docs`, and
`documentation-map`.

## 1. Gather

Run step 1 of `reviewing-doc-facts`, unless it already ran in this review. Read files from the PR
branches as it says.

## 2. List the Pages

List every page the PRs change: the files the eks-forge diff changes under `site/docs/` outside
`site/docs/_external/`, plus each submodule file that a submodule PR diff or a submodule pointer
bump changes and that the `source` column of `documentation-map.csv` lists as
`site/docs/_external/<repo>/<path>`. Pages import submodule files outside `docs/` too, such as
READMEs under `live/bootstrap/`, `pipelines/`, `modules/`, `charts/`, and `manifests/`. A `<...>`
placeholder in a `source` path, such as `charts/<chart path>/README.md`, matches one or more path
segments. For a bump, take the old and new commit from the eks-forge diff, then list the files
between them from the submodule's directory:
```bash
git diff origin/main...origin/<branch> -- site/docs/_external/<repo>
cd site/docs/_external/<repo> && git fetch origin main && git diff --name-only <old> <new>
```

When the list is empty, stop the flow stage and report `No page changed.`

Match each wrapper to its `_external` source with the `source` column of `documentation-map.csv`,
and add the other half of each pair. Read every page in full on its PR branch, or at the new commit
for a bump, not only the diff: a page that changed upstream reaches the site through the bump, and
no other review reads it whole.

## 3. Flow

Read the page as its reader would, in order, and check it against its `diataxis-tag`:
- **tutorial:** a beginner can follow it end to end. Each step uses only what earlier steps
  produced, and every step shows a visible result.
- **how-to:** one task. The prerequisites are stated up front. The steps follow the order of the
  real workflow, no step assumes a later one, and every section serves the task.
- **explanation:** it answers why, builds from context to detail, and doesn't turn into steps or
  reference.
- **reference:** complete, consistent and easy to scan, with no instructions or reasoning mixed in.

## 4. Writing Style

Read the siblings with the same `diataxis-tag`, following wrappers to their `_external` source.
Check the prose of each page against `aligning-doc-prose` and those siblings, bullet by bullet.

## 5. Structure and Links

For each page:
- Report where the page breaks the structure of its siblings.
- Check each added or changed link against `linking-doc-pages`.
- Check the front matter against `<documentation_map>` in `system.xml`: `title` (or an H1),
  `diataxis-tag`, and `description` are set, and the description still matches the page.

## 6. Report

List the findings, most severe first, in the findings format of `reviewing-doc-facts`. For each
break in flow, name the section and what a reader would get stuck on:
```
<repo>:<file>:<line>: <section>: <what's wrong, and what a reader gets stuck on>. Checked against <the rule>.
```

Then list the pages read in step 2, or `No page changed.`
