# HexCore Tower V3.6 — Seamless Entrance and Exterior Spawn

Full GitHub Pages website replacement. Extract **the ZIP contents directly to repository root** and commit/push.

Changes from V3.5:
- Start at (0, eye height, 181) on the exterior platform facing toward the tower, near the outer edge.
- Build the actual exterior and lobby scene at initial entry, with cached geometry for both directions.
- Removed false lobby/exterior stand-in scenery from the opposite side of sliding glass doors.
- Real-world doorway projection: near the doors, preview the *other preloaded scene* as a live perspective-correct WebGL render, including moving cosmic effects when viewing outside from the lobby.
- Door panels in both scene versions animate together; walking across the opening switches instantly at z=32 without reloading, rebuilding, yaw change, or moving the camera.
- Live doorway previews are rendered only when near the entrance, and the extra render pass runs at a lower refresh rate on phones.
- Existing mobile MOVE/LOOK, INTERACT, RUN, NPCs, Legal content, tower, landscaping and V3.5 cosmic overlap/event remain intact.

Reality check: previews use an additional WebGL render target and are visually accurate to the current destination scene. They are not a shared physical 3D building; overlap and performance need browser/device testing. Rendering of live previews consumes GPU time only while near the doorway.
