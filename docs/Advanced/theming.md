# Theming

Docen relies on CSS variables for a hassle-free, pure developer experience.

Open `css/styles.css` and observe the `:root` block:

```css
:root {
    --docen-bg: #ffffff;
    --docen-text: #333333;
    --docen-sidebar-bg: #f8f9fa;
    --docen-sidebar-border: #e9ecef;
    --docen-accent: #0366d6;
    
    --docen-radius: 4px; /* Button rounds */
    --docen-spacing: 24px;
}
```

Simply update these values, and the engine's entire appearance will change instantly. 
No build step is required!