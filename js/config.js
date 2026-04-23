export const docenConfig = {
    title: "Docen Docs",
    baseDir: "./docs/",
    homePage: "index.md",
    
    // Sidebar navigation mapping
    // You can nest folders by providing 'folder' and 'children'
    nav: [
        { title: "Introduction", file: "index.md" },
        { title: "Getting Started", file: "getting-started.md" },
        { 
            folder: "Advanced", 
            // The index file for this folder when title is clicked
            file: "advanced/index.md", 
            children: [
                { title: "Configuration", file: "advanced/configuration.md" },
                { title: "Theming", file: "advanced/theming.md" }
            ]
        }
    ]
};