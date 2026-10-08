---
sidebar_position: 2
diataxis-tag: how-to
---

# Troubleshoot App of Apps CI

This guide shows you how to fix a failing CI job on a pull request in your [app of apps fork](/docs/applications/get-started/app-of-apps-setup/#fork-the-app-of-apps-repository). For what each job does and why, see [CI/CD](/docs/ci-cd/).

From the root of your app of apps fork, list the jobs of your pull request:
```bash
gh pr checks
```

Otherwise, open your pull request on GitHub and go to the **Checks** tab. The failing jobs show a red cross in the left sidebar. Click one to open its log.

Then go to the section of the failing job below.

## `helm-docs`

Open the job's log and find the step that failed.

If the push of the generated READMEs fails, the `HELM_DOCS_DEPLOY_KEY` secret is missing. List the secrets of your fork:
```bash
gh secret list
```

If `HELM_DOCS_DEPLOY_KEY` isn't in the list, follow [Enable README Generation in CI](/docs/applications/get-started/app-of-apps-setup/#enable-readme-generation-in-ci). Then rerun the failed jobs, replacing `<run-id>` with the ID of the run, shown in the URL of the job's log:
```bash
gh run rerun <run-id> --failed
```

If the log shows a template error instead, a chart's `README.md.gotmpl` is invalid. To render the READMEs as CI does, from the root of your app of apps fork:
```bash
HELM_DOCS_IGNORE_NON_DESCRIPTIONS=true helm-docs --sort-values-order file
```

Fix the template the error names, then commit and push.

When the job passes, it may push a `docs: render chart READMEs with helm-docs` commit to your branch. You have nothing to fix: the new commit starts its own run. Pull the commit before your next push, replacing `<branch>`:
```bash
git pull origin <branch>
```

## `code-quality-checks`

Open the job's log, find the step that failed, then go to its section below.

### TEMP Marker Check Fails

A file still contains a `TEMP:` marker, the reminder to revert a temporary change before merging. The step's log prints each file and line. To list them from the root of your app of apps fork:
```bash
git grep -n "TEMP:" -- . ':!.github/workflows/ci.yaml' ':!docs/add-an-alert.md'
```

Revert each temporary change with its marker, then commit and push.

### Adding the Helm Repositories Fails

A `repository:` URL under `dependencies:` in a `Chart.yaml` is wrong or unreachable. The step's log ends on the URL that failed. To run the same step, from the root of your app of apps fork:
```bash
scripts/helm-repo-add.sh
```

Fix the URL, then commit and push.

### A Pre-commit Hook Fails

The step's log shows each hook as `Passed` or `Failed`. To run the same hooks, from the root of your app of apps fork:
```bash
scripts/helm-repo-add.sh
prek run --all-files
```

Find the failed hook in the table below, apply its fix, then commit and push:

| Hook | Cause | Fix |
|------|-------|-----|
| `Helm lint and kubeconform` | A chart doesn't build, lint, render, or validate | Find its error in the next table |
| `kubeconform plain manifests` | A manifest outside a chart doesn't match its Kubernetes schema | Fix the field the hook prints |
| `Trivy secret scan` | A file contains a secret | Remove the secret, and rotate it since it's in your branch's history |

The `Helm lint and kubeconform` hook prints an `[ERROR]` line naming each chart that failed:

| Error | Cause | Fix |
|-------|-------|-----|
| `helm dependency build failed` | The chart's `Chart.lock` doesn't match the `dependencies:` of its `Chart.yaml` | Run `helm dependency update <chart-dir>`, and commit `Chart.lock` |
| `helm lint failed` | The chart breaks a lint rule | Fix the line the hook prints |
| `helm template failed` | A template is invalid, or a required value has no default | Fix the template, or add a dummy value to the chart's `placeholder-values.yaml` (see [Placeholder Values](/docs/applications/how-the-app-of-apps-works/#placeholder-values)) |
| `kubeconform failed` | A rendered resource doesn't match its Kubernetes schema | Fix the field the hook prints |

To run the hooks on every commit, see [Enable the Pre-commit Hooks](/docs/applications/get-started/app-of-apps-setup/#enable-the-pre-commit-hooks).

### Trivy Fails

[Trivy](https://trivy.dev/) found a `HIGH` or `CRITICAL` security misconfiguration in a chart or a manifest. The step's log prints the file and each finding. To run the same scan, from the root of your app of apps fork, build the dependencies of each chart with the Helm hook, then run the Trivy one:
```bash
scripts/helm-repo-add.sh
prek run --all-files validate-helm
prek run --all-files trivy
```

Fix the misconfiguration the finding describes. If it's a trade-off you accept, add an entry to [`.trivyignore.yaml`](https://github.com/ConsciousML/argocd-app-of-apps-template/blob/main/.trivyignore.yaml) instead, with the finding's `id`, the file it's in, and a `statement` saying why it's safe to ignore. For example:
```yaml
misconfigurations:
  - id: AVD-KSV-0041
    paths:
      - "charts/external-secrets-operator/operator/charts/external-secrets/templates/cert-controller-rbac.yaml"
    statement: >
      Required for the cert-controller to read and rotate its own
      webhook TLS Secret. Vendored upstream chart with no namespace
      scoping option exposed via values; inherent to the
      controller's function.
```

If the finding is in a chart pulled as a dependency, as above, copy the path from the log: it points inside the `charts/` directory of your own chart.

Then commit and push.

### Trivy Image Vulnerability Scan Fails

This step fails when it can't find or pull an image, never on a vulnerability (see [Why the Image Scan Never Fails](/docs/ci-cd/#why-the-image-scan-never-fails)). To run the same scan, from the root of your app of apps fork:
```bash
scripts/trivy-image-scan.sh
```

If the log shows `helm dependency build failed` or `helm template failed`, fix the chart as in [A Pre-commit Hook Fails](#a-pre-commit-hook-fails).

Otherwise, the last `Scanning image:` line names an image Trivy can't pull. Fix its name or tag in the chart's values, then commit and push.

### Review the Image Vulnerabilities

A green step doesn't mean your images have no vulnerability. Open the `Trivy image vulnerability scan` step's log: under each `Scanning image:` line, it prints a table of the image's `HIGH` and `CRITICAL` vulnerabilities.

For each one, check whether your cluster exposes it, then:
- **It's exposed**: move to an image with the `Fixed Version` the table shows, by raising the chart's dependency version in its `Chart.yaml`, or the image tag in its values. Then commit and push.
- **It isn't exposed, or has no fix yet**: accept it, and review it again on your next pull request.
