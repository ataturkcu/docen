# Configuration

The engine logic is driven by a single JavaScript file: `js/config.js`.

### Base Configuration

Here are the basic options you can change:

- `title`: The title that appears at the top left of the sidebar.
- `baseDir`: The directory where the markdown files live. By default, it's `./docs/`.
- `homePage`: The default file to show if no hash is specified. By default, `index.md`.
- `icons`: Enable/disable sidebar icons globally.
- `showDefaultIcons`: Use fallback icons for items without explicit `icon`.
- `developerMode`: Shows the icon explorer helper in the footer.
- `nav`: Sidebar structure. Supports `title`, `file`, `folder`, `children`, and optional `icon`.

### Important Note About Paths

File paths are case-sensitive on many hosts (Linux).  
Make sure `nav.file` values match actual folder/file casing exactly (for example `Advanced/index.md`, not `advanced/index.md`).
