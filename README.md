# HexCore Tower V3.7 — Startup / Doorway / Overlap Stability

Complete replacement website. Copy the **contents** of this ZIP to the GitHub repository root.

Changes:
- Spawn at the front platform edge facing the tower (preserved).
- Prebuild the exterior world while the welcome screen is displayed so ENTER reuses it rather than constructing two scenes synchronously.
- Prepare lobby in a deferred task after the first playable frame, then reuse both real scenes when crossing the sliding doors.
- Fix the doorway render plane being hidden behind tower geometry; preview samples the real opposite world, at a reduced resolution and rate for performance.
- Stop repeatedly uploading large code-rain texture canvases to the GPU during the corruption event. Texture UV offsets are changed without forcing an expensive texture reupload.
- Preserve 10-second-to-overlap / 10-second-corruption test, continuous opposite planetary orbits, one entity, existing tower and mobile controls.

**Testing note:** Doorway preview is a live, rate-limited view of the other world, not a single shared continuous 3D world. On the first visit, background lobby preloading is done asynchronously; visual consistency and performance should be confirmed on the target device.
