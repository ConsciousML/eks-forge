---
name: github-workflow
description: GitHub process for an EKS Forge change spanning eks-forge and its submodules, from issue to merge. Use when starting a change that needs an issue or branches, or when asked to commit, push, open PRs, merge PRs, or bump submodules.
---

# GitHub Workflow

Repos: eks-forge and its submodules under `site/docs/_external/` (`terragrunt-template-catalog-eks`,
`terragrunt-template-live-eks`, `argocd-app-of-apps-template`).

Steps marked **Wait** need the user. Never move past a wait on your own, unless the user asked to
run the whole workflow autonomously. Then skip the waits, and replace each CI wait with
`gh pr checks <N> --watch`, stopping on any failure.

Never hardcode a GitHub owner, these repos are forked. Run `gh` from the target repo's directory so
it infers the repo from `origin`. Read the owner with `gh repo view --json owner -q .owner.login`
when you need a cross-repo reference (`<owner>/<repo>#<N>`).

## 1. Issue

Skip if the user gives an existing issue.

1. Read similar issues in the repo that owns the work, and match their title and body style:
   ```bash
   gh issue list --state all -L 10
   gh issue view <N>
   ```
2. Draft a minimal issue: a title, and a body of one or two sentences or a few bullets saying what
   changes and where. No implementation detail the user didn't give.
3. **Wait** for the user to validate the draft.
4. Post it with `gh issue create --title "<title>" --body "<body>"` and report the link.

## 2. Branches

Create the same kebab-case branch in eks-forge and in each submodule the change touches (never `/`
in branch names, it breaks Terragrunt):
```bash
git checkout main && git pull && git checkout -b <branch>
git -C site/docs/_external/<repo> checkout main
git -C site/docs/_external/<repo> pull
git -C site/docs/_external/<repo> checkout -b <branch>
```

Implementation is not part of this skill.

## 3. Commit and Push

**Wait** for the user to ask.

- Commit inside each touched submodule first, then push it with `git push -u origin <branch>`.
- Then commit in eks-forge with the submodule pointers staged in the same commit as the change
  that uses them, and push.
- Conventional Commits, subject line only (see `<commits>` in `system.xml`).

## 4. Pull Requests

**Wait** for the user to ask.

Open one PR per touched submodule first, then the eks-forge PR, so it can reference them:
```bash
gh pr create --title "<title>" --body "<body>"
```

- Title: the main commit subject.
- Body, in the issue's repo: `Closes #<issue>`, then one or two lines or bullets.
- Body, in the other repos: `Part of <owner>/<repo>#<issue>`, then one or two lines or bullets.
- The eks-forge body names the submodule PRs it bumps to as `<owner>/<repo>#<N>`.

Report the PR links.

## 5. Merge the Submodule PRs

**Wait** for the user to say the submodule CI passed. Then, from each submodule's directory:
```bash
gh pr merge <N> --merge --subject "<PR title> #<N>" --body "" --delete-branch
```

Merge commit (not squash), subject `<PR title> #<N>`, empty body, head branch deleted.

## 6. Bump the Submodules

Point each merged submodule at its `main`:
```bash
git -C site/docs/_external/<repo> checkout main
git -C site/docs/_external/<repo> pull
```

Commit in eks-forge as `docs: bump submodules` and push to the eks-forge PR branch.

## 7. Merge the eks-forge PR

**Wait** for the user to say the eks-forge CI passed. Check no submodule still points at a branch
commit (each must print `ok`):
```bash
git submodule foreach -q 'git fetch -q origin main && git merge-base --is-ancestor HEAD origin/main && echo "$name ok"'
```

Then merge with the same command and style as step 5, and pull `main`.
