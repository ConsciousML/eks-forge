---
name: reviewing-doc-pr
description: Reviews one eks-forge doc pull request and the submodule pull requests it bumps, read-only. Use when asked to review a docs pull request.
---

# Reviewing a Doc Pull Request

Review one eks-forge pull request (PR) and the submodule PRs it bumps. Report findings, and change
nothing: no edits, commits, pushes, comments, reviews, or merges.

Run git in a submodule from its directory (`cd site/docs/_external/<repo> && git ...`), and `gh`
from the target repo's directory, as `github-workflow` says.

## 1. Gather

From the eks-forge root:
```bash
gh pr view <N> --json title,body,isDraft,labels,headRefName,createdAt,commits,files,statusCheckRollup
gh pr diff <N>
```

The submodule PRs are the `<owner>/<repo>#<N>` references in the body, the PRs whose head
commit a `site/docs/_external/<repo>` pointer in the diff points to, and the open PRs that say
they are part of the same issue. Take the issue from `Closes #<issue>` in the body, then list those
PRs from each submodule directory (`eks-forge-catalog`, `eks-forge-live`, `eks-forge-app-of-apps`):
```bash
cd site/docs/_external/<repo> && gh pr list --state open --search "\"eks-forge#<issue>\" in:body" --json number,title,headRefOid,body
```
Also list the other open eks-forge PRs on the issue, and ignore `<N>` itself:
```bash
gh pr list --state open --search "\"#<issue>\" in:body" --json number,title
```
Review them all as one change. For each submodule PR, from its directory:
```bash
cd site/docs/_external/<repo> && gh pr view <N> --json title,body,isDraft,labels,headRefName,headRefOid,createdAt,commits,files,state
cd site/docs/_external/<repo> && gh pr diff <N>
```

Read files from the PR branches, never from the working tree, which may be on another branch or
dirty:
```bash
git fetch origin <branch>
git show FETCH_HEAD:<path>
git show origin/main:<path>
```

## 2. Workflow

Check each PR against steps 4 and 5 of `github-workflow`:
- The draft state of each PR. Report it in the status block, not as a finding.
- The eks-forge body has `Closes #<issue>`. Each submodule body has
  `Part of <owner>/<repo>#<issue>`, with the same issue.
- The eks-forge body names each submodule PR it bumps.
- Each sibling PR found by the issue search is named in the eks-forge body and pointed to by a
  submodule pointer in the diff. Report one that isn't. No sibling found is not a finding.
- Each submodule PR was opened before the eks-forge PR (`createdAt`).
- Each submodule pointer in the eks-forge diff equals the `headRefOid` of its submodule PR.
- Each PR title is its main commit subject. Each commit follows `<commits>` in `system.xml`:
  Conventional Commits, subject line only, no co-author trailer.
- A live PR that touches only docs has the `skip-cd` and `skip-terratest` labels.
- Failing checks in `statusCheckRollup`. `submodules-on-main` fails while a submodule PR is
  unmerged: report it in the status block with the PR it waits for.

## 3. PR Body Against the Diff

For each bullet of each PR body, find the change in the diff that backs it. Report bullets that no
change backs, and changes in the diff that no bullet covers.

## 4. Claims Against Sources

Load `cross-repo-aggregated-docs` before reading sibling docs.

List each factual claim the diffs add: names, variables, secrets, roles, job and step names, file
paths, defaults, and behaviour. Check each one against its source: the code, workflow, Terraform
module, or stack file of the repo that owns it, on the PR branch when a PR in this review changes
it, and on `main` otherwise. Report each claim the source contradicts or doesn't support.

## 5. Page Checks

Load `documentation-map`. For each page the diffs touch (the wrapper and its `_external` source):
- Read the siblings with the same `diataxis-tag`, following wrappers to their `_external` source.
  Report where the page breaks their structure or style.
- Check each added or changed link against `linking-doc-pages`.
- Check the front matter against `<documentation_map>` in `system.xml`: `title` (or an H1),
  `diataxis-tag`, and `description` are set, and the description still matches the page.

## 6. Report

List the findings, most severe first, one line each:
```
<repo>:<file>:<line>: <what's wrong>. Checked against <source path@ref, or the rule>.
```

Take the line from the file on the PR branch. A finding about a PR body uses `PR body` as the file
and the bullet number as the line.

Then a status block, one line per PR: its link, draft state, and failing checks.

When step 4 finds nothing, say `No wrong claim.` explicitly.
