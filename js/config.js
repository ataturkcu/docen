export const docenConfig = {
    title: "Docen Docs",
    baseDir: "./docs/",
    homePage: "index.md",

    // If you are looking for keyboard shortcuts, they are in "js/app.js" line 353

    // Icon Configuration
    icons: true, // Set false to disable all icons entirely
    showDefaultIcons: true,

    // Developer options
    developerMode: true,
    // If you don't want to see the developer mode icon or if you are planning to release you can set this to false.

    // Sidebar navigation mapping
    // You can nest folders by providing 'folder' and 'children'
    nav: [
        { title: "Introduction", file: "index.md", icon: "text" },
        { title: "Getting Started", file: "getting-started.md" },
        {
            folder: "Advanced",
            // The index file for this folder when title is clicked
            file: "Advanced/index.md",
            children: [
                { title: "Configuration", file: "Advanced/configuration.md" },
                { title: "Theming", file: "Advanced/theming.md" }
            ]
        }
    ]
};
