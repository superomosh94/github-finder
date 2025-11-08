/**
 * GitHub Explorer - Frontend JavaScript
 * Handles user interactions, API calls, and UI updates
 */
class GitHubFinder {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('githubSearchHistory')) || [];
        this.currentRepos = [];
        this.filteredRepos = [];
        this.reposPerPage = 15;
        this.currentPage = 1;
        this.sortField = 'updated';
        this.sortDirection = 'desc';
        this.filters = {
            language: '',
            hasDescription: false,
            hasWebsite: false,
            minStars: '',
            searchTerm: ''
        };
        this.init();
    }

    /**
     * Initialize event listeners and display history
     */
    init() {
        // Search button event
        document.getElementById("searchBtn").addEventListener("click", () => this.getUser());
        
        // Clear history button event
        document.getElementById("clearHistoryBtn").addEventListener("click", () => this.clearHistory());
        
        // Enter key event for search input
        document.getElementById("usernameInput").addEventListener("keypress", (e) => {
            if (e.key === 'Enter') this.getUser();
        });

        // Suggestion buttons event
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const username = e.target.getAttribute('data-user');
                document.getElementById("usernameInput").value = username;
                this.getUser();
            });
        });

        // Display existing search history
        this.displayHistory();
        
        // Focus on input field
        document.getElementById("usernameInput").focus();
    }

    /**
     * Fetch and display GitHub user data
     */
    async getUser() {
        const username = document.getElementById("usernameInput").value.trim();
        const profileDiv = document.getElementById("profile");
        const reposDiv = document.getElementById("repos");
        const loadingDiv = document.getElementById("loading");

        // Clear previous results and show loading
        this.hideElements(profileDiv, reposDiv);
        this.showLoading(loadingDiv);
        this.resetFiltersAndPagination();

        // Validate input
        if (!username) {
            this.hideLoading(loadingDiv);
            this.showError("Please enter a GitHub username");
            return;
        }

        try {
            // Fetch user data and repositories in parallel
            const [userData, repos] = await Promise.all([
                this.fetchData(`/api/user/${username}`),
                this.fetchData(`/api/user/${username}/repos`)
            ]);

            // Handle user not found
            if (userData.message === "User not found") {
                this.showError("User not found. Please check the username and try again.");
                return;
            }

            // Display the data
            this.displayProfile(userData);
            this.currentRepos = repos;
            this.applyFilters();
            this.sortRepositories();
            this.displayReposPage(1);
            this.addToHistory(username);
            
        } catch (error) {
            console.error("Search error:", error);
            this.showError("Unable to fetch data. Please check your connection and try again.");
        } finally {
            this.hideLoading(loadingDiv);
        }
    }

    /**
     * Generic fetch function with error handling
     */
    async fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    /**
     * Display user profile information
     */
    displayProfile(userData) {
        const profileDiv = document.getElementById("profile");
        
        profileDiv.innerHTML = `
            <div class="profile">
                <img src="${userData.avatar_url}" alt="${userData.login}'s avatar" width="140" height="140">
                <h2>${userData.name || userData.login}</h2>
                <p>${userData.bio || "No bio available"}</p>
                <p>📍 ${userData.location || "No location provided"}</p>
                <p>🏢 ${userData.company || "No company specified"}</p>
                <p>📊 Public Repos: ${userData.public_repos} | Followers: ${userData.followers} | Following: ${userData.following}</p>
                ${userData.blog ? `<p>🌐 <a href="${this.formatUrl(userData.blog)}" target="_blank">${userData.blog}</a></p>` : ''}
                <p>📅 Joined: ${new Date(userData.created_at).toLocaleDateString()}</p>
                <a href="${userData.html_url}" target="_blank" class="profile-link">View Profile on GitHub</a>
            </div>
        `;
    }

    /**
     * Format URL to include http:// if missing
     */
    formatUrl(url) {
        return url.startsWith('http') ? url : `https://${url}`;
    }

    /**
     * Apply filters to repositories
     */
    applyFilters() {
        this.filteredRepos = this.currentRepos.filter(repo => {
            // Search term filter
            if (this.filters.searchTerm) {
                const searchLower = this.filters.searchTerm.toLowerCase();
                const matchesSearch = 
                    repo.name.toLowerCase().includes(searchLower) ||
                    (repo.description && repo.description.toLowerCase().includes(searchLower)) ||
                    (repo.language && repo.language.toLowerCase().includes(searchLower));
                if (!matchesSearch) return false;
            }

            // Language filter
            if (this.filters.language && repo.language !== this.filters.language) {
                return false;
            }

            // Description filter
            if (this.filters.hasDescription && !repo.description) {
                return false;
            }

            // Website filter
            if (this.filters.hasWebsite && !repo.homepage) {
                return false;
            }

            // Minimum stars filter
            if (this.filters.minStars && repo.stargazers_count < parseInt(this.filters.minStars)) {
                return false;
            }

            return true;
        });
    }

    /**
     * Get unique languages from repositories
     */
    getUniqueLanguages() {
        const languages = new Set();
        this.currentRepos.forEach(repo => {
            if (repo.language) {
                languages.add(repo.language);
            }
        });
        return Array.from(languages).sort();
    }

    /**
     * Update filters and refresh display
     */
    updateFilter(filterType, value) {
        this.filters[filterType] = value;
        this.applyFilters();
        this.sortRepositories();
        this.displayReposPage(1);
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {
            language: '',
            hasDescription: false,
            hasWebsite: false,
            minStars: '',
            searchTerm: ''
        };
        this.applyFilters();
        this.sortRepositories();
        this.displayReposPage(1);
    }

    /**
     * Sort repositories based on current sort field and direction
     */
    sortRepositories() {
        if (!this.filteredRepos || this.filteredRepos.length === 0) return;

        this.filteredRepos.sort((a, b) => {
            let aValue, bValue;

            switch (this.sortField) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'stars':
                    aValue = a.stargazers_count;
                    bValue = b.stargazers_count;
                    break;
                case 'forks':
                    aValue = a.forks_count;
                    bValue = b.forks_count;
                    break;
                case 'updated':
                default:
                    aValue = new Date(a.updated_at);
                    bValue = new Date(b.updated_at);
                    break;
            }

            if (this.sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }

    /**
     * Change sort field and refresh display
     */
    changeSort(field) {
        if (this.sortField === field) {
            // Toggle direction if same field
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // New field, default to descending
            this.sortField = field;
            this.sortDirection = 'desc';
        }
        this.sortRepositories();
        this.displayReposPage(this.currentPage);
    }

    /**
     * Get sort indicator for table headers
     */
    getSortIndicator(field) {
        if (this.sortField !== field) return '';
        return this.sortDirection === 'asc' ? ' ↑' : ' ↓';
    }

    /**
     * Display repositories in table format with pagination and filters
     */
    displayReposPage(page) {
        const reposDiv = document.getElementById("repos");
        this.currentPage = page;
        
        if (!this.filteredRepos || this.filteredRepos.length === 0) {
            const noResultsMessage = this.currentRepos.length === 0 
                ? "No repositories found" 
                : "No repositories match your filters";
                
            reposDiv.innerHTML = `
                <div class="repos-header">
                    <h3>Repositories</h3>
                </div>
                <div class="no-repos">
                    <p>${noResultsMessage}</p>
                    ${this.currentRepos.length > 0 ? '<button class="clear-filters-btn" onclick="githubFinder.clearFilters()">Clear Filters</button>' : ''}
                </div>
            `;
            return;
        }

        // Calculate pagination
        const totalRepos = this.filteredRepos.length;
        const totalPages = Math.ceil(totalRepos / this.reposPerPage);
        const startIndex = (page - 1) * this.reposPerPage;
        const endIndex = Math.min(startIndex + this.reposPerPage, totalRepos);
        const currentRepos = this.filteredRepos.slice(startIndex, endIndex);

        // Get unique languages for filter dropdown
        const languages = this.getUniqueLanguages();

        let reposHTML = `
            <div class="repos-header">
                <h3>Repositories (${totalRepos} of ${this.currentRepos.length} shown)</h3>
                <div class="pagination-info">
                    Showing ${startIndex + 1}-${endIndex} of ${totalRepos} repositories
                </div>
            </div>
            
            <!-- Filters Section -->
            <div class="filters-section">
                <div class="filters-row">
                    <div class="filter-group">
                        <input 
                            type="text" 
                            id="repoSearch" 
                            placeholder="Search repositories..."
                            class="filter-input"
                            oninput="githubFinder.updateFilter('searchTerm', this.value)"
                        >
                    </div>
                    
                    <div class="filter-group">
                        <select 
                            id="languageFilter" 
                            class="filter-select"
                            onchange="githubFinder.updateFilter('language', this.value)"
                        >
                            <option value="">All Languages</option>
                            ${languages.map(lang => `<option value="${lang}" ${this.filters.language === lang ? 'selected' : ''}>${lang}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <input 
                            type="number" 
                            id="minStarsFilter" 
                            placeholder="Min stars"
                            class="filter-input"
                            value="${this.filters.minStars}"
                            oninput="githubFinder.updateFilter('minStars', this.value)"
                        >
                    </div>
                    
                    <div class="filter-group checkbox-group">
                        <label class="filter-checkbox">
                            <input 
                                type="checkbox" 
                                ${this.filters.hasDescription ? 'checked' : ''}
                                onchange="githubFinder.updateFilter('hasDescription', this.checked)"
                            >
                            Has Description
                        </label>
                        <label class="filter-checkbox">
                            <input 
                                type="checkbox" 
                                ${this.filters.hasWebsite ? 'checked' : ''}
                                onchange="githubFinder.updateFilter('hasWebsite', this.checked)"
                            >
                            Has Website
                        </label>
                    </div>
                    
                    <button class="clear-filters-btn" onclick="githubFinder.clearFilters()">
                        Clear Filters
                    </button>
                </div>
            </div>
            
            <div class="repos-table-container">
                <table class="repos-table">
                    <thead>
                        <tr>
                            <th class="sortable" onclick="githubFinder.changeSort('name')">
                                Repository ${this.getSortIndicator('name')}
                            </th>
                            <th>Description</th>
                            <th class="sortable" onclick="githubFinder.changeSort('stars')">
                                Stars ${this.getSortIndicator('stars')}
                            </th>
                            <th class="sortable" onclick="githubFinder.changeSort('forks')">
                                Forks ${this.getSortIndicator('forks')}
                            </th>
                            <th>Language</th>
                            <th class="sortable" onclick="githubFinder.changeSort('updated')">
                                Updated ${this.getSortIndicator('updated')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        currentRepos.forEach(repo => {
            const updatedDate = new Date(repo.updated_at);
            const formattedDate = updatedDate.toLocaleDateString();
            const isRecent = (Date.now() - updatedDate) < 7 * 24 * 60 * 60 * 1000; // Within 7 days
            
            reposHTML += `
                <tr class="repo-row ${isRecent ? 'recent' : ''}">
                    <td class="repo-name">
                        <a href="${repo.html_url}" target="_blank" class="repo-link">${repo.name}</a>
                        ${repo.homepage ? `<a href="${this.formatUrl(repo.homepage)}" target="_blank" class="demo-link" title="Live Demo">🌍</a>` : ''}
                    </td>
                    <td class="repo-description" title="${repo.description || 'No description'}">
                        ${repo.description || '<span class="no-description">No description</span>'}
                    </td>
                    <td class="repo-stars">
                        <span class="stat-badge">⭐ ${repo.stargazers_count.toLocaleString()}</span>
                    </td>
                    <td class="repo-forks">
                        <span class="stat-badge">🍴 ${repo.forks_count.toLocaleString()}</span>
                    </td>
                    <td class="repo-language">
                        ${repo.language ? `<span class="language-tag">${repo.language}</span>` : '<span class="no-language">-</span>'}
                    </td>
                    <td class="repo-updated">
                        <span class="date-cell" title="${updatedDate.toLocaleString()}">${formattedDate}</span>
                    </td>
                </tr>
            `;
        });

        reposHTML += `
                    </tbody>
                </table>
            </div>
        `;

        // Add pagination controls if needed
        if (totalPages > 1) {
            reposHTML += this.createPaginationControls(page, totalPages);
        }

        reposDiv.innerHTML = reposHTML;
    }

    /**
     * Create pagination controls
     */
    createPaginationControls(currentPage, totalPages) {
        let paginationHTML = '<div class="pagination">';
        
        // Previous button
        if (currentPage > 1) {
            paginationHTML += `<button class="page-btn" onclick="githubFinder.displayReposPage(${currentPage - 1})">← Previous</button>`;
        }
        
        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHTML += `<span class="page-current">${i}</span>`;
            } else {
                paginationHTML += `<button class="page-btn" onclick="githubFinder.displayReposPage(${i})">${i}</button>`;
            }
        }
        
        // Next button
        if (currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" onclick="githubFinder.displayReposPage(${currentPage + 1})">Next →</button>`;
        }
        
        paginationHTML += '</div>';
        return paginationHTML;
    }

    /**
     * Reset filters and pagination state
     */
    resetFiltersAndPagination() {
        this.currentRepos = [];
        this.filteredRepos = [];
        this.currentPage = 1;
        this.sortField = 'updated';
        this.sortDirection = 'desc';
        this.filters = {
            language: '',
            hasDescription: false,
            hasWebsite: false,
            minStars: '',
            searchTerm: ''
        };
    }

    /**
     * Add username to search history
     */
    addToHistory(username) {
        // Remove if already exists (to avoid duplicates)
        this.searchHistory = this.searchHistory.filter(item => item !== username);
        
        // Add to beginning of array
        this.searchHistory.unshift(username);
        
        // Keep only last 5 searches
        this.searchHistory = this.searchHistory.slice(0, 5);
        
        // Save to localStorage
        localStorage.setItem('githubSearchHistory', JSON.stringify(this.searchHistory));
        
        // Update display
        this.displayHistory();
    }

    /**
     * Display search history
     */
    displayHistory() {
        const historyDiv = document.getElementById("history");
        
        if (this.searchHistory.length === 0) {
            historyDiv.innerHTML = "";
            return;
        }

        let historyHTML = "<h3>Recent Searches</h3>";
        
        this.searchHistory.forEach(username => {
            historyHTML += `
                <span class="history-item" onclick="githubFinder.searchFromHistory('${username}')">
                    ${username}
                </span>
            `;
        });

        historyDiv.innerHTML = historyHTML;
    }

    /**
     * Search from history item click
     */
    searchFromHistory(username) {
        document.getElementById("usernameInput").value = username;
        this.getUser();
    }

    /**
     * Clear search history
     */
    clearHistory() {
        this.searchHistory = [];
        localStorage.removeItem('githubSearchHistory');
        this.displayHistory();
    }

    /**
     * Show loading spinner
     */
    showLoading(loadingDiv) {
        loadingDiv.style.display = "block";
        document.getElementById("searchBtn").disabled = true;
        document.getElementById("searchBtn").querySelector('.button-text').textContent = "Searching...";
    }

    /**
     * Hide loading spinner
     */
    hideLoading(loadingDiv) {
        loadingDiv.style.display = "none";
        document.getElementById("searchBtn").disabled = false;
        document.getElementById("searchBtn").querySelector('.button-text').textContent = "Explore";
    }

    /**
     * Clear multiple elements
     */
    hideElements(...elements) {
        elements.forEach(el => {
            if (el) el.innerHTML = "";
        });
    }

    /**
     * Display error message
     */
    showError(message) {
        const profileDiv = document.getElementById("profile");
        profileDiv.innerHTML = `<div class="error" role="alert">${message}</div>`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.githubFinder = new GitHubFinder();
});