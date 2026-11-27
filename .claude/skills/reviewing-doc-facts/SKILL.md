---
name: reviewing-doc-facts
description: First stage of a doc pull request review, read-only. Checks that one eks-forge doc pull request and the submodule pull requests it bumps are correct and complete. Use when asked to check the workflow, the PR body, the claims, or the coverage of a docs pull request.
---

# Reviewing the Facts of a Doc Pull Request

Check that one eks-forge pull request (PR) and the submodule PRs it bumps are correct and complete:
the workflow, the PR bodies, the claims, and the coverage. Report findings, and change nothing: no
edits, commits, pushes, comments, reviews, or merges. `reviewing-doc-flow` checks whether a reader
can use each page.

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
dirty. Name refs as `origin/<branch>`, never `FETCH_HEAD`, which parallel review agents overwrite:
```bash
git fetch origin <branch>
git show origin/<branch>:<path>
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
change backs, and changes in the diff that no bullet covers. Skip the eks-forge body's `## Coverage`
section: step 5 checks it.

## 4. Claims Against Sources

Load `cross-repo-aggregated-docs` before reading sibling docs.

List each factual claim the diffs add: names, variables, secrets, roles, job and step names, file
paths, defaults, and behaviour. Check each one against its source: the code, workflow, Terraform
module, or stack file of the repo that owns it, on the PR branch when a PR in this review changes
it, and on `main` otherwise. Report each claim the source contradicts or doesn't support.

## 5. Coverage

Load `documentation-map`. List what the issue and the sibling PRs say changed, then find what the
diffs leave stale:
- Read the pages related to each change in `documentation-map.csv`.
- Search the four repos (docs, READMEs, `.md.gotmpl` files, code comments) for the old wording and
  the related concepts: eks-forge from its root, and each submodule from
  `site/docs/_external/<repo>`. In each, search `origin/<branch>` when a PR in this review changes
  that repo, and `origin/main` otherwise.
- List the files on the ref with a line matching a pattern, one command per pattern (the hash is
  git's empty tree). It searches tracked files only, so it skips `.claude/worktrees/`,
  `site/node_modules`, `site/build`, and the submodules, which you search from their directory:
  ```bash
  git diff --name-only -G'<pattern>' 4b825dc642cb6eb9a060e54bf8d69288fbee4904 <ref>
  git ls-tree -r --name-only <ref> | grep -e README -e '\.md\.gotmpl$'
  ```
- Read each hit on the ref, and the unchanged lines of each file the PRs edit
  (`git diff --name-only origin/main...<ref>`):
  ```bash
  git show <ref>:<path> | grep -n -e <old> -e <concept>
  ```
- Under `review-agent`, `.claude/hooks/read-only-bash.sh` blocks `git grep`, and any command with
  `>`, `$(`, `<(` or a backtick. It splits commands on `&&`, `||`, `;`, `|` and `&`, and blocks a
  part that doesn't start with an allowed command, so a pattern can't hold those characters: use one
  `-G` or `-e` per pattern, not `\|` alternation.
- Check each claim of the eks-forge body's `## Coverage` section: the passages it lists are fixed in
  the diffs or left out with a reason, and its searches would find the hits above.
- Report each stale passage outside the diffs, and each point of the issue that no change covers,
  in the findings format.

## 6. Report

List the findings, most severe first, one line each:
```
<repo>:<file>:<line>: <what's wrong>. Checked against <source path@ref, or the rule>.
```

Take the line from the file on the PR branch. A finding about a PR body uses `PR body` as the file
and the bullet number as the line.

Then a status block, one line per PR: its link, draft state, and failing checks.

When step 4 finds nothing, say `No wrong claim.` explicitly.

Then list the searches run in step 5, so the coverage can be checked.
