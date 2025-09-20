// FAQ Site JavaScript - Seed Planning AI FAQ
class FAQManager {
    constructor() {
        this.faqData = [];
        this.filteredData = [];
        this.categories = new Set();
        this.tags = new Set();
        this.currentFilters = {
            search: '',
            category: '',
            level: '',
            tag: ''
        };
        
        this.init();
    }

    async init() {
        try {
            this.showLoading(true);
            await this.loadCSVData();
            this.processData();
            this.setupEventListeners();
            this.populateFilters();
            this.renderFAQs();
            this.updateStats();
            this.showLoading(false);
        } catch (error) {
            console.error('Error initializing FAQ Manager:', error);
            this.showError('データの読み込みに失敗しました。');
        }
    }

    async loadCSVData() {
        // Load JSON data instead of CSV
        const response = await fetch('faq_data.json');
        const jsonData = await response.json();
        this.parseJSON(jsonData);
    }

    parseJSON(jsonData) {
        this.faqData = []; // Clear existing data
        
        for (let i = 0; i < jsonData.length; i++) {
            const item = jsonData[i];
            
            // Ensure all fields are properly extracted
            const faq = {
                id: i + 1,
                category: (item['#カテゴリー'] || '').toString().trim(),
                level: (item['#レベル'] || '').toString().trim(),
                question: (item['#Q'] || '').toString().trim(),
                answer: (item['#A'] || '').toString().trim(),
                tags: this.parseTags((item['#タグ'] || '').toString().trim())
            };
            
            // Only add if required fields are present and non-empty
            if (faq.question && faq.answer && faq.question.length > 0 && faq.answer.length > 0) {
                this.faqData.push(faq);
            }
        }
        
        this.filteredData = [...this.faqData];
    }

    // parseCSVLine method is no longer needed

    parseTags(tagString) {
        return tagString.split('#')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .map(tag => '#' + tag);
    }

    processData() {
        this.faqData.forEach(faq => {
            this.categories.add(faq.category);
            faq.tags.forEach(tag => this.tags.add(tag));
        });
    }

