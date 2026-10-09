---
name: linking-doc-pages
description: Read before writing or editing a link in EKS Forge docs.
---

Rules 1 and 2 pick the style by whether the reader is sent away. They apply to external links too.

1. **Inline term**: the link defines a term the reader can skip. Link the term itself, lowercase.
   The linked words must name what the target covers.
   - Good: ``the [`dev` environment](/docs/iac/#dev)``
   - Bad: `[environment's stack file](/docs/iac/#environments)` (target covers environments, not a stack file)

2. **Named page or section**: the reader is sent to read or do something ("see ...",
   prerequisites, next steps). Use the target's title in Title Case, shortened to the words
   that identify it. Drop framing like "How to" or "Add, Edit, or Remove", but keep the
   title's own words, never rephrase.
   - `see [Edit the Live Configuration](/docs/iac/edit-live-configuration/)` (title: How to Edit the Live Configuration)
   - `see [How Pods Are Scheduled](/docs/compute/how-pods-are-scheduled/)` (already short)
   - External pages may use a descriptive name instead of their title: `follow [GitHub's SSH guide](https://docs.github.com/...)`

   Never put the verb inside the link: `follow the [...]`, not `[follow the ...]`.

3. **File or directory**: when the reader is sent to a file, link text is the path in backticks,
   pointing to the file on GitHub. A term in prose that points to a file follows rule 1 instead.
   - ``see [`charts/monitoring/alloy/values.yaml`](https://github.com/ConsciousML/eks-forge-app-of-apps/blob/main/charts/monitoring/alloy/values.yaml)``
   - `units, defined in the [stack file](https://github.com/.../terragrunt.stack.hcl)` (rule 1)
