# HEXCORE GAMING — CLEAN REBUILD V1 (FIRST ZIP)

This is the FIRST runnable rebuild package, NOT the final completed multi-stage website. Built from an empty Three.js scene. The original world code, models, textures, city and floor scripts are NOT imported.

## Included
- New original procedural tower exterior and immediate exterior plaza (simple mobile-target geometry).
- New original enormous spawn lobby based on the approved visual direction.
- Nine proposed destinations with elevator interface, usable department consoles, interactive doorways, and return to lobby.
- Original `npcs/adminDialogue.js` dialogue kept VERBATIM, at `data/preservedLegalDialogue.js` (41 Q&A entries). Searchable Legal Archive and holographic assistant interface use it.
- Entry and character species/body choice UI; appearance choice is stored, but an animated third-person avatar/customizable 3D character is NOT implemented yet.
- Recreated WASD/mouse, Shift/run, E/USE interaction and dual-pad mobile controls. Graphics quality choices.
- Basic content editor in the administrative office: edit department headlines/descriptions/updates; save to this browser; import/export a JSON file. It does NOT securely authenticate or automatically publish to GitHub.
- Two user-approved visual reference images included to guide future upgrades.

## Not yet complete
The exterior/lobby use new mobile-suited geometric approximations, not scene-perfect copies of the reference images. No complete individual office furnishing, character customization mesh, AI NPC work routines, employee shifts, admin authentication, automatic publishing, full public forms, real support tickets, payments, arcade game demos, or full exterior civilization. Floor names/organization are PROVISIONAL until approved. The after-hours hologram is a searchable archive interface, not an animated AI woman.

## Install to GitHub Pages
1. Back up your original GitHub repository separately. Do not delete its `.git` directory.
2. Use a NEW empty repository or a NEW deployment branch for this replacement, so the old files are not accidentally mixed in. Do NOT merge this ZIP over the old world; that would preserve old files against instructions.
3. Extract this ZIP. Copy ALL files and folders from `HexCore_Gaming_Rebuilt_V1` into the new repository's root. `index.html` must be at the repository's publishing root, beside `src`, `data`, `reference` and `docs`.
4. Commit and push. Under repository **Settings → Pages**, set deployment from your chosen branch and root (`/`).
5. Open the provided Pages URL over HTTPS, wait for the initial load, select a character, then ENTER HEADQUARTERS.
6. Three.js loads via CDN, so the first visit requires internet. The actual published site is NOT completely offline.
7. On a phone test both touch pads, USE and RUN; on desktop test WASD, E, mouse look, elevators, floors and the Legal Archive.

## Admin content data
The office content editor saves ONLY on the present device using browser localStorage. Export a JSON backup for later import. This ZIP is intentionally not presented as secure admin publishing: GitHub Pages is a static site, and no passwords belong in public JavaScript.

## Notes
No account required for visitors. No payment provider required for the current demo. A few modules load from cdn.jsdelivr.net; to make dependencies self-hosted later, vendoring can be added. Use a modern WebGL-capable mobile browser.
