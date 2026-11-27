---
name: reviewing-doc-pr
description: Reviews one eks-forge doc pull request and the submodule pull requests it bumps, read-only. Use when asked to review a docs pull request.
---

# Reviewing a Doc Pull Request

Review one eks-forge pull request (PR) and the submodule PRs it bumps, in two stages. Report
findings, and change nothing: no edits, commits, pushes, comments, reviews, or merges.

1. Load `reviewing-doc-facts` and run it: is the change correct and complete?
2. Load `reviewing-doc-flow` and run it: can a reader use each page? Skip its step 1, which the
   first stage ran.

Facts come first, since a flow review of wrong content is wasted. Both stages always run, even
when the first finds a severe problem. When the caller asks for one stage only, run that skill
alone.

## Report

Merge the findings of both stages into one list, most severe first, in the findings format of
`reviewing-doc-facts`. Then add, from `reviewing-doc-facts`, the status block, `No wrong claim.`
when no claim is wrong, and the coverage searches, and from `reviewing-doc-flow`, the pages read,
or `No page changed.`
