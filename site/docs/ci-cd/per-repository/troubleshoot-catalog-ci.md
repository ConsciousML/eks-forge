---
sidebar_position: 1
diataxis-tag: how-to
---

# Troubleshoot Catalog CI

This guide shows you how to fix a failing CI job on a pull request in your [catalog fork](/docs/quickstart/installation/#fork-the-eks-forge-catalog). For what each job does and why, see [CI/CD](/docs/ci-cd/).

From the root of your catalog fork, list the jobs of your pull request:
```bash
gh pr checks
```

Otherwise, open your pull request on GitHub and go to the **Checks** tab. The failing jobs show a red cross in the left sidebar. Click one to open its log.

Then go to the section of the failing job below.

## `check-if-pr-is-draft`

Your pull request is a draft, and CI doesn't run on drafts. Mark it as ready for review, which starts a new run:
```bash
gh pr ready
```

## `check-temp-markers`

A file still contains a `TEMP:` marker, the reminder to revert a temporary change before merging. The job's log prints each file and line. To list them from the root of your catalog fork:
```bash
git grep -n "TEMP:" -- . ':!.github/workflows/ci.yaml' ':!docs/continuous-integration.md'
```

Revert each temporary change with its marker, then commit and push.

## `check-lock-files`

A unit has no committed [provider lock file](https://developer.hashicorp.com/terraform/language/files/dependency-lock). The job's log names each one:
```text
missing: units/<unit-dir>/.terraform.lock.hcl
```

To run the same check from the root of your catalog fork:
```bash
make check-lock-files
```

Generate and commit the missing files by following [Commit the Lock File](/docs/iac/add-a-unit/#commit-the-lock-file). A lock file that exists on your machine but isn't committed still fails the check.

## `terraform-docs`

The job can't check out your branch or push to it when the `TERRAFORM_DOCS_DEPLOY_KEY` secret is missing. See [Setup Fails](#setup-fails).

## `check-docs-changes`

The job fails with `terraform-docs created a new commit in this run` when CI pushed generated READMEs to your branch. You have nothing to fix: the new commit starts its own run, which passes this job.

Pull the commit before your next push, replacing `<branch>`:
```bash
git pull origin <branch>
```

## `code-quality-checks`

Open the job's log, find the step that failed, then go to its section below.

### Setup Fails

The `Run ./.github/actions/setup` step, or the checkout of the `terraform-docs` job, fails when a GitHub Actions secret it reads is missing. The [bootstrap pipelines](/docs/quickstart/bootstrap/) create these secrets. List the ones your fork has:
```bash
gh secret list
```

Find what failed in the table below, and check that its secrets are in the list:

| What fails | Secrets | Bootstrap pipeline |
|------------|---------|--------------------|
| The checkout or the push of `terraform-docs` | `TERRAFORM_DOCS_DEPLOY_KEY` | [AWS GitHub Actions Authentication](/docs/quickstart/bootstrap/aws_gh_actions_auth/) |
| `webfactory/ssh-agent` | `DEPLOY_KEY_TG_CATALOG` | [AWS GitHub Actions Authentication](/docs/quickstart/bootstrap/aws_gh_actions_auth/) |
| `Configure AWS Credentials` | `AWS_ROLE_ARN`, `AWS_REGION` | [AWS GitHub Actions Authentication](/docs/quickstart/bootstrap/aws_gh_actions_auth/) |
| `Get Tailscale identity token` or `Connect to Tailscale` | `TS_OAUTH_CLIENT_ID`, `TS_AUDIENCE`, `TS_TAGS` | [Tailscale](/docs/quickstart/bootstrap/tailscale/) |

If a secret is missing, run its bootstrap pipeline. Then rerun the failed jobs, replacing `<run-id>` with the ID of the run, shown in the URL of the job's log:
```bash
gh run rerun <run-id> --failed
```

### Trivy Config Scan Fails

[Trivy](https://trivy.dev/) found a security misconfiguration in a module. The step's log prints the module's directory and each finding. To run the same scan, from the root of your catalog fork:
```bash
make trivy-local
```

Fix the misconfiguration the finding describes. If it's a trade-off you accept, add an entry to [`.trivyignore.yaml`](https://github.com/ConsciousML/eks-forge-catalog/blob/main/.trivyignore.yaml) instead, with the finding's `id`, the file it's in, and a `statement` saying why it's safe to ignore. For example:
```yaml
misconfigurations:
  - id: AWS-0104
    paths:
      - "node_groups.tf"
    statement: >
      terraform-aws-modules/eks default: worker nodes need broad outbound access to reach
      ECR, the EKS/AWS APIs, and container registries.
```

Then commit and push.

### A Pre-commit Hook Fails

The step's log shows each hook as `Passed` or `Failed`. To run the same hooks, from the root of your catalog fork:
```bash
prek run --all-files
```

Find the failed hook in the table below, apply its fix, then commit and push:

| Hook | Cause | Fix |
|------|-------|-----|
| `OpenTofu fmt` | A `.tf` file isn't formatted | Run `tofu fmt -recursive` |
| `Terragrunt hcl fmt` | An `.hcl` file isn't formatted | Run `terragrunt hcl fmt` |
| `OpenTofu validate` | A module is invalid | Fix the error the hook prints |
| `tflint` | A module breaks a lint rule | Fix the line the hook prints |
| `Trivy secret scan` | A file contains a secret | Remove the secret, and rotate it since it's in your branch's history |

To run the hooks on every commit, see [Enable the Pre-commit Hooks](/docs/quickstart/installation/#enable-the-pre-commit-hooks).

### Terragrunt Plan Fails

The plan of the `dev` stack fails on your change. To run the same plan against CI's state, set [`TG_ENVIRONMENT` and `TG_ENVIRONMENT_ALIAS`](/docs/reference/environment_variable/#tg_environment-and-tg_environment_alias) as CI does, from the root of your catalog fork:
```bash
source .env
export TG_ENVIRONMENT=catalog-eks-ci
export TG_ENVIRONMENT_ALIAS=dev
cd pipelines/dev/eks/stack
terragrunt stack clean
terragrunt stack generate
terragrunt run --all plan --non-interactive --no-stack-generate
```

Fix the error the plan prints, then commit and push. If the error is `Error acquiring the state lock`, continue at [State Is Locked](#state-is-locked).

Once you're done, open a new shell, or unset both variables, so your next commands target `dev` again:
```bash
unset TG_ENVIRONMENT TG_ENVIRONMENT_ALIAS
```

### State Is Locked

A run that was cancelled during the plan left its [state lock](https://opentofu.org/docs/language/state/locking/) behind, so every later plan of that unit fails with:
```text
Error: Error acquiring the state lock

Lock Info:
  ID:        <lock-id>
  Path:      <bucket>/dev/eks/stack/.terragrunt-stack/<path>/tofu.tfstate
  Operation: OperationTypePlan
```

First, check that no CI run is in progress. This prints nothing when none is:
```bash
gh run list --workflow ci.yaml --status in_progress
```

:::warning
Never release the lock of a run that's still in progress. Wait for it to finish instead.
:::

Generate the stack against CI's state, as in [Terragrunt Plan Fails](#terragrunt-plan-fails), up to `terragrunt stack generate`. Then release the lock with [`force-unlock`](https://opentofu.org/docs/cli/commands/force-unlock/) from the unit's directory, replacing `<path>` and `<lock-id>` with the ones in the error:
```bash
cd .terragrunt-stack/<path>
terragrunt run -- force-unlock <lock-id>
```

Then rerun the failed jobs, as in [Setup Fails](#setup-fails).

To avoid leaving a lock behind, never cancel a CI run (see [Why Runs Are Queued](/docs/ci-cd/#why-runs-are-queued)).
