# Senior Engineer — Runtime Visual Standard v1

## Scope

This pilot standard applies to the corrected runtime versions of:

- `senior-engineer-idle-runtime-v1.png`
- `senior-engineer-walk-runtime-v1.png`

The original master files remain unchanged.

## Runtime sheet

- Canvas: 384 × 512 px
- Layout: 3 columns × 4 rows
- Cell: 128 × 128 px
- Format: RGBA PNG
- Alpha: binary only (0 or 255)
- Resampling: nearest-neighbor
- Ground shadow: none

## Character registration

- Visible character height: exactly 100 px
- Top of visible bounds: y = 17 within each cell
- Foot baseline: bounding-box bottom at y = 117
- Bottom margin: 11 px
- Horizontal target center: x = 64
- No limb crosses a cell boundary

## Direction and frame map

Rows:

1. Facing down / toward viewer
2. Facing left
3. Facing right
4. Facing up / away from viewer

Columns:

1. First motion or breathing phase
2. Neutral pose
3. Second motion or breathing phase

## Consistency rules

- The right-facing profile is an exact horizontal mirror of the left-facing profile.
- Idle and walk use the exact same neutral frame in every direction.
- Front and rear walk frames keep symmetrical open-step silhouettes.
- Glasses, beard, hairstyle, hoodie, jeans, sneakers and ID badge remain readable.
- Runtime outlines resolve to crisp one-pixel clusters where practical.
- No anti-aliasing, gradients, partial alpha, ground shadows or texture noise.
- Future Senior Engineer states must use the same cell, visible height, center and baseline.
- Enemy sheets may use a different visible footprint, but must retain the same 128 × 128 cell and registration principles.

## Protected masters

- `senior-engineer-idle-spritesheet.png`
  - SHA-256: `239BFEF39C6359FE259EB41309FBDFF51224B2AE7BAACDCE330A292D6B9B0AC4`
- `senior-engineer-rpg-spritesheet.png`
  - SHA-256: `61222C9C5B24B3BA5023A71B16B776C064DFFADC2F9097F1B8A625FDD67E34D5`
