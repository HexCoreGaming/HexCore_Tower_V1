# V6 exterior/art implementation

Active: `src/exterior-v6.js`, `src/stylized-characters.js`.

All reference-based relief and campus image assets are stored in `reference/v6/`. `generate_visual_assets.py` documents how the texture cutouts were produced from the owner-supplied reference images.

The front entrance still crosses `DOOR_Z = 32` in `src/main.js`. The new visual scene invokes the existing `automaticEntrance(0,32)` and does not own door state or callbacks.

`employee()` still registers the same staff actors, names, roles, tags and speech. It only creates a new display model. The creator now displays the same 3D model.

Do not misrepresent the reference-projected facades as a wholly hand-sculpted architectural model: side-view projection is approximate.
