# HexCore Tower V3.9 — Sky Fracture / Smooth Overlap

## Fixes
- **No forced stop or snap during planet conjunction**: the larger cracked planet and smaller tech planet continue orbiting in opposite directions at constant speed. 10 seconds normal, 10 seconds corrupted for testing.
- **Corruption is SKY ONLY**: your supplied purple/cyan fractured-world artwork appears through animated jagged rifts in a sky shader; the tower, platform, and walkway remain in the scene.
- **Upward/downward code**: transparent code columns move using GPU time uniforms, with no CPU texture reuploads during overlap.
- **Reduced event rendering spikes**: entity and rift geometry is created before play, shaders stay in the render graph, and expensive effects have fewer draw calls.
- **One organic 3D apparition**: a curved, articulated head, grinning jaw, torso, flowing mantle, long reaching claw, and animated motion. Faces the platform from its right edge. It remains an in-browser procedural interpretation, *not* an exact professional character sculpt.
- Restores normal sky in the final two seconds before the figure arrives.
- Existing mobile controls, departments, legal answers, NPCs and entry doors preserved.

## Install
Extract the **contents** of this ZIP directly to the root of your `HexCore_Tower_V1` GitHub repository, replacing older files. Commit and Push Origin.

## Testing
A syntax and ZIP integrity check cannot guarantee visual quality or device-specific framerate. Confirm in the deployed browser. For best performance, use Low quality on mobile.

## Next
Based on your visual feedback, refine 3D apparition modelling and performance, then department interiors.
