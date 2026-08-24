#!/usr/bin/env python3
"""Builds the ZEVREN Commandokamer dashboard.

Reads the outreach ledger, the newest daily prospect file, its -verified
companion when Azzouz has run, and the git log for agent health, and
writes one self-contained HTML page. The Opzichter republishes that page
to the same artifact URL every morning.

Usage: python3 tools/dashboard.py --out /path/to/dashboard.html
"""
import argparse, datetime, json, pathlib, re, subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "marketing" / "outreach"

def sh(*args):
    try:
        return subprocess.run(args, cwd=ROOT, capture_output=True, text=True, timeout=30).stdout.strip()
    except Exception:
        return ""

def ledger_stats():
    counts = {"drafted": 0, "sent": 0, "replied": 0, "afgevoerd": 0}
    text = (OUT_DIR / "contacted.md").read_text(encoding="utf-8")
    for line in text.splitlines():
        if not line.startswith("|") or line.startswith("| Business") or line.startswith("|---"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 3:
            continue
        status = cells[2].lower()
        if status.startswith("drafted"):
            counts["drafted"] += 1
        elif status.startswith("sent"):
            counts["sent"] += 1
        elif status.startswith("replied"):
            counts["replied"] += 1
        else:
            counts["afgevoerd"] += 1
    return counts

CARD_RE = re.compile(r"\n## (\d+)\. (.+?)\n(.*?)(?=\n## \d+\. |\Z)", re.S)
META_RE = re.compile(r"^- \*\*(.+?):\*\*\s*(.+?)(?=\n- \*\*|\n\n|\Z)", re.S | re.M)
CODE_RE = re.compile(r"```\n(.*?)\n```", re.S)

def parse_daily(path):
    cards = []
    text = "\n" + path.read_text(encoding="utf-8")
    for m in CARD_RE.finditer(text):
        num, title, body = int(m.group(1)), m.group(2).strip(), m.group(3)
        name, _, city = title.partition(" — ")
        meta = [[k, " ".join(v.split())] for k, v in META_RE.findall(body)]
        codes = CODE_RE.findall(body)
        if len(codes) < 2:
            continue
        confirmed = any(k.lower().startswith("actief bevestigd") or
                        (k.lower() == "actief") for k, v in meta)
        email = next((v for k, v in meta if k.lower().startswith("e-mail")), "")
        if "@" not in email:
            email = ""
        cards.append({
            "n": num, "name": name.strip(), "city": city.strip(), "meta": meta,
            "subject": codes[0], "message": codes[1], "email": email,
            "status": "confirmed" if confirmed else "check",
        })
    return cards

def merge_verified(cards, path):
    """Overlay Azzouz's verdicts. Tolerant: match sections by card name."""
    text = path.read_text(encoding="utf-8")
    sections = re.split(r"\n## ", "\n" + text)
    for card in cards:
        sec = next((s for s in sections if card["name"].lower() in s.splitlines()[0].lower()), None)
        if sec is None:
            continue
        if "AFGEKEURD" in sec:
            card["status"] = "rejected"
            reason = re.search(r"AFGEKEURD[:\s—-]*(.+)", sec)
            if reason:
                card["verdict"] = " ".join(reason.group(1).split())[:300]
        elif "GOEDGEKEURD" in sec:
            card["status"] = "approved"
            ev = re.search(r"GOEDGEKEURD[:\s—-]*(.+)", sec)
            if ev:
                card["verdict"] = " ".join(ev.group(1).split())[:300]
            codes = CODE_RE.findall(sec)
            if len(codes) >= 2:
                card["subject"], card["message"] = codes[0], codes[1]
    return cards

def newest_daily():
    """All cards from every file of the newest date that has any, renumbered."""
    files = [p for p in OUT_DIR.glob("20*.md") if "verified" not in p.name]
    for date in sorted({p.name[:10] for p in files}, reverse=True):
        day_files = sorted(p for p in files if p.name.startswith(date))
        cards = []
        for p in day_files:
            cards.extend(parse_daily(p))
        if cards:
            for i, card in enumerate(cards, 1):
                card["n"] = i
            return date, cards
    return None, []

def agent_health():
    def last(pathspec):
        date = sh("git", "log", "-1", "--format=%cs", "--", *pathspec)
        return date or "nooit"
    return [
        {"who": "Sam", "taak": "dagelijks ≥10 prospects", "laatst": last(["marketing/outreach/20*.md"])},
        {"who": "Azzouz (verificatie)", "taak": "dagelijkse controle", "laatst": last(["marketing/outreach/*verified*"])},
        {"who": "John", "taak": "weekpack + artikel (ma)", "laatst": last(["marketing/social", "zevren/lib/insights"])},
        {"who": "Azzouz (rapport)", "taak": "weekrapport (zo)", "laatst": last(["marketing/reports"])},
    ]

def build(out_path):
    day, cards = newest_daily()
    checked = False
    if day:
        for cand in sorted(OUT_DIR.glob(f"{day}*verified*.md")):
            cards = merge_verified(cards, cand)
            checked = True
    payload = {
        "gen": datetime.date.today().isoformat(),
        "bron": day or "geen bestand",
        "geverifieerd": checked,
        "stats": ledger_stats(),
        "agents": agent_health(),
        "cards": cards,
    }
    template = (ROOT / "tools" / "dashboard.template.html").read_text(encoding="utf-8")
    html = template.replace("__PAYLOAD__", json.dumps(payload, ensure_ascii=False).replace("</", "<\\/"))
    out_path.write_text(html, encoding="utf-8")
    print(f"{out_path}: {len(cards)} kaarten van {payload['bron']}, geverifieerd={checked}")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    build(pathlib.Path(ap.parse_args().out))
