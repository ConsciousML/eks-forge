#!/usr/bin/env python3
"""Print the CSV map of every site page, built from each page's front matter.

CI runs it and commits the result as documentation-map.csv. It fails when a page lacks a
`title` (or an H1), a `diataxis-tag`, or a `description`.
"""
import csv
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
DOCS = ROOT / "site" / "docs"
TYPES = ("tutorial", "how-to", "reference", "explanation")

# Pages that site/docusaurus.config.js generates from submodule READMEs, not on disk under site/docs/
GENERATED = [
    ("/docs/reference/terraform_modules/<module>/", "reference", "Terraform Modules",
     "One page per catalog module, from modules/<module>/README.md."),
    ("/docs/reference/helm_charts/<chart path>/", "reference", "Helm Charts",
     "One page per app of apps chart, from charts/<chart path>/README.md."),
    ("/docs/reference/manifests/<manifest path>/", "reference", "Manifests",
     "One page per app of apps manifest, from manifests/<manifest path>/README.md."),
]


def read_page(path):
    """Return the page's front matter fields, and its H1 as `title` when it sets none."""
    # Flat `key: value` lines only, which is all the site's front matter uses
    front, _, body = path.read_text().removeprefix("---\n").partition("\n---\n")
    fields = dict(re.findall(r"^([\w-]+):[ \t]*(.*)$", front, re.M))
    if not fields.get("title"):
        h1 = re.search(r"^# (.+)$", body, re.M)
        fields["title"] = h1.group(1) if h1 else ""
    return {key: value.strip().strip("'\"") for key, value in fields.items()}


def route(path):
    rel = path.relative_to(DOCS).with_suffix("")
    parts = rel.parts[:-1] if rel.name == "index" else rel.parts
    return "/docs/" + "/".join(parts) + "/"


def main():
    rows, errors = [], []
    for page in sorted(p for p in DOCS.rglob("*.md*") if "_external" not in p.parts):
        fields = read_page(page)
        file = page.relative_to(ROOT)
        for key in ("title", "diataxis-tag", "description"):
            if not fields.get(key):
                errors.append(f"::error file={file}::{file} has no `{key}` in its front matter")
        if fields.get("diataxis-tag") and fields["diataxis-tag"] not in TYPES:
            errors.append(f"::error file={file}::{file} has an unknown `diataxis-tag`: "
                          f"{fields['diataxis-tag']} (expected one of {', '.join(TYPES)})")
        rows.append((route(page), fields.get("diataxis-tag"), fields["title"],
                     fields.get("description")))

    if errors:
        print("\n".join(errors), file=sys.stderr)
        sys.exit(1)

    writer = csv.writer(sys.stdout, lineterminator="\n")
    writer.writerow(("route", "type", "title", "description"))
    writer.writerows(rows + GENERATED)


if __name__ == "__main__":
    main()
