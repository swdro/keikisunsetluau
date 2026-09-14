#!/usr/bin/env python3
"""WCAG AA contrast checker for the Ke Iki Luau palette.

Reads the colour tokens straight out of css/style.css, so it cannot drift from
the stylesheet. Run from the project root:

    python3 tools-contrast-check.py

Exits non-zero if any pair fails, so it can gate a commit.
Targets: 4.5:1 normal text, 3:1 large text / UI. Aim for ~4.8 for headroom.
"""
import re, sys, os

CSS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "css", "style.css")

def hx(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def over(fg, bg, a):
    return tuple(round(f * a + b * (1 - a)) for f, b in zip(fg, bg))

def lum(c):
    def f(v):
        v /= 255.0
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (f(x) for x in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(a, b):
    la, lb = lum(a), lum(b)
    if lb > la:
        la, lb = lb, la
    return (la + 0.05) / (lb + 0.05)

def tokens():
    src = open(CSS, encoding="utf-8").read()
    found = dict(re.findall(r"--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,6})\s*;", src))
    missing = [k for k in ("ink", "sand", "sand-2", "ink-2", "muted",
                           "ember", "ember-ink", "gold", "sea") if k not in found]
    if missing:
        sys.exit("Could not find tokens in style.css: " + ", ".join(missing))
    return {k: hx(v) for k, v in found.items()}

def main():
    t = tokens()
    WHITE = (255, 255, 255)
    # (label, foreground, background, minimum)
    pairs = [
        ("body --ink-2 on sand",              t["ink-2"],     t["sand"],   4.5),
        ("--ink on sand",                     t["ink"],       t["sand"],   4.5),
        ("--muted on sand",                   t["muted"],     t["sand"],   4.5),
        ("--muted on sand-2",                 t["muted"],     t["sand-2"], 4.5),
        ("--muted on white (cards)",          t["muted"],     WHITE,       4.5),
        ("--gold eyebrow on sand",            t["gold"],      t["sand"],   4.5),
        ("--gold eyebrow on sand-2",          t["gold"],      t["sand-2"], 4.5),
        ("--ember-ink text on sand",          t["ember-ink"], t["sand"],   4.5),
        ("--ember-ink text on sand-2",        t["ember-ink"], t["sand-2"], 4.5),
        ("--sea tag on sand",                 t["sea"],       t["sand"],   4.5),
        ("white on --ember (promo/buttons)",  WHITE,          t["ember"],  4.5),
        ("footer body .80 on ink",   over(t["sand"], t["ink"], 0.80), t["ink"], 4.5),
        ("footer title .62 on ink",  over(t["sand"], t["ink"], 0.62), t["ink"], 4.5),
        ("eyebrow--light .72 on ink", over(WHITE,    t["ink"], 0.72), t["ink"], 4.5),
    ]
    print("%-38s %7s %6s  %s" % ("pair", "ratio", "min", "result"))
    print("-" * 66)
    fails = 0
    for label, fg, bg, need in pairs:
        r = ratio(fg, bg)
        ok = r >= need
        fails += not ok
        print("%-38s %7.2f %6.1f  %s" % (label, r, need, "pass" if ok else "** FAIL **"))
    print()
    if fails:
        print("%d pair(s) below AA. Darken the token and re-run." % fails)
        return 1
    print("All pairs meet WCAG AA.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
