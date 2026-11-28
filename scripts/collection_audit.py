#!/usr/bin/env python3
"""Report broken and uncertain references to our independently published collections.

Read-only pilot: no content changes, no release gate, no credentials.
"""
from __future__ import annotations

import argparse
import json
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlsplit, urlunsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

from build import Page

HOST = "grove.github.io"
COLLECTIONS = (
    "/software-that-improves-with-age/",
    "/engineering-that-compounds/",
    "/patterns-of-compounding-engineering/",
)
MAX_PAGES = 100
MAX_BYTES = 2_000_000
TIMEOUT = 8


def permitted(url: str) -> bool:
    parsed = urlsplit(url)
    return (
        parsed.scheme == "https"
        and parsed.netloc == HOST
        and any(parsed.path.startswith(prefix) for prefix in COLLECTIONS)
        and not any(part in {".", ".."} for part in unquote(parsed.path).split("/"))
    )


class ScopedRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not permitted(newurl):
            raise URLError("Redirect outside the three collections")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class Anchors(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.names: set[str] = set()

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.names.add(values["id"])
        if tag == "a" and values.get("name"):
            self.names.add(values["name"])


@dataclass(frozen=True)
class Fetched:
    status: str
    detail: str
    anchors: frozenset[str] = frozenset()
    final_url: str = ""


def fetch(url: str) -> Fetched:
    if not permitted(url):
        return Fetched("inconclusive", "URL outside audit scope")
    try:
        opener = build_opener(ScopedRedirect())
        request = Request(url, headers={"User-Agent": "CompoundingEngineeringCollectionAudit/1.0"})
        with opener.open(request, timeout=TIMEOUT) as response:
            if not permitted(response.geturl()):
                return Fetched("inconclusive", "Redirect outside audit scope")
            if response.headers.get_content_type() != "text/html":
                return Fetched("inconclusive", "Response is not HTML")
            body = response.read(MAX_BYTES + 1)
            if len(body) > MAX_BYTES:
                return Fetched("inconclusive", "Response exceeds size budget")
            parser = Anchors()
            parser.feed(body.decode(response.headers.get_content_charset() or "utf-8", errors="replace"))
            parser.close()
            return Fetched("ok", f"HTTP {response.status}", frozenset(parser.names), response.geturl())
    except HTTPError as error:
        status = "broken" if error.code in {404, 410} else "inconclusive"
        return Fetched(status, f"HTTP {error.code}")
    except (URLError, OSError, ValueError, LookupError) as error:
        return Fetched("inconclusive", type(error).__name__)


def inventory(root: Path) -> dict[str, list[str]]:
    references: dict[str, list[str]] = defaultdict(list)
    pages = sorted(root.rglob("*.html"))
    if not pages:
        raise ValueError("No built HTML pages; run scripts/build.py first")
    for path in pages:
        for href in Page(path).links:
            if permitted(href):
                references[href].append(path.relative_to(root).as_posix())
    return dict(sorted(references.items()))


def document_url(url: str) -> str:
    return urlunsplit(urlsplit(url)._replace(fragment=""))


def audit(root: Path, fetcher=fetch) -> dict:
    started = time.monotonic()
    references = inventory(root)
    documents = sorted({document_url(url) for url in references})
    if len(documents) > MAX_PAGES:
        raise ValueError(f"Audit exceeds the {MAX_PAGES}-document pilot budget")
    with ThreadPoolExecutor(max_workers=4) as executor:
        fetched = dict(zip(documents, executor.map(fetcher, documents)))
    rows = []
    counts = {"ok": 0, "broken": 0, "inconclusive": 0}
    for url, sources in references.items():
        result = fetched[document_url(url)]
        fragment = unquote(urlsplit(url).fragment)
        status, detail = result.status, result.detail
        if status == "ok" and fragment and fragment not in result.anchors:
            status, detail = "broken", "Missing fragment in returned HTML"
        counts[status] += 1
        rows.append({"url": url, "status": status, "detail": detail,
                     "final_url": result.final_url, "sources": sorted(set(sources)),
                     "occurrences": len(sources)})
    return {
        "references": sum(len(sources) for sources in references.values()),
        "destinations": len(references),
        "document_requests": len(documents),
        "counts": counts,
        "elapsed_seconds": round(time.monotonic() - started, 2),
        "results": rows,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    parser.add_argument("--report", type=Path, default=Path("collection-audit.json"))
    args = parser.parse_args()
    report = audit(args.root)
    args.report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    counts = report["counts"]
    print(f"References: {report['references']}; distinct destinations: {report['destinations']}; "
          f"document requests: {report['document_requests']}")
    print(f"OK: {counts['ok']}; broken: {counts['broken']}; inconclusive: {counts['inconclusive']}; "
          f"elapsed: {report['elapsed_seconds']}s")
    for row in report["results"]:
        if row["status"] != "ok":
            print(f"{row['status']}: {row['url']} ({row['detail']})")
    print("Report only: inspect findings before changing content or adding a release gate.")


if __name__ == "__main__":
    main()
