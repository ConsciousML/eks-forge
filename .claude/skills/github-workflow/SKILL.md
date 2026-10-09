---
name: github-workflow
description: GitHub process for an EKS Forge change spanning eks-forge and its submodules, from issue to merge. Use when starting a change that needs an issue or branches, or when asked to commit, push, open PRs, merge PRs, or bump submodules.
---

# GitHub Workflow

Repos: eks-forge and its submodules under `site/docs/_external/` (`eks-forge-catalog`,
`eks-forge-live`, `eks-forge-app-of-apps`).

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

Use the same kebab-case branch in eks-forge and in each submodule the change touches (never `/` in
branch names, it breaks Terragrunt).

**Wait**: ask the user whether to work in a git worktree, so other sessions can keep working in the
main checkout on other branches. When running autonomously, don't create one unless the user asked.

Without a worktree, create the eks-forge branch in place:
```bash
git checkout main && git pull && git checkout -b <branch>
```

With a worktree, create it with the branch, then switch the session into it with the
`EnterWorktree` tool (`path: .claude/worktrees/<branch>`) and initialise its submodules:
```bash
git fetch origin main
git worktree add .claude/worktrees/<branch> -b <branch> origin/main
git submodule update --init
```

Either way, then create the branch in each touched submodule:
```bash
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

Before the first push of a branch, in eks-forge and in each touched submodule, replay it on the
latest `main`:
```bash
git fetch origin main
git rebase origin/main
```

Never merge `main` into a PR branch: the merge commit ends up in `main`'s history and pollutes
`git log --merges`. If `main` moves after the branch is pushed and the branch needs it (a
conflict, or a file `main` removed), rebase again and push with `git push --force-with-lease`.
Never use a plain `--force`.

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

If the work was done in a worktree, `main` is checked out elsewhere, so skip the pull there.
**Wait** for the user to confirm the worktree can go, then leave it with the `ExitWorktree` tool
(`action: keep`) and, from the main checkout:
```bash
git worktree remove --force .claude/worktrees/<branch>
git branch -D <branch>
git pull   # only if the main checkout is on main
```

`--force` is needed because the worktree holds submodules. It discards anything uncommitted or
unpushed in the worktree and its submodules, so check `git status` in each first.
