# HEXCORE TOWER — MOBILE FIRST V1.1 — CONTROLS AND ENVIRONMENT UPDATE

This is a **new, clean 3D website project**, built as a mobile-first version of the two supplied visual concepts. It does not contain any 3D assets, textures, maps, elevators, interiors, or navigation code copied from the original uploaded old world. The only user-source content retained from that ZIP is the NPC question-and-answer archive; mobile dual-stick movement behavior is recreated in new website code.

## Install with GitHub Desktop
1. In GitHub Desktop choose `HexCore_Tower_V1`, then **Repository → Show in Explorer**.
2. Back up your repository files outside the repository if needed.
3. Extract this ZIP and copy its **contents** (`index.html`, `src`, `data`, `reference`, `docs`, `.nojekyll`, `README.md`) directly into the repository root. Remove the *previous prototype files* that are being replaced; avoid preserving nested old implementations.
4. Commit and **Push origin**.
5. At GitHub.com select repository **Settings → Pages → Deploy from a branch → main → /(root)**.
6. Visit `https://hexcoregaming.github.io/HexCore_Tower_V1/`.

## Controls
Desktop: click scene to capture pointer; WASD move, mouse to look, Shift run, E interact, Escape navigation. Mobile: two touch sticks, USE, RUN.

## What is implemented
New procedural 3D tower exterior and immediate plaza, expanded cathedral-scale lobby, fresh department-floor interiors, functioning directory and floor transitions, NPC help archive containing all original questions and answers, responsive first-person touch and desktop controls, editable local content panels. Reference concepts included only for review and entry graphics.

## What isn't complete
This is a functional replacement **release candidate**, not a pixel-identical 3D realization of the concept paintings or a finished AAA game. No secure administrator publication, real-time customer support, fully animated character creation, deep NPC workplace simulation, or extensive exterior civilization is implemented. The admin editor is local-only. A separate server/authenticated GitHub publishing workflow is needed before anyone can securely publish content from the in-world dashboard.

Requires an Internet connection to load the Three.js module from CDN; the website itself is single-player, without accounts.


## V1.1 update
- Corrected desktop WASD to camera-relative forward, backward, left strafe and right strafe.
- Preserved continuous pointer-lock mouse-look during ordinary gameplay. Menus release the cursor; close buttons re-request pointer lock following the click. Browser Escape/tab restrictions still apply.
- Added new low-cost neo-futuristic architectural geometry, structural fins, gallery details, lighting, seating and reception accents for tower and lobby.
- Preserved the Q&A file exactly. No prior-world models, textures or building interiors have been introduced.
- This ZIP is not padded to a requested size. The current code-built geometry is compact and package size reflects real content.
- JavaScript syntax and archive integrity checked; interactive browser/mobile performance not verified in this execution environment.
