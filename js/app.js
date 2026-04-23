import { docenConfig } from './config.js';

class Docen {
    constructor() {
        this.navElement = document.getElementById('docen-nav');
        this.renderElement = document.getElementById('docen-render-area');
        this.searchIndex = null;
        this.init();
        this.initTheme();
        this.initSearch();
        
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

    initSearch() {
        const searchInput = document.getElementById('docen-search-input');
        const searchResults = document.getElementById('docen-search-results');
        
        if (!searchInput || !searchResults) return;

        const filesToFetch = [];
        const extractFiles = (items) => {
            items.forEach(item => {
                if (item.file) {
                    filesToFetch.push({ title: item.title || item.folder, file: item.file });
                }
                if (item.children) {
                    extractFiles(item.children);
                }
            });
        };
        extractFiles(docenConfig.nav);

        let buildPromise = null;

        const handleSearch = async (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) { // Minimum 2 characters to search (you can edit it if it is much or less)
                searchResults.classList.remove('active');
                return;
            }

            if (!this.searchIndex) {
                if (!buildPromise) {
                    searchResults.innerHTML = '<div class="search-result-item" style="opacity: 0.5;">Indexing pages...</div>';
                    searchResults.classList.add('active');
                    
                    buildPromise = (async () => {
                        this.searchIndex = [];
                        for (const info of filesToFetch) {
                            try {
                                const res = await fetch(`${docenConfig.baseDir}${info.file}`);
                                if (res.ok) {
                                    const content = await res.text();
                                    
                                    // Parse markdown and strip HTML for pure text indexing
                                    const rawHtml = typeof marked !== 'undefined' ? marked.parse(content) : content;
                                    const tmpDiv = document.createElement('div');
                                    tmpDiv.innerHTML = rawHtml;
                                    const textContent = (tmpDiv.textContent || tmpDiv.innerText || "").replace(/\s+/g, ' ');
                                    
                                    this.searchIndex.push({ 
                                        ...info, 
                                        searchableContent: textContent.toLowerCase(),
                                        rawText: textContent
                                    });
                                }
                            } catch (error) { console.warn(`Could not index ${info.file}`); }
                        }
                    })();
                }
                await buildPromise;
            }

            if (!this.searchIndex) return;

            const results = this.searchIndex.filter(d => 
                d.title.toLowerCase().includes(query) || 
                d.searchableContent.includes(query)
            );

            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item" style="opacity: 0.5;">No results found</div>';
                searchResults.classList.add('active');
                return;
            }

            searchResults.innerHTML = results.slice(0, 5).map(res => {
                let excerpt = res.rawText.substring(0, 50);
                const contentIndex = res.searchableContent.indexOf(query);
                if (contentIndex > -1) {
                    const start = Math.max(0, contentIndex - 20);
                    excerpt = `...${res.rawText.substring(start, start + 50)}...`;
                }

                return `
                    <a href="#${res.file}?search=${encodeURIComponent(query)}" class="search-result-item" onclick="document.getElementById('docen-search-input').value = ''">
                        <div class="search-result-title">${res.title}</div>
                        <div class="search-result-excerpt" style="pointer-events: none;">${excerpt}</div>
                    </a>
                `;
            }).join('');
            
            searchResults.classList.add('active');
        };

        searchInput.addEventListener('input', handleSearch);

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.docen-search')) {
                searchResults.classList.remove('active');
            }
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() && searchResults.innerHTML) {
                searchResults.classList.add('active');
            }
        });
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

        let filename = hash;
        let searchQuery = null;
        
        if (hash.includes('?')) {
            const parts = hash.split('?');
            filename = parts[0];
            const params = new URLSearchParams('?' + parts[1]);
            searchQuery = params.get('search');
        }

        this.updateNavState(filename);
        await this.loadContent(filename, searchQuery);
    }

    async loadContent(filename, searchQuery = null) {
        this.renderElement.innerHTML = '<p>Loading...</p>';
        try {
            const response = await fetch(`${docenConfig.baseDir}${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            const markdown = await response.text();
            this.renderDocument(markdown, searchQuery);
        } catch (error) {
            this.renderElement.innerHTML = `<h1>Page Not Found</h1><p>The document <code>${filename}</code> could not be loaded.</p>`;
            console.error(error);
        }
    }

    renderDocument(markdown, searchQuery = null) {
        if (typeof marked !== 'undefined') {
            this.renderElement.innerHTML = marked.parse(markdown);
            
            // Execute highlight and scroll logic if routed from search
            if (searchQuery) {
                setTimeout(() => this.highlightAndScroll(searchQuery), 50);
            }
        } else {
            this.renderElement.innerHTML = '<p>Error: Markdown parser not loaded.</p>';
        }
    }

    highlightAndScroll(query) {
        const walker = document.createTreeWalker(this.renderElement, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToReplace = [];
        
        while (node = walker.nextNode()) {
            if (node.parentNode.tagName !== 'SCRIPT' && node.nodeValue.toLowerCase().includes(query.toLowerCase())) {
                nodesToReplace.push(node);
            }
        }

        nodesToReplace.forEach(node => {
            const parts = node.nodeValue.split(new RegExp(`(${query})`, 'i'));
            const fragment = document.createDocumentFragment();
            
            parts.forEach(part => {
                if (part.toLowerCase() === query.toLowerCase()) {
                    const mark = document.createElement('mark');
                    mark.className = 'docen-flash';
                    mark.textContent = part;
                    fragment.appendChild(mark);
                } else if (part) {
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            node.parentNode.replaceChild(fragment, node);
        });

        // Try to scroll to the first highlight smoothly
        const firstMark = this.renderElement.querySelector('.docen-flash');
        if (firstMark) {
            firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Docen();
});