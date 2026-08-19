#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHOWCASES = ROOT / "Resources" / "Showcases"
GLOBAL_JS = ROOT / "Resources" / "showcase-manifest.js"
EXTS = {".png", ".jpg", ".jpeg", ".webp", ".avif"}


def sha12(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()[:12]


def pretty(name: str) -> str:
    stem = Path(name).stem
    stem = re.sub(r"^\d+[\s._-]*", "", stem)
    stem = re.sub(r"^OCPF[\s._-]*Showcase[\s._-]*", "", stem, flags=re.I)
    stem = re.sub(r"[_-]+", " ", stem)
    stem = re.sub(r"\s+", " ", stem).strip()
    return stem or "Showcase"


def load_old(path: Path) -> dict:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
        return obj if isinstance(obj, dict) else {}
    except Exception:
        return {}


def build_folder(folder: Path) -> dict:
    manifest_path = folder / "showcase.json"
    old = load_old(manifest_path)
    old_items = old.get("items") if isinstance(old.get("items"), dict) else {}
    images = sorted(
        [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in EXTS],
        key=lambda p: p.name.casefold(),
    )
    timestampish = bool(images) and all(re.match(r"^Screenshot\s+\d{4}-\d{2}-\d{2}\s+\d+", p.stem, re.I) for p in images)
    files = []
    items = {}
    for i, img in enumerate(images, start=1):
        old_meta = old_items.get(img.name) if isinstance(old_items.get(img.name), dict) else {}
        label = old_meta.get("label") or (f"View {i}" if timestampish else pretty(img.name))
        files.append({"name": img.name, "sha": sha12(img)})
        items[img.name] = {
            "order": old_meta.get("order", i * 10),
            "label": label,
            "tag": old_meta.get("tag", label),
            "caption": old_meta.get("caption", f"{folder.name} showcase view {i}."),
        }
        if old_meta.get("note"):
            items[img.name]["note"] = old_meta["note"]
    manifest = {"files": files, "items": items}
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    registry = {}
    if not SHOWCASES.exists():
        raise SystemExit(f"Missing showcase root: {SHOWCASES}")
    for folder in sorted([p for p in SHOWCASES.iterdir() if p.is_dir()], key=lambda p: p.name.casefold()):
        registry[folder.name] = build_folder(folder)
    js = "window.TYTO_SHOWCASE_MANIFESTS = " + json.dumps(registry, indent=2, ensure_ascii=False) + ";\n"
    GLOBAL_JS.write_text(js, encoding="utf-8")
    print(f"Updated {len(registry)} showcase folder(s) and {GLOBAL_JS.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
