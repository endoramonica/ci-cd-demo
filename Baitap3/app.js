// Mock data - Git branches
const mockBranches = [
    'feature/layout-basic',
    'feature/dark-light-theme',
    'feature/search-functionality',
    'feature/branch-display',
    'develop',
    'main'
];

// State
let state = {
    branches: mockBranches,
    selectedBranch: null,
    isDarkMode: localStorage.getItem('darkMode') === 'true',
    isDropdownOpen: false
};

// DOM Elements
const app = document.getElementById('app');
const themeToggle = document.getElementById('themeToggle');
const dropdownBtn = document.getElementById('dropdownBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const branchList = document.getElementById('branchList');
const selectedBranchDisplay = document.getElementById('selectedBranch');

// Initialize
function init() {
    applyTheme();
    renderBranches();
    attachEventListeners();
}

// Theme Management
function applyTheme() {
    if (state.isDarkMode) {
        app.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        app.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    localStorage.setItem('darkMode', state.isDarkMode);
    applyTheme();
}

// Render branches in dropdown
function renderBranches() {
    branchList.innerHTML = '';
    
    state.branches.forEach(branch => {
        const li = document.createElement('li');
        li.className = 'branch-item';
        if (state.selectedBranch === branch) {
            li.classList.add('active');
        }
        li.textContent = branch;
        li.addEventListener('click', () => selectBranch(branch));
        branchList.appendChild(li);
    });
}

// Select branch
function selectBranch(branch) {
    state.selectedBranch = branch;
    selectedBranchDisplay.textContent = branch;
    closeDropdown();
    renderBranches();
}

// Dropdown Management
function toggleDropdown() {
    state.isDropdownOpen ? closeDropdown() : openDropdown();
}

function openDropdown() {
    state.isDropdownOpen = true;
    dropdownMenu.classList.remove('hidden');
    dropdownBtn.classList.add('active');
}

function closeDropdown() {
    state.isDropdownOpen = false;
    dropdownMenu.classList.add('hidden');
    dropdownBtn.classList.remove('active');
}

// Event Listeners
function attachEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Dropdown button
    dropdownBtn.addEventListener('click', toggleDropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideDropdown = dropdownBtn.contains(e.target) || 
                                     dropdownMenu.contains(e.target);
        if (!isClickInsideDropdown && state.isDropdownOpen) {
            closeDropdown();
        }
    });
    
    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isDropdownOpen) {
            closeDropdown();
        }
    });
}

// Start app
init();
