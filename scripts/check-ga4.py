#!/usr/bin/env python3
"""List HTML pages whose <head> is missing the GA4 gtag snippet.

Exits 0 when every HTML page includes measurement ID G-KVWZ3K2PJ8.
Exits 1 and prints the missing paths otherwise.
"""

import sys
from pathlib import Path

MEASUREMENT_ID = "G-KVWZ3K2PJ8"
GTAG_SRC = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID
GTAG_CONFIG = "gtag('config', '" + MEASUREMENT_ID + "')"


def head_inner(text):
    lower = text.lower()
    start = lower.find("<head>")
    end = lower.find("</head>")
    if start < 0 or end < 0 or end < start:
        return None
    return text[start + len("<head>") : end]


def main():
    root = Path(__file__).resolve().parent.parent
    pages = sorted(
        path
        for path in root.rglob("*.html")
        if ".git" not in path.parts
    )
    missing = []
    for path in pages:
        head = head_inner(path.read_text(encoding="utf-8"))
        if head is None or GTAG_SRC not in head or GTAG_CONFIG not in head:
            missing.append(path.relative_to(root).as_posix())

    if missing:
        print("HTML pages missing the GA4 tag (%s):" % MEASUREMENT_ID)
        for rel in missing:
            print("  " + rel)
        return 1

    print("All %d HTML pages include the GA4 tag (%s)." % (len(pages), MEASUREMENT_ID))
    return 0


if __name__ == "__main__":
    sys.exit(main())
