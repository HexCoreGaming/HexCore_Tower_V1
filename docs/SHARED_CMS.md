# HexCore shared content management — V6.0.33

- Open `/admin/` for the admin dashboard. The user-requested password is **not embedded**, because GitHub Pages is a public static host and cannot safely enforce password access.
- For actual repository publishing, generate a GitHub fine-grained token restricted to this one repository, with **Contents: Read and write**. Enter it into the dashboard; it remains in JavaScript memory for the session, not localStorage or the repository. This is repository-owner GitHub authorization, not a standalone username/password system.
- The local offline mode supports editing and downloading backups without logging in. It cannot publish.
- Public content is stored in `data/managed-content.json`. The 3D website and holographic website both read this file, but local browser edits take priority in the game if present.
- `src/managed-content.js` can be copied into the **separate normal website repository** and referenced by its views to share the content. That separate website was not part of the uploaded archive and is **not yet integrated**. For cross-repo sync, configure deployment to publish the same JSON to both repos or host the JSON at a shared URL.
- Existing preserved legal dialogue is not overwritten. Editable overrides of preserved representative questions are stored in the managed JSON. Check approval and legal accuracy before publishing.
- Image uploads are stored in the repository, with an 18MB dashboard limit. Host larger videos elsewhere and add their URL.
- Security: The URL `/admin/` is publicly reachable; only GitHub-authorized accounts with write access can publish. Do not treat page visibility as secure authentication. For a truly private interface, deploy the CMS on an authenticated host/backend.
