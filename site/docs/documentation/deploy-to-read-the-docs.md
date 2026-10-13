---
sidebar_position: 3
title: Deploy to Read the Docs
diataxis-tag: how-to
description: Host the documentation site on readthedocs.io, built from the EKS Forge repository.
---

# How to Deploy to Read the Docs

This guide shows you how to host this documentation site on [Read the Docs](https://about.readthedocs.com/), at `https://<project>.readthedocs.io`, built from the EKS Forge repository on each push.

:::warning
This guide works for the EKS Forge repository itself, not for a fork of it. Forks aren't supported yet. If you need them, upvote the [fork support issue](https://github.com/ConsciousML/eks-forge/issues/134).
:::

It assumes the site builds on your machine, as in [Build the Site](/docs/documentation/run-the-documentation-site/#build-the-site). You need admin access to the repository, which must be public: the free Read the Docs Community doesn't connect to private repositories.

## Add the Project

Log in to [Read the Docs](https://app.readthedocs.org/accounts/login/) with your GitHub account, then:
1. Click **Add project**.
2. Type the name of the repository in the search bar, and click it in the suggestions.
3. Click **Continue**, then **Next**.
4. Click **This file exists**. The repository already has the configuration Read the Docs asks for, in [`.readthedocs.yaml`](https://github.com/ConsciousML/eks-forge/blob/main/.readthedocs.yaml).

Read the Docs creates the project and starts its first build.

## Set the URL Versioning Scheme

By default, Read the Docs serves the site under `/en/latest/`. The site has no translations, so drop the language from its URLs.

In the project, click **Settings**. Under **URL versioning scheme**, select **Multiple versions without translations**, then click **Save**. Read the Docs starts a new build, and serves the site under `/latest/`.

## Check the Site

Once the build passes, go back to the home page of the project and click **View docs**.

If the build fails, open it from the **Builds** tab to read its log. It runs the same build as [Build the Site](/docs/documentation/run-the-documentation-site/#build-the-site), so reproduce the error there.

## Preview a Pull Request

Read the Docs also builds each pull request of the repository. Its `docs/readthedocs.org:<project>` check links to a preview of the site with your change. From the root of the repository, on the branch of your pull request, print it:
```bash
gh pr checks
```

To turn the previews off, see **Pull request builds** in the **Settings** of the project.

For the configuration behind this deployment, see Read the Docs' [Deploying Docusaurus guide](https://docs.readthedocs.com/platform/stable/intro/docusaurus.html).
