# Configuration

The engine logic is driven by a single JavaScript file: `js/config.js`.

### Base Configuration

Here are the basic options you can change:

- `title`: The title that appears at the top left of the sidebar.
- `baseDir`: The directory where the markdown files live. By default, it's `./docs/`.
- `homePage`: The default file to show if no hash is specified. By default, `index.md`.
- `nav`: An array of objects defining your sidebar entries. Each object should have `title` and `file`.