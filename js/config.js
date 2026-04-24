export const docenConfig = {
    title: "Docen Docs",
    baseDir: "./docs/",
    homePage: "index.md",
    
    // Icon Configuration
    icons: true, // Set to false to disable all icons entirely
    showDefaultIcons: true, // Use automatic fallback icons if an item doesn't explicitly define 'icon'
    
    // Developer options
    developerMode: true, // Set to true to show the icon reference tool in the footer
    // If you don't want to see the developer mode icon or if you are planning to release you can set this to false.
    
    // Sidebar navigation mapping
    // You can nest folders by providing 'folder' and 'children'
    nav: [
        { title: "Introduction", file: "index.md", icon: "text" }, 
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