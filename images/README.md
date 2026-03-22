# Image Assets

This folder keeps source assets and publishable PNG outputs.

Runtime assets (used in extension/listing):

- `icon.png`
  - 128x128 square
  - referenced by `package.json` as extension icon
- `banner.png`
  - referenced by `README.md`

Source assets (editable design files):

- `icon.svg`
- `banner.svg`

Notes:

- The VSIX excludes SVG source files to keep package size smaller.
- Regenerate PNGs from SVG sources with `npm run assets`.
