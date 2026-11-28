import tempfile
import unittest
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request

from collection_audit import Anchors, Fetched, ScopedRedirect, audit, inventory, permitted

BASE = "https://grove.github.io/engineering-that-compounds/"


class CollectionAuditTests(unittest.TestCase):
    def test_scope(self):
        self.assertTrue(permitted(BASE + "essay.html#section"))
        for url in (
            "http://grove.github.io/engineering-that-compounds/",
            "https://grove.github.io.evil.example/engineering-that-compounds/",
            "https://grove.github.io/compounding-engineering/",
            BASE + "%2e%2e/other/",
            "https://example.com/engineering-that-compounds/",
        ):
            self.assertFalse(permitted(url), url)

    def test_redirect_outside_scope(self):
        with self.assertRaises(URLError):
            ScopedRedirect().redirect_request(Request(BASE), None, 302, "", {}, "https://example.com/")

    def test_anchors(self):
        parser = Anchors()
        parser.feed('<h2 id="a&amp;b">Heading</h2><a name="legacy"></a>')
        self.assertEqual(parser.names, {"a&b", "legacy"})

    def test_inventory_and_report(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            links = [
                BASE + "essay.html#present",
                BASE + "essay.html#absent",
                BASE + "gone.html",
                BASE + "uncertain.html",
                "https://example.com/",
            ]
            (root / "index.html").write_text("".join(f'<a href="{url}">x</a>' for url in links))
            (root / "other.html").write_text(f'<a href="{links[0]}">y</a>')
            self.assertEqual(len(inventory(root)), 4)
            requested = []
            def fake(url):
                requested.append(url)
                if url.endswith("gone.html"):
                    return Fetched("broken", "HTTP 404")
                if url.endswith("uncertain.html"):
                    return Fetched("inconclusive", "HTTP 503")
                return Fetched("ok", "HTTP 200", frozenset({"present"}), url)
            report = audit(root, fake)
            self.assertEqual(report["references"], 5)
            self.assertEqual(report["destinations"], 4)
            self.assertEqual(report["document_requests"], 3)
            self.assertEqual(len(requested), 3)
            self.assertEqual(report["counts"], {"ok": 1, "broken": 2, "inconclusive": 1})
            present = next(row for row in report["results"] if row["url"] == links[0])
            self.assertEqual(present["sources"], ["index.html", "other.html"])

    def test_missing_build_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(ValueError):
                inventory(Path(directory))


if __name__ == "__main__":
    unittest.main()