    populateFilters() {
        // Populate category filter
        const categorySelect = document.getElementById('categoryFilter');
        const sortedCategories = Array.from(this.categories).sort();
        sortedCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // Populate tag filter
        const tagSelect = document.getElementById('tagFilter');
        const sortedTags = Array.from(this.tags).sort();
        sortedTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagSelect.appendChild(option);
        });
    }

    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300);
        });

        // Filter selects
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('levelFilter').addEventListener('change', (e) => {
            this.currentFilters.level = e.target.value;
            this.applyFilters();
        });

        document.getElementById('tagFilter').addEventListener('change', (e) => {
            this.currentFilters.tag = e.target.value;
            this.applyFilters();
        });

        // FAQ item click handlers will be added when rendering
    }

    applyFilters() {
        this.showLoading(true);
        
        setTimeout(() => {
            this.filteredData = this.faqData.filter(faq => {
                const matchesSearch = this.matchesSearch(faq);
                const matchesCategory = !this.currentFilters.category || faq.category === this.currentFilters.category;
                const matchesLevel = !this.currentFilters.level || faq.level === this.currentFilters.level;
                const matchesTag = !this.currentFilters.tag || faq.tags.includes(this.currentFilters.tag);
                
                return matchesSearch && matchesCategory && matchesLevel && matchesTag;
            });
            
            this.renderFAQs();
            this.updateStats();
            this.showLoading(false);
        }, 150);
    }

    matchesSearch(faq) {
        if (!this.currentFilters.search) return true;
        
        const searchText = this.currentFilters.search.toLowerCase().trim();
        if (!searchText) return true;
        
        const searchTerms = searchText.split(/\s+/).filter(term => term.length > 0);
        const searchableText = (
            (faq.question || '') + ' ' + 
            (faq.answer || '') + ' ' + 
            (faq.category || '') + ' ' + 
            (faq.tags || []).join(' ')
        ).toLowerCase();
        
        return searchTerms.every(term => searchableText.includes(term));
    }

    renderFAQs() {
        const container = document.getElementById('faqContainer');
        const noResults = document.getElementById('noResults');
        
        if (this.filteredData.length === 0) {
            container.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }
        
        container.style.display = 'grid';
        noResults.style.display = 'none';
        
        container.innerHTML = '';
        
        this.filteredData.forEach((faq, index) => {
            const faqElement = this.createFAQElement(faq, index);
            container.appendChild(faqElement);
        });
    }

    createFAQElement(faq, index) {
        const faqItem = document.createElement('div');
        faqItem.className = `faq-item ${this.getLevelClass(faq.level)} fade-in`;
        faqItem.style.animationDelay = `${index * 0.05}s`;
        
        const levelText = this.getLevelText(faq.level);
        const highlightedQuestion = this.highlightSearchTerms(faq.question);
        const highlightedAnswer = this.highlightSearchTerms(faq.answer);
        
        faqItem.innerHTML = `
            <div class="faq-header" onclick="this.parentElement.classList.toggle('expanded')">
                <div class="faq-question-container">
                    <div class="faq-meta">
                        <span class="category-badge">${faq.category}</span>
                        <span class="level-badge">${levelText}</span>
                    </div>
                    <div class="faq-question">${highlightedQuestion}</div>
                </div>
                <i class="fas fa-plus faq-toggle"></i>
            </div>
            <div class="faq-content">
                <div class="faq-answer">${highlightedAnswer}</div>
                <div class="faq-tags">
                    <div class="tags-container">
                        ${faq.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        return faqItem;
    }

    getLevelClass(level) {
        const levelMap = {
            '初心者': 'level-beginner',
            '中級者': 'level-intermediate', 
            '上級者': 'level-advanced',
            '全レベル共通': 'level-all'
        };
        return levelMap[level] || 'level-all';
    }

    getLevelText(level) {
        return level;
    }

    highlightSearchTerms(text) {
        if (!this.currentFilters.search) return text;
        
        const searchTerms = this.currentFilters.search.split(' ').filter(term => term.length > 0);
        let highlightedText = text;
        
        searchTerms.forEach(term => {
            const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
        });
        
        return highlightedText;
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    }

    updateStats() {
        document.getElementById('displayedQuestions').textContent = this.filteredData.length;
        document.getElementById('totalQuestions').textContent = this.faqData.length;
        document.getElementById('categoriesCount').textContent = this.categories.size;
        
        // Update level distribution
        const levelCounts = this.filteredData.reduce((acc, faq) => {
            acc[faq.level] = (acc[faq.level] || 0) + 1;
            return acc;
        }, {});
        
        const topLevel = Object.keys(levelCounts).reduce((a, b) => 
            levelCounts[a] > levelCounts[b] ? a : b, '');
        
        document.getElementById('averageLevel').textContent = topLevel || '-';
    }

    showLoading(show) {
        const loading = document.getElementById('loadingIndicator');
        const container = document.getElementById('faqContainer');
        
        if (show) {
            loading.style.display = 'flex';
            container.style.opacity = '0.5';
        } else {
            loading.style.display = 'none';
            container.style.opacity = '1';
        }
    }

    showError(message) {
        const container = document.getElementById('faqContainer');
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle no-results-icon"></i>
                <p class="no-results-text">${message}</p>
            </div>
        `;
        this.showLoading(false);
    }
}

// Initialize FAQ Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.faqManager = new FAQManager();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus search input on '/' key
    if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Clear search on Escape key
    if (e.key === 'Escape' && e.target.id === 'searchInput') {
        e.target.value = '';
        e.target.dispatchEvent(new Event('input'));
    }
});

// Add smooth scrolling to top functionality
window.addEventListener('scroll', () => {
    const scrollButton = document.getElementById('scrollToTop');
    if (!scrollButton) {
        // Create scroll to top button
        const button = document.createElement('button');
        button.id = 'scrollToTop';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: var(--card-shadow);
            transition: var(--transition);
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
        `;
        
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.body.appendChild(button);
    }
    
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (window.scrollY > 300) {
        scrollToTopButton.style.opacity = '1';
        scrollToTopButton.style.transform = 'translateY(0)';
        scrollToTopButton.style.pointerEvents = 'auto';
    } else {
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.transform = 'translateY(20px)';
        scrollToTopButton.style.pointerEvents = 'none';
    }
});

// Add analytics tracking (if needed in the future)
window.trackFAQInteraction = function(action, faqId, category) {
    // Analytics implementation can be added here
    console.log('FAQ Interaction:', { action, faqId, category });
};