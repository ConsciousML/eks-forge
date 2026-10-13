---
sidebar_position: 2
sidebar_label: ArgoCD
diataxis-tag: how-to
description: Fix an ArgoCD hostname that doesn't resolve, a rejected admin password, or an application stuck deleting.
---

# Troubleshoot ArgoCD

This guide shows you how to reach ArgoCD when its hostname or its password doesn't work, and how to remove an application that won't delete. For how ArgoCD deploys your applications, see [How the App of Apps Works](/docs/applications/how-the-app-of-apps-works/).

Go to the section of your problem below.

## The ArgoCD Hostname Doesn't Resolve

`https://argocd.private.<env>.<base_domain>` doesn't load in your browser. If you're on macOS, see [Internal Endpoints Are Unreachable on macOS](/docs/troubleshooting/tailscale/#internal-endpoints-are-unreachable-on-macos) first.

To reach ArgoCD without its hostname, forward a local port to its service:
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:80
```

Then open `http://localhost:8080`. Every stack sets `server.insecure` on ArgoCD, so it answers over plain HTTP.

## ArgoCD Rejects the Admin Password

The password of the `admin` user is in Secrets Manager, and the External Secrets Operator copies it into the cluster. If the one you get from [Log In to ArgoCD](/docs/quickstart/deployment/#log-in-to-argocd) is rejected, check that the copy succeeded:
```bash
kubectl get externalsecret -n argocd
```

If the `READY` column isn't `True`, ArgoCD never received that password, and still uses the one it generated when it was installed. Read it with:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d; echo
```

## An Application Is Stuck Deleting

An application you removed stays in the list, because ArgoCD can't finish deleting its resources. Check that it has a `deletionTimestamp`, replacing `<name>` with the name of the application:
```bash
kubectl get app -n argocd
kubectl get app <name> -n argocd -o jsonpath='{.metadata.deletionTimestamp}'; echo
```

:::warning
The command below makes ArgoCD forget the application without deleting the resources it still manages. They stay in your cluster until you delete them yourself.
:::

Remove the finalizer that makes ArgoCD wait for these resources:
```bash
kubectl patch app <name> -n argocd --type=merge -p '{"metadata":{"finalizers":null}}'
```

Then list what the application left behind in its namespace, replacing `<namespace>`, and delete what you no longer need:
```bash
kubectl get all -n <namespace>
```
