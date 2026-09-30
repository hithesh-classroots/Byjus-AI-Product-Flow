# Byjus.AI — Type Scale

The direct answer to "what fonts and sizes does this product use".

## Font

One font stack. Nothing is downloaded — no Google Fonts, no webfonts.

```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

This is a **system font stack**: the browser uses the first name installed on the device, so exactly one font ever renders.

| Device | Renders |
|---|---|
| Mac, iPhone, iPad | **SF Pro** (`-apple-system`) |
| Windows | **Segoe UI** |
| Android | **Roboto** |
| Other | Helvetica → Arial → generic sans |

`BlinkMacSystemFont` is the older Chrome-on-Mac spelling of `-apple-system` — the same font. Helvetica/Arial/sans-serif are last-resort fallbacks that in practice never render.

## Sizes — 8 values

| Token | Size | Weight | Used for |
|---|---|---|---|
| `display` | 38px | 800 | Celebration headline, hero display |
| `title` | 30px | 800 | FTUE card headline, chapter titles, board titles |
| `heading` | 24px | 700 | Modal titles, section headers |
| `subheading` | 20px | 700 | Sub-headings, "Locked", loader title |
| `body` | 16px | 500 | **Default** — chat bubbles, module rows, composer input |
| `secondary` | 14px | 500 | Meta text, chips, buttons |
| `caption` | 12px | 600→700 | Breadcrumb, step counter, badges |
| `eyebrow` | 11px | 700 | Uppercase micro-labels (+0.6px tracking) |

## Weights — 3 values

`500` regular · `700` bold · `800` heavy

## Documented exception: decorative numerals

Chapter Journey's planet and chapter numbers are graphic elements, not text, and sit outside the text scale:

`44px` · `48px` · `58px` — exposed as `--fs-numeral-sm` / `--fs-numeral-md` / `--fs-numeral-lg`

## Where the tokens live

Add nothing new — pick from these.

**`app-cosmos.js`** (Home, chat, journey map, dashboard) — next to the `SYS` constant:

```js
const T={ display:38, title:30, heading:24, subheading:20, body:16, secondary:14, caption:12, eyebrow:11 };
const FW={ regular:500, bold:700, heavy:800 };
```

**`.dc.html` pages** (Teaching Room, Chapter Journey, Home shell, FTUE Demo) — CSS custom properties in `<helmet>`:

```css
--fs-display --fs-title --fs-heading --fs-subheading
--fs-body --fs-secondary --fs-caption --fs-eyebrow
--fs-numeral-sm --fs-numeral-md --fs-numeral-lg
--fw-regular --fw-bold --fw-heavy
```

## What changed

Before: 26 distinct sizes with half-pixel steps (11.5, 12.5, 13.5, 15.5, 18.5) and 5 weights (500–900), all typed inline as raw numbers.

After: 8 sizes, 3 weights, named once. 264 declarations were remapped across four files.
