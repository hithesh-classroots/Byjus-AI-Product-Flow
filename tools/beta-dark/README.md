# Beta dark builds

Light and dark are separate page builds here, the way this prototype already
ships dark (`Teaching Room - Dark.dc.html` is hand-authored). These scripts
regenerate the dark half of the beta set.

The rule throughout: **prefer the designer's own work over anything inferred.**

| screen | dark build comes from |
|---|---|
| Chapter Journey | generated, then colours + island surfaces lifted from `Chapter Journey - Dark.dc.html` |
| Teaching Room | `Teaching Room - Dark.dc.html`, copied — not generated |
| Guided Retry | generated; no dark reference exists for it |

Run `sh tools/beta-dark/build.sh` from the repo root.

## Why it is not a simple find-and-replace

- `#fff` is a card background in one place and text in another, so colours are
  keyed on the CSS property they belong to.
- A light neutral surface must become a dark surface, never the ink colour.
- A saturated colour keeps its hue when the mapping has to be inferred;
  explicit designer mappings are taken as-is, because they do shift hues on
  purpose.
- Translucent white cards become a light veil at the same opacity, not
  translucent black, which would make them vanish.
- Shadows cast black.
- The island tile surface is not CSS at all — it comes from `const glass`,
  applied inline — so it is lifted as a block.

## Checking a change

`extract.py` rebuilds the palette model from the light/dark pairs and scores it
by regenerating Teaching Room's dark build and diffing against the hand-made
one. Last run: 84.9% of colour swaps exact, 1 case where it recoloured
something the designer had left alone.
