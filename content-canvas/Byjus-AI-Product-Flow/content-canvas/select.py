#!/usr/bin/env python3
"""Emit a compact, concern-specific Content Canvas context bundle."""
from __future__ import annotations

from pathlib import Path
import argparse
import json

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source"


def bundle(concern_id: str, types: list[str] | None = None) -> dict:
    manifest = json.loads((SOURCE / "manifest.json").read_text())
    concern = next((item for item in manifest["concerns"] if item["id"] == concern_id), None)
    if not concern:
        choices = ", ".join(item["id"] for item in manifest["concerns"])
        raise SystemExit(f"Unknown concern {concern_id!r}. Choose one of: {choices}")
    result = {
        "version": manifest["version"],
        "concern": concern_id,
        "covers": concern["covers"],
        "guidance": {path: (SOURCE / path).read_text() for path in concern["readFiles"]},
        "resources": [str(Path("source") / path) for path in concern["resourceFiles"]],
    }
    component_types = concern.get("componentTypes", [])
    if component_types:
        specs = json.loads((SOURCE / manifest["shared"]["componentSpecs"]).read_text())
        missing = [name for name in component_types if name not in specs]
        if missing:
            raise SystemExit(f"Concern {concern_id!r} names unknown component types: {missing}")
        result["componentSpecs"] = {name: specs[name] for name in component_types}
        result["componentSource"] = str(Path("source") / manifest["shared"]["componentSpecs"])
    # 2.4: interaction presets live in their own spec file; --types narrows them
    if concern.get("interactionSpecs"):
        specs = json.loads((SOURCE / manifest["shared"]["interactionSpecs"]).read_text())
        wanted = types or list(specs)
        missing = [name for name in wanted if name not in specs]
        if missing:
            raise SystemExit(f"Unknown interaction types: {missing}. Choose from: {', '.join(specs)}")
        result["interactionSpecs"] = {name: specs[name] for name in wanted}
        result["interactionSource"] = str(Path("source") / manifest["shared"]["interactionSpecs"])
        if concern.get("behaviourTokens"):
            result["behaviourTokens"] = json.loads((SOURCE / manifest["shared"]["behaviourTokens"]).read_text())
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("concern", help="Stable concern id from content-canvas.index.json")
    parser.add_argument("--types", help="Comma-separated interaction preset types to keep (interaction concern)")
    parser.add_argument("--compact", action="store_true", help="Emit compact JSON")
    args = parser.parse_args()
    types = [t.strip() for t in args.types.split(",")] if args.types else None
    print(json.dumps(bundle(args.concern, types), ensure_ascii=False, indent=None if args.compact else 2))
