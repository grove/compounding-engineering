#!/usr/bin/env python3
"""Copy the static site to dist and, with --check, inspect its local links."""

from __future__ import annotations

import argparse
import re
import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist"
SITE_HOST = "grove.github.io"
SITE_PATH = "/compounding-engineering/"


class Page(HTMLParser):
    def __init__(self, path: Path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids: set[str] = set()
        self.links: list[str] = []
        self.feed(path.read_text(encoding="utf-8"))
        self.close()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        identifier = attributes.get("id")
        if identifier is not None:
            if not identifier or identifier in self.ids:
                raise ValueError(f"Empty or duplicate id {identifier!r} in {self.path.name}")
            self.ids.add(identifier)
        for name in ("href", "src", "poster"):
            value = attributes.get(name)
            if value:
                self.links.append(value)
        # Data URLs may contain commas, so leave those to the browser.
        srcset = attributes.get("srcset", "") or ""
        if srcset and not srcset.lstrip().startswith("data:"):
            self.links.extend(candidate.strip().split()[0] for candidate in srcset.split(",") if candidate.strip())

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)


def local_target(source: Path, href: str) -> tuple[Path, str] | None:
    parsed = urlsplit(href)
    if parsed.scheme in {"javascript", "vbscript"}:
        raise ValueError(f"Unsafe link scheme in {source.name}: {href}")
    if parsed.netloc:
        if parsed.hostname != SITE_HOST or not parsed.path.startswith(SITE_PATH):
            return None
    elif parsed.scheme:
        return None
    path = unquote(parsed.path)
    if path.startswith("/"):
        if not path.startswith(SITE_PATH):
            raise ValueError(f"Root-relative link leaves the project in {source.name}: {href}")
        target = OUTPUT / path[len(SITE_PATH):]
    else:
        target = source.parent / path if path else source
    target = target.resolve()
    if not target.is_relative_to(OUTPUT.resolve()):
        raise ValueError(f"Link leaves dist in {source.name}: {href}")
    if target.is_dir():
        target /= "index.html"
    if not target.is_file():
        raise ValueError(f"Missing local target in {source.name}: {href}")
    return target, unquote(parsed.fragment)


def check_site() -> tuple[int, int]:
    pages = {path.resolve(): Page(path) for path in OUTPUT.rglob("*.html")}
    if not pages:
        raise ValueError("No HTML pages were generated")
    references = 0
    for path, page in pages.items():
        for href in page.links:
            result = local_target(path, href)
            if result is None:
                continue
            references += 1
            target, fragment = result
            if fragment and target in pages and fragment not in pages[target].ids:
                raise ValueError(f"Missing fragment #{fragment} in {target.name}, linked from {path.name}")
    for stylesheet in OUTPUT.rglob("*.css"):
        for match in re.finditer(r"url\(\s*(['\"]?)(.*?)\1\s*\)", stylesheet.read_text(encoding="utf-8"), re.DOTALL):
            href = match.group(2).strip()
            if href and not href.startswith("#"):
                local_target(stylesheet.resolve(), href)
    return len(pages), references


def build() -> None:
    if not (ROOT / "index.html").is_file():
        raise ValueError("Create index.html before building the site")
    if OUTPUT.is_symlink():
        raise ValueError("dist must be a directory, not a symlink")
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    for name in ("index.html", "foundations.html", "404.html", "robots.txt", "sitemap.xml"):
        source = ROOT / name
        if source.is_file():
            shutil.copy2(source, OUTPUT / name)
    for name in ("assets", "adoption"):
        if (ROOT / name).is_dir():
            shutil.copytree(ROOT / name, OUTPUT / name)
    (OUTPUT / ".nojekyll").touch()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check local links, assets, fragment targets and duplicate IDs.")
    options = parser.parse_args()
    try:
        build()
        if options.check:
            pages, references = check_site()
            print(f"Built {pages} pages; checked {references} local references, assets and IDs.")
        else:
            print("Built the site in dist/.")
    except (OSError, ValueError) as error:
        parser.exit(1, f"Build failed: {error}\n")


if __name__ == "__main__":
    main()
