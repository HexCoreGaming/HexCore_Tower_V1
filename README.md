# HexCore Gaming — V5.0 exterior visual overhaul

This ZIP contains a **full GitHub Pages site**, including `index.html`, `headquarters.html`, `holographic.html`, the original website scripts/data, art source, textures, references and build notes.

**Primary change:** the 3D exterior uses a new, substantially detailed 360-degree scene: raised floating island with engineered undersides, side and rear terraces, many lit waterfalls, large structural double skybridges, angular dimensional tower with layered vertical facade and rear massing, glass atrium, dimensional lit HexCore emblem, carved plaza, branching violet trees, and bespoke metallic and stone materials.

**Preserved:** entrance transitions without page loading, shared interior/exterior scene, walking controls, character choices, NPC content and interactions, menus, department destinations, holographic mode, admin tools, and floor transit. No NPC character model replacement or department interior overhaul has been carried out in this exterior release.

**Important:** This is a **procedural, modeled WebGL art implementation** based on the supplied reference pack, not a pixel-perfect recreation or a production-grade sculpted tower asset. Performance, exact lighting and appearance need evaluation in a networked WebGL browser; the sandbox could run syntax and mocked scene-construction checks but not a real WebGL playback (the Three.js CDN was unreachable here). Avoid overwriting your live GitHub site until you've tested this on a private branch. The original V4.13 should be retained for rollback.

## Installation

Upload the contents of this ZIP **at your repository root**, maintaining directory names exactly. Continue entering through `index.html`; `headquarters.html` imports `src/exterior-v5.js` automatically. Do not paste individual function snippets into the live site.

Read `docs/EXTERIOR_V5_BUILD_NOTES.md` for detailed changes and validation limitations.
