# HexCore Tower V5 — exterior art reconstruction

## Read first
- This is a complete repository-root website snapshot, not a loose patch. Publish the included folder structure as-is to GitHub Pages.
- The original V4.13 interaction code remains present. V5 replaces the `continuousPlaza()` art build with the `buildExteriorV5()` pipeline. It does not rewrite the NPC dialogue, character selection, departments, existing lobby, menus, floor transit, or controls.
- No screenshot is pasted onto the tower. All visible architecture is explorable 3D geometry in Three.js, with newly authored texture maps.
- **No claim of photo-identical reconstruction.** The reference images are complex pre-rendered cinematic images. V5 is a substantial procedural 3D exterior approximation. The absence of sculpted production-grade human models and a production-grade art-directed GLB tower are known fidelity gaps.

## Scene geometry and preserved semantics
- Main door: `automaticEntrance(0,32)` untouched, and the unchanged `crossDoor()` changes outside ↔ lobby with the same live WebGL camera.
- Portal and department travel still operate through the original navigation functions.
- Player movement bounds unchanged. Ground-level playable front approach remains flush with the original fixed-height movement. Stair banks are beside the central walkway to prevent visually raised steps from requiring new movement/collision logic.
- Interior can remain a larger scene than exterior shell, per art brief.
- Floating island, irregular cliff underside, edge cascades, side/rear terraces, multiple structural elevated rings, radial skyline, dimensional tower fins, glass vestibule, neon trim, tree branch geometry, reflective obsidian cladding, and supplied sky/orbit routines included.

## Changed files
- `src/exterior-v5.js`: new integrated 3D art module, creates whole new exterior once and updates waterfall texture movement.
- `src/main.js`: imports new art module; replaces only visual exterior build function; drives waterfall offset during existing frame loop; clears scene environment between floors.
- `headquarters.html`: displays V5.0 and refreshes module cache key.
- `reference/v5-brushed-metal.jpg`, `reference/v5-obsidian-plaza.jpg`, `reference/v5-waterfall.png`: authored material textures.
- `reference/exterior-v5-{front,side,wide,rear}.png`: supplied reference pack included for visual comparison.

## Validation scope
- JavaScript parsing of both modules checked using Node.js.
- Asset names, file presence and ZIP integrity can be checked offline.
- The current production build loads Three.js from a public CDN; without browser networking to that CDN, an end-to-end 3D runtime or mobile frame-rate test cannot be certified here.
- V5 graphics are not a replacement for individually sculpted/lod-optimized GLB tower assets, full planar reflections, photorealistic dynamic waterfalls, or production-level humanoid NPC animation.
- Test on a private GitHub Pages branch before overwriting a live release. Keep a copy of V4.13 for rollback.
