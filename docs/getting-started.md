# Getting Started

Getting started with Docen is extremely easy.

## 1. Setup

Just serve the `docen` directory using any web server. For example:

```bash
npx serve .
```
or 
```bash
python -m http.server
```

## 2. Add Content

Create markdown files in the `docs` directory. 
Then, map them in the `config.js` file:

```javascript
// js/config.js
export const docenConfig = {
    // ...
    nav: [
        { title: "Introduction", file: "index.md" },
        { title: "Getting Started", file: "getting-started.md" },
        {
            folder: "Advanced",
            file: "Advanced/index.md",
            children: [
                { title: "Configuration", file: "Advanced/configuration.md" },
                { title: "Theming", file: "Advanced/theming.md" }
            ]
        }
    ]
}
```

## 3. Keyboard Shortcuts

- `/` focus search
- `n` next page
- `p` previous page
- `Esc` close open menus/modals
