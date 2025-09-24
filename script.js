// FAQ Site JavaScript - Seed Planning AI FAQ
class FAQManager {
    constructor() {
        this.faqData = [];
        this.filteredData = [];
        this.categories = new Set();
        this.tags = new Set();
        this.currentFilters = {
            search: '',
            category: new Set(),
            level: new Set(), 
            tag: new Set()
        };
        
        // Multi-select filter manager
        this.filterManager = new MultiSelectFilterManager(this);
        
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
            this.loadDailyFAQ();
            this.showLoading(false);
        } catch (error) {
            console.error('Error initializing FAQ Manager:', error);
            this.showError('データの読み込みに失敗しました。');
        }
    }

    async loadCSVData() {
        try {
            console.log('Loading JSON data...');
            // Load JSON data instead of CSV
            const response = await fetch('faq_data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            console.log('JSON data loaded, items count:', jsonData.length);
            this.parseJSON(jsonData);
        } catch (error) {
            console.error('Error loading JSON data:', error);
            throw error;
        }
    }

    parseJSON(jsonData) {
        this.faqData = []; // Clear existing data
        console.log('Parsing JSON data...');
        
        for (let i = 0; i < jsonData.length; i++) {
            const item = jsonData[i];
            
            try {
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
            } catch (error) {
                console.error(`Error parsing item ${i}:`, error, item);
                continue;
            }
        }
        
        console.log('Parsed FAQ data, total items:', this.faqData.length);
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

        // Multi-select filter handlers
        this.filterManager.setupEventListeners();
        
        // Load filters from URL and localStorage
        this.filterManager.loadFiltersFromURL();
        this.filterManager.loadFiltersFromStorage();

        // FAQ item click handlers will be added when rendering
    }

    applyFilters() {
        this.showLoading(true);
        
        // Update filter display
        this.filterManager.renderActiveFilters();
        
        setTimeout(() => {
            this.filteredData = this.faqData.filter(faq => {
                const matchesSearch = this.matchesSearch(faq);
                const matchesCategory = this.currentFilters.category.size === 0 || this.currentFilters.category.has(faq.category);
                const matchesLevel = this.currentFilters.level.size === 0 || this.currentFilters.level.has(faq.level);
                const matchesTag = this.currentFilters.tag.size === 0 || faq.tags.some(tag => this.currentFilters.tag.has(tag));
                
                return matchesSearch && matchesCategory && matchesLevel && matchesTag;
            });
            
            this.renderFAQs();
            this.updateStats();
            this.showLoading(false);
            
            // Update URL and save to localStorage
            this.filterManager.updateURL();
            this.filterManager.saveToStorage();
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
        console.log('Updating stats:', {
            faqDataLength: this.faqData.length,
            filteredDataLength: this.filteredData.length,
            categoriesSize: this.categories.size
        });
        
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
        
        console.log('Stats updated successfully');
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

    // Daily FAQ functionality
    loadDailyFAQ() {
        console.log('Loading Daily FAQ, data length:', this.faqData.length);
        
        if (this.faqData.length === 0) {
            console.warn('No FAQ data available for Daily FAQ');
            return;
        }

        try {
            // Get today's date as seed for random selection
            const today = new Date();
            const dateString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            
            // Simple hash function to create consistent daily selection
            let hash = 0;
            for (let i = 0; i < dateString.length; i++) {
                const char = dateString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            
            // Use absolute value and modulo to get consistent index
            const randomIndex = Math.abs(hash) % this.faqData.length;
            const dailyFAQ = this.faqData[randomIndex];

            console.log('Daily FAQ selected:', randomIndex, dailyFAQ);
            this.renderDailyFAQ(dailyFAQ);
        } catch (error) {
            console.error('Error loading Daily FAQ:', error);
        }
    }

    renderDailyFAQ(faq) {
        if (!faq) {
            console.error('No FAQ data provided to renderDailyFAQ');
            return;
        }

        try {
            const categoryElement = document.getElementById('dailyFaqCategory');
            const levelElement = document.getElementById('dailyFaqLevel');
            const questionElement = document.getElementById('dailyFaqQuestion');
            const answerElement = document.getElementById('dailyFaqAnswer');
            const tagsContainer = document.getElementById('dailyFaqTagsContainer');
            const tagsElement = document.getElementById('dailyFaqTags');

            if (!categoryElement || !levelElement || !questionElement || !answerElement) {
                console.error('Daily FAQ DOM elements not found');
                return;
            }

            // Update content
            categoryElement.textContent = faq.category || 'カテゴリ不明';
            levelElement.textContent = this.getLevelDisplayName(faq.level);
            
            // Remove question number prefix for cleaner display
            const cleanQuestion = (faq.question || '').replace(/^\d+\.\s*/, '');
            questionElement.textContent = cleanQuestion;
            answerElement.textContent = faq.answer || '';

            // Handle tags
            if (faq.tags && faq.tags.length > 0 && tagsElement && tagsContainer) {
                tagsElement.innerHTML = faq.tags.map(tag => 
                    `<span class="daily-faq-tag">${tag}</span>`
                ).join('');
                tagsContainer.style.display = 'block';
            } else if (tagsContainer) {
                tagsContainer.style.display = 'none';
            }

            // Add subtle animation
            const card = document.getElementById('dailyFaqCard');
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }
        } catch (error) {
            console.error('Error rendering Daily FAQ:', error);
        }
    }

    getLevelDisplayName(level) {
        const levelMap = {
            '全レベル共通': '全レベル',
            '初心者': '初心者',
            '中級者': '中級者', 
            '上級者': '上級者'
        };
        return levelMap[level] || level || '-';
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

// Multi-Select Filter Manager
class MultiSelectFilterManager {
    constructor(faqManager) {
        this.faqManager = faqManager;
        this.activeFiltersContainer = document.getElementById('activeFilters');
        this.filtersEmptyState = document.getElementById('filtersEmptyState');
    }

    setupEventListeners() {
        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            if (e.target.value) {
                this.addFilter('category', e.target.value);
                e.target.selectedIndex = 0; // Reset select
            }
        });

        // Level filter  
        document.getElementById('levelFilter').addEventListener('change', (e) => {
            if (e.target.value) {
                this.addFilter('level', e.target.value);
                e.target.selectedIndex = 0; // Reset select
            }
        });

        // Tag filter
        document.getElementById('tagFilter').addEventListener('change', (e) => {
            if (e.target.value) {
                this.addFilter('tag', e.target.value);
                e.target.selectedIndex = 0; // Reset select
            }
        });
    }

    addFilter(type, value) {
        if (!this.faqManager.currentFilters[type].has(value)) {
            this.faqManager.currentFilters[type].add(value);
            this.faqManager.applyFilters();
        }
    }

    removeFilter(type, value) {
        this.faqManager.currentFilters[type].delete(value);
        this.faqManager.applyFilters();
    }

    clearAllFilters() {
        this.faqManager.currentFilters.category.clear();
        this.faqManager.currentFilters.level.clear(); 
        this.faqManager.currentFilters.tag.clear();
        this.faqManager.currentFilters.search = '';
        document.getElementById('searchInput').value = '';
        this.faqManager.applyFilters();
    }

    renderActiveFilters() {
        const container = this.activeFiltersContainer;
        const emptyState = this.filtersEmptyState;
        
        // Clear existing content
        container.innerHTML = '';

        const hasFilters = this.faqManager.currentFilters.category.size > 0 || 
                          this.faqManager.currentFilters.level.size > 0 || 
                          this.faqManager.currentFilters.tag.size > 0 ||
                          this.faqManager.currentFilters.search.length > 0;

        if (!hasFilters) {
            container.appendChild(emptyState);
            return;
        }

        // Create filter badges
        this.createFilterBadges('category', 'カテゴリ', container);
        this.createFilterBadges('level', 'レベル', container);
        this.createFilterBadges('tag', 'タグ', container);
        
        // Add search badge if present
        if (this.faqManager.currentFilters.search) {
            this.createSearchBadge(container);
        }

        // Add clear all button
        if (hasFilters) {
            this.createClearAllButton(container);
        }
    }

    createFilterBadges(type, label, container) {
        this.faqManager.currentFilters[type].forEach(value => {
            const badge = this.createBadge(type, value, label);
            container.appendChild(badge);
        });
    }

    createBadge(type, value, typeLabel) {
        const badge = document.createElement('button');
        badge.className = 'tag is-active';
        badge.setAttribute('data-type', type);
        badge.setAttribute('data-value', value);
        badge.setAttribute('aria-pressed', 'true');
        badge.setAttribute('aria-label', `${typeLabel}「${value}」を解除`);
        
        const text = document.createElement('span');
        text.textContent = value;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'tag-remove';
        removeBtn.innerHTML = '×';
        removeBtn.setAttribute('aria-label', '削除');
        removeBtn.setAttribute('tabindex', '-1');
        
        badge.appendChild(text);
        badge.appendChild(removeBtn);
        
        // Event listeners
        const handleRemove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.removeFilter(type, value);
        };
        
        badge.addEventListener('click', handleRemove);
        removeBtn.addEventListener('click', handleRemove);
        
        // Keyboard support
        badge.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRemove(e);
            }
        });
        
        return badge;
    }

    createSearchBadge(container) {
        const badge = document.createElement('button');
        badge.className = 'tag is-active';
        badge.setAttribute('aria-pressed', 'true');
        badge.setAttribute('aria-label', `検索「${this.faqManager.currentFilters.search}」を解除`);
        
        const text = document.createElement('span');
        text.textContent = `検索: ${this.faqManager.currentFilters.search}`;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'tag-remove';
        removeBtn.innerHTML = '×';
        removeBtn.setAttribute('aria-label', '削除');
        removeBtn.setAttribute('tabindex', '-1');
        
        badge.appendChild(text);
        badge.appendChild(removeBtn);
        
        // Event listeners
        const handleRemove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.faqManager.currentFilters.search = '';
            document.getElementById('searchInput').value = '';
            this.faqManager.applyFilters();
        };
        
        badge.addEventListener('click', handleRemove);
        removeBtn.addEventListener('click', handleRemove);
        
        // Keyboard support
        badge.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRemove(e);
            }
        });
        
        container.appendChild(badge);
    }

    createClearAllButton(container) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-all';
        clearBtn.textContent = 'すべて解除';
        clearBtn.setAttribute('aria-label', 'すべてのフィルターを解除');
        
        clearBtn.addEventListener('click', () => {
            this.clearAllFilters();
        });
        
        clearBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.clearAllFilters();
            }
        });
        
        container.appendChild(clearBtn);
    }

    // URL synchronization
    updateURL() {
        const url = new URL(window.location);
        url.search = '';
        
        // Add filters to URL
        this.faqManager.currentFilters.category.forEach(cat => {
            url.searchParams.append('category', cat);
        });
        
        this.faqManager.currentFilters.level.forEach(level => {
            url.searchParams.append('level', level);
        });
        
        this.faqManager.currentFilters.tag.forEach(tag => {
            url.searchParams.append('tag', tag);
        });
        
        if (this.faqManager.currentFilters.search) {
            url.searchParams.set('search', this.faqManager.currentFilters.search);
        }
        
        window.history.replaceState({}, '', url);
    }

    loadFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Load categories
        const categories = urlParams.getAll('category');
        categories.forEach(cat => this.faqManager.currentFilters.category.add(cat));
        
        // Load levels
        const levels = urlParams.getAll('level');
        levels.forEach(level => this.faqManager.currentFilters.level.add(level));
        
        // Load tags
        const tags = urlParams.getAll('tag');
        tags.forEach(tag => this.faqManager.currentFilters.tag.add(tag));
        
        // Load search
        const search = urlParams.get('search');
        if (search) {
            this.faqManager.currentFilters.search = search;
            document.getElementById('searchInput').value = search;
        }
        
        if (categories.length > 0 || levels.length > 0 || tags.length > 0 || search) {
            this.faqManager.applyFilters();
        }
    }

    // localStorage persistence
    saveToStorage() {
        const filters = {
            category: Array.from(this.faqManager.currentFilters.category),
            level: Array.from(this.faqManager.currentFilters.level),
            tag: Array.from(this.faqManager.currentFilters.tag),
            search: this.faqManager.currentFilters.search
        };
        
        try {
            localStorage.setItem('faq_filters', JSON.stringify(filters));
        } catch (error) {
            console.warn('Failed to save filters to localStorage:', error);
        }
    }

    loadFiltersFromStorage() {
        try {
            const saved = localStorage.getItem('faq_filters');
            if (!saved) return;
            
            const filters = JSON.parse(saved);
            
            // Only load from storage if no URL params were present
            const hasUrlParams = window.location.search.length > 0;
            if (hasUrlParams) return;
            
            // Load saved filters
            if (filters.category) {
                filters.category.forEach(cat => this.faqManager.currentFilters.category.add(cat));
            }
            if (filters.level) {
                filters.level.forEach(level => this.faqManager.currentFilters.level.add(level));
            }
            if (filters.tag) {
                filters.tag.forEach(tag => this.faqManager.currentFilters.tag.add(tag));
            }
            if (filters.search) {
                this.faqManager.currentFilters.search = filters.search;
                document.getElementById('searchInput').value = filters.search;
            }
            
            if (filters.category?.length > 0 || filters.level?.length > 0 || 
                filters.tag?.length > 0 || filters.search) {
                this.faqManager.applyFilters();
            }
        } catch (error) {
            console.warn('Failed to load filters from localStorage:', error);
        }
    }
}

// Add analytics tracking (if needed in the future)
window.trackFAQInteraction = function(action, faqId, category) {
    // Analytics implementation can be added here
    console.log('FAQ Interaction:', { action, faqId, category });
};