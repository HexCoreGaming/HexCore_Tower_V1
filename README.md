# HexCore Tower V3.8 — Cosmic Stability and Visual Coherence

Extract **the ZIP contents** into your GitHub Pages repository root, replacing previous files.

## Implemented
- Single approved purple space background with procedural blue/violet drifting 3D cloud layers; removed repeated full-image panoramas that made the sky jumbled.
- During planet overlap, the exact `reference/glitch-world-live.png` art replaces the normal space sky (not an additive image piled over normal nebula paintings). Animated code columns, rifts and fragments exist in front of it.
- Corruption-related geometry is not rendered in the normal phase; the code uses two shared moving glyph textures instead of many independent uploads.
- Planet overlap timing remains 10 seconds normal + 10 seconds corrupted.
- The single procedural 3D entity is oriented to face the platform, has a claw extending forward, additional glowing fissures, and animated mouth/head/arms.
- Strong reduction in doorway-preview rendering cost: only rendered when within 17 units of the entrance, throttled and skipped during exterior corruption. Automatic door/crossing behavior remains.
- Default desktop automatic graphics quality is medium to reduce GPU stalls. Visitors can still explicitly select High.

## Verification limitation
JavaScript syntax and archive integrity are checked. Pixel-perfect visual matching and frame-rate stability on real phones and PCs **cannot be guaranteed without device/browser testing**. No separate image was generated.

## Next planned
After testing V3.8, fix any residual startup/overlap performance bottlenecks and improve the 3D entity silhouette against the approved reference art, before department interiors.
