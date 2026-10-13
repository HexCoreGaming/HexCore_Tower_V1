# HEXCORE TOWER — V3

Complete GitHub Pages replacement for V2. **V3** is visible on the loading screen, home/character screen, and in-game HUD.

## Changes in V3
- Company Representative Alex Morgan can be approached in the lobby and asked the existing original questions.
- Legal floor includes four interactive company/legal representatives: Alex Morgan, Victoria Hale, Naomi Reed, and Daniel Cross. Each has their original questions and answers.
- All original questions and answers are preserved byte-for-byte from V2.
- Existing WASD, mouse and dual-pad mobile controls are retained.

## Installation with GitHub Desktop
1. Extract this archive.
2. In GitHub Desktop select `HexCore_Tower_V1`, then Repository > Show in Explorer.
3. Replace old website files with everything at the top level of this archive. Make sure `index.html` is directly at the repository root.
4. Commit to `main`, then Push origin.
5. Verify Settings > Pages publishes from main / (root). Once deployed, refresh and look for **V3**.

## Limits
This is a staged website build, not completed AAA graphics. Admin publishing remains local/export only. NPCs can answer original prepared questions, but do not have freeform AI. No external server is needed to browse the site, but Three.js currently loads from a CDN. Testing is static only; browser/device performance is not yet validated.
