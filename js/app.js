import { docenConfig } from './config.js';

class Docen {
    constructor() {
        this.navElement = document.getElementById('docen-nav');
        this.renderElement = document.getElementById('docen-render-area');
        this.init();
        this.initTheme();
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    initTheme() {
        const toggleBtn = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('docen-theme') || 'light';
        
        this.applyTheme(currentTheme);

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                this.applyTheme(newTheme);
            });
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('docen-theme', theme);
        
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn && typeof lucide !== 'undefined') {
            const iconName = theme === 'dark' ? 'sun' : 'moon';
            toggleBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
            lucide.createIcons();
        }
    }

    init() {
        // Set Docen title
        const logoTarget = document.querySelector('.docen-logo h2');
        if (logoTarget && docenConfig.title) {
            logoTarget.textContent = docenConfig.title;
        }

        this.buildNav();
        this.handleRoute();

        window.addEventListener('hashchange', () => this.handleRoute());
    }

    buildNav() {
        this.navElement.innerHTML = '';
        const ul = document.createElement('ul');
        this.appendNavItems(docenConfig.nav, ul);
        this.navElement.appendChild(ul);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    appendNavItems(items, parentElement) {
        items.forEach(item => {
            const li = document.createElement('li');
            
            if (item.folder) {
                const folderDiv = document.createElement('div');
                
                let folderLink;
                if (item.file) {
                    folderLink = document.createElement('a');
                    folderLink.href = `#${item.file}`;
                } else {
                    folderLink = document.createElement('span');
                }
                
                folderLink.className = 'folder-link';
                folderLink.innerHTML = `<span>${item.folder}</span><i data-lucide="chevron-right" class="folder-icon"></i>`;
                
                li.appendChild(folderLink);
                
                if (item.children && item.children.length > 0) {
                    const childUl = document.createElement('ul');
                    this.appendNavItems(item.children, childUl);
                    li.appendChild(childUl);
                }
            } else {
                const a = document.createElement('a');
                a.textContent = item.title;
                a.href = `#${item.file}`;
                li.appendChild(a);
            }
            
            parentElement.appendChild(li);
        });
    }

    updateNavState(currentFile) {
        const links = this.navElement.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentFile}`) {
                link.classList.add('active');
            }
        });
    }

    async handleRoute() {
        let hash = window.location.hash.slice(1);
        if (!hash) hash = docenConfig.homePage;

        this.updateNavState(hash);
        await this.loadContent(hash);
    }

    async loadContent(filename) {
        this.renderElement.innerHTML = '<p>Loading...</p>';
        try {
            const response = await fetch(`${docenConfig.baseDir}${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            const markdown = await response.text();
            this.renderDocument(markdown);
        } catch (error) {
            this.renderElement.innerHTML = `<h1>Page Not Found</h1><p>The document <code>${filename}</code> could not be loaded.</p>`;
            console.error(error);
        }
    }

    renderDocument(markdown) {
        if (typeof marked !== 'undefined') {
            this.renderElement.innerHTML = marked.parse(markdown);
        } else {
            this.renderElement.innerHTML = '<p>Error: Markdown parser not loaded.</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Docen();
});