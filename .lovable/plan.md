# Dark / light mode toggle

Add a theme switch to TripWise with a warm, brand-matched dark palette and smooth transitions — no flash of the wrong theme on load.

## What you get

- A sun/moon toggle button in the site header, on every page.
- Three states cycled from one control: Light, Dark, System (follows your device).
- Choice is remembered across visits and devices' own preference is respected by default.
- Smooth colour cross-fade when switching, instead of a hard snap.

## Design work

The current dark palette is the leftover default (cool slate/blue) and clashes with the warm sand/pine/terracotta identity. It gets rewritten to a warm dark theme:

- Deep pine-tinted background and cards instead of blue-grey.
- Terracotta accent kept as the highlight colour, slightly brightened for contrast on dark.
- Sand/sun tokens re-tuned so hero overlays, cost tables, score rings and cards stay readable.
- Contrast checked for body text, muted text and buttons.

## Technical notes

- Add a small `ThemeProvider` (React context) storing `light | dark | system` in `localStorage` under `tripwise-theme`, toggling the `dark` class on `<html>` and listening to `prefers-color-scheme` changes while in system mode.
- Inject a tiny blocking inline script in the `__root.tsx` head so the class is applied before first paint (prevents flash and hydration mismatch); render the toggle icon only after hydration to avoid a mismatch warning.
- Extend `src/styles.css`: rewrite the `.dark` block with warm oklch values matching the existing token names (including `--sand`, `--clay`, `--pine`, `--sun`), and add a short `background-color`/`color`/`border-color` transition on base elements, disabled under `prefers-reduced-motion`.
- Add `ThemeToggle` component under `src/components/tripwise/`, mounted in `SiteHeader` next to the nav; accessible label and `aria-pressed`/title reflecting current mode.
- Audit pages for hardcoded light-only classes (hero overlay gradients, `bg-sand` footer) and move them to semantic tokens where needed.
