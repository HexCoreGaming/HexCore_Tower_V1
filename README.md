# HexCore Gaming — V6.0 visual replacement

**Complete GitHub Pages website.** Upload all files while retaining the existing directory hierarchy. Enter through `index.html` as before. The original V4.13 backup should be retained as a rollback point.

## What is actually different from V5

- Removed the V5 exterior construction module from the active render path. Its black forest of tall spikes is no longer generated.
- The exterior now uses **the owner's approved art textures** for the tower's front, back and flanks, mapped to relief-deformed 3D surfaces, with separate layered campus panoramas. This is substantially closer visually to the supplied design than black procedural spires. This is art-referenced surface reconstruction, **not** a fully sculpted high-fidelity 360-degree GLB tower.
- Rebuilt the physical 3D plaza with panelized pavement, inlaid lighting, the ground H emblem, grand side steps with a continuous flat accessible middle approach, raised landscaped terraces, looping deck-like ring skybridges, cliff structure and edge waterfalls.
- Replaced the old rectangular-torso/spherical-head NPC mesh assembly with custom stylized human/elf meshes: anatomical body and head contours, jacket lapels and seams, trousers, modeled hair/face, shaped elf ears, boots, badges and animated arms. NPC dialogue, names, roles and interactions are untouched.
- The character creator now previews the same live Three.js character mesh instead of a 2D placeholder drawing.
- Kept the original `src/main.js` movement, floor state, seamless shared-scene entrance, existing automatic doors, portal travel, department content, administrative tools and interactions. Existing outside and lobby remain in one scene.

## What has NOT been achieved or tested

- **Not pixel-identical, not a true fully modeled rear/side tower and not verified to meet a specific console-generation art standard.** The approved artwork provides relief-textured elevations, which can appear flat at oblique viewing angles. Only professional 3D model production can eliminate that limitation completely.
- Department interiors have not been redesigned in this package.
- Character meshes are bespoke stylized procedural 3D, **not** scanned/rigged professional character GLBs. They should be judged in-game.
- The sandbox Chromium installation blocks all page navigation, including local HTML; therefore **no real in-browser visual test or FPS measurement could be completed**. This package was syntax checked and statically audited but still needs testing on a private GitHub branch.

## Installation and testing

1. Preserve the previous working repository state (a branch or complete ZIP).
2. Upload the **entire content of this archive to the repository root**; keep `reference/v6/`, `src/`, `data/`, and other directories intact.
3. Start from `index.html`. Check exterior at entry, enter the same automatic doorway, speak with an NPC, use floor transit and return to the exterior.
4. If any mechanic breaks, revert and report the exact behavior; do not ship untested changes to your main visitors.

Images used as reference-derived textures come from the owner-supplied visual references inside this package. The visual modules do not introduce new third-party game assets.


## V6.0.7 exterior-only update
Split the approved facade images into 17 architectural texture assets under `reference/v602`; layered crown, wings, sign, entrance and elevations onto physically stepped massing. Added elevated landscape terraces, sculpted island edge, localized waterfall treatments, and new side/drop structures. The NPC character module, dialogues, original door crossing, floor travel and controls have not been modified. This is an image-assisted visual reconstruction and not a full 360-degree photogrammetry model.


V6.0.18 update:
- walkway side images converted to continuous connected strips
- tower artwork refreshed with the provided front/side/back images to remove the missing black square
- loading / transit screen now uses the animated network-tunnel image


V6.0.18 update:
- segmented front/side/back tower image crops to fit the stepped tower massing
- character-click loading screen now explicitly shows the provided tunnel image


V6.0.18 update:
- side walkway images now use a cropped wall/water/tree/pillar strip
- removed the extra sky/background from those side gallery images
- moved the side gallery strip down so it sits on the ground instead of floating


V6.0.18 update:
- filled the front-tower black square by adding real tower geometry behind the facade art
- no tower image was modified; only the structure was changed

V6.0.18: Removed obstructing central front tower blocks; rebuilt a recessed facade backing below the logo, above the entrance. Images and mechanics unchanged.


## V6.0.26 floor-only fix
- floor base image and H-center floor image stabilized
- reduced excessive reflectivity/clearcoat that caused the floor to visually flash when moving
- added mipmapped filtered floor textures for cleaner movement
- no tower, NPC, collision, movement or layout changes


V6.0.30: Department portal behind reception, animated energy shader, black-void department platforms with overhead fixtures; bottom exploration HUD hint removed. Exterior unchanged.


## V6.0.32 — Department dimension backgrounds
Eight supplied panoramas, in the order supplied, assigned to company, games, support, legal, community, business, hardware, and admin departments. Implemented as inside-facing spherical environment maps. No exterior, platform, movement, lighting, or NPC code changed.


## V6.0.32 — Department architecture
Eight distinct modeled room arrangements: company gallery, games hangar, support pods, legal archives, community amphitheater, business hall, hardware engineering, and private office. Existing eight background images, travel and interactions retained.


## V6.0.33 Administration
Open `admin/index.html` on GitHub Pages. See `docs/SHARED_CMS.md` for auth, publishing, media, and shared-content limitations.
