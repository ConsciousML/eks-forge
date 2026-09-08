# Deploy to Read the Docs

This documentation will walk you through the process of deploying your site to the `readthedocs.io` domain.
Only public GitHub (or GitLab) repositories are supported on the free tier.

1. Log in to [Read the Docs](https://app.readthedocs.org/accounts/login/).
2. Click `+ Add Project`.
3. In the `Repository name` search bar, type your repository name and click on the suggestion.
4. Click `Continue`.
5. Click `Next`.
6. EKS Forge ships a functional `.readthedocs.yaml` file. Click `This file exists`.

By now, your project should have been created and you should see a build running.

However, we still need to change something: go to `Settings` and under `URL versioning scheme` select `Multiple versions without translations`.
Finally, click `Save`.

This modification should trigger another build. Once it's completed, go back to your project's home page and click `View docs`.

Congratulations, you're Docusaurus documentation site is now live on `readthedocs.io`!

For more information read [Adding a documentation project](https://docs.readthedocs.com/platform/stable/intro/add-project.html) and [Deploying Docusaurus on Read the Docs](https://docs.readthedocs.com/platform/stable/intro/docusaurus.html#deploying-docusaurus-on-read-the-docs).
