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


def parse_value(raw):
    """Return a front matter value, or None when reading it takes a real YAML parser."""
    raw = raw.strip()
    if raw[:1] in ("'", '"'):
        closed = len(raw) > 1 and raw[-1] == raw[0]
        return raw[1:-1] if closed and raw[0] not in raw[1:-1] and "\\" not in raw else None
    return None if raw[:1] in (">", "|") or " #" in raw else raw


def read_page(path):
    """Return the page's front matter fields, and its H1 as `title` when it sets none."""
    # Flat `key: value` lines only, which is all the site's front matter uses
    text = path.read_text()
    # Without the guard, a page with no front matter gets parsed up to its first horizontal rule
    front, _, body = text[4:].partition("\n---\n") if text.startswith("---\n") else ("", "", text)
    lines = re.findall(r"^([\w-]+):[ \t]*(.*)$", front, re.M)
    fields = {key: parse_value(raw) for key, raw in lines}
    if "title" not in fields:
        h1 = re.search(r"^# (.+)$", body, re.M)
        fields["title"] = h1.group(1).strip() if h1 else ""
    return fields


def route(path):
    rel = path.relative_to(DOCS).with_suffix("")
    parts = rel.parts[:-1] if rel.name == "index" else rel.parts
    return "/docs/" + "/".join(parts) + "/"


def main():
    rows, errors = [], []
    # Docusaurus doesn't route `_`-prefixed files and directories: partials and `_external`
    for page in sorted(p for p in DOCS.rglob("*.md*")
                       if not any(part.startswith("_") for part in p.relative_to(DOCS).parts)):
        fields = read_page(page)
        file = page.relative_to(ROOT)
        for key in ("title", "diataxis-tag", "description"):
            if fields.get(key) is None and key in fields:
                errors.append(f"::error file={file}::{file} has a `{key}` this script can't read: "
                              "write it on one line, without an inline comment or an escaped quote")
            elif not fields.get(key):
                errors.append(f"::error file={file}::{file} has no `{key}` in its front matter")
        if "slug" in fields:
            errors.append(f"::error file={file}::{file} sets a `slug`, which this script doesn't "
                          "follow: its route in the map would be wrong")
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
