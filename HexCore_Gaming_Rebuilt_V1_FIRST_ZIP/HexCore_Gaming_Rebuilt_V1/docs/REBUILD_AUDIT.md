# REBUILD AUDIT — VERSION 1

Source reference: original user ZIP `ziiip(1).zip`.

## Excluded by design
No imports from `world/**`, original `assets/models/**`, original `assets/textures/**`, original `core/interiorNavigation.js`, original `world/towerDirectory.js`, original NPC world placements or original elevator scripts.

## Explicitly preserved information
- `data/preservedLegalDialogue.js`: byte-for-byte copy of original `npcs/adminDialogue.js`. Includes original NPC names, question wording, full answers and 41 Q&A entries. This is an explicitly authorized exception.
- Existing mobile/desktop input behavior reimplemented; not copied as old source code.

## New sources
- `index.html`: created anew.
- `src/main.js`: created anew; geometry, floor transitions, interaction system, editor, and Legal Archive.
- `src/style.css`: created anew.

## Approved visual reference images
- `reference/approved-tower.png`
- `reference/approved-lobby.png`
These are references only and not pasted into the playable scene as a fake background. Tower and lobby are constructed from real Three.js geometry.

## Known limitations
- This is the FIRST deliverable/prototype build, not the final polished website.
- Proposed floor assignments are not final approvals.
- Source inspection and syntax validation do not replace mobile/browser QA.
