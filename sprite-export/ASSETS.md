# Asset manifest

This export contains the final graphic assets created for BugSlayer. Chroma-key sources, transparency-processing intermediates, and superseded pre-registration sheets are deliberately excluded.

## Direction convention

For every 3 × 4 spritesheet, frames are arranged left-to-right, top-to-bottom:

- Row 1: facing down / front.
- Row 2: facing left.
- Row 3: facing right.
- Row 4: facing up / back.

Each row has three sequential animation frames.

| File | Dimensions | Frames | Frame size | Animation directions | Purpose |
|---|---:|---:|---:|---|---|
| `bugslayer_logo.png` | 1254 × 1254 | N/A | N/A | N/A | Main BugSlayer pixel-art logo. |
| `output/imagegen/senior-engineer-rpg-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; frames are left step, neutral, right step. | Player walking animation. |
| `output/imagegen/senior-engineer-rpg-spritesheet-with-keyboard-attack.png` | 1536 × 4096 | 24 (3 × 8) | 512 × 512 | Rows 1–4: walking in the four standard directions. Rows 5–8: keyboard attack in the same directions. | Combined player movement and keyboard-attack sheet. |
| `output/imagegen/senior-engineer-idle-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; inhale, neutral, exhale / blink. | Player idle loop. |
| `output/imagegen/senior-engineer-attack-keyboard-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; left-hand typing, centered typing, right-hand typing. | Player keyboard typing attack. |
| `output/imagegen/senior-engineer-damage-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; impact, recoil, recovery. | Player hit reaction. |
| `output/imagegen/senior-engineer-defeat-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; stagger, collapse, defeated pose. | Player defeat animation. |
| `output/imagegen/parse-mantis-concept-sheet.png` | 1254 × 1254 | N/A | N/A | Main three-quarter view, four-direction turnaround, attack studies, mechanical details, and palette. | Parse Mantis visual-design reference. |
| `output/imagegen/parse-mantis-idle-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; low-power intake, neutral, scan pulse. | Parse Mantis idle loop. |
| `output/imagegen/parse-mantis-linear-attack-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; charge, linear discharge, recovery. | Parse Mantis slow linear-attack animation. The projectile itself is not included. |
| `output/imagegen/parse-mantis-damage-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; impact, recoil, recovery. | Parse Mantis hit reaction. |
| `output/imagegen/parse-mantis-defeat-spritesheet.png` | 1536 × 2048 | 12 (3 × 4) | 512 × 512 | Down/front, left, right, up/back; critical failure, collapse, inert pose. | Parse Mantis defeat animation. |
