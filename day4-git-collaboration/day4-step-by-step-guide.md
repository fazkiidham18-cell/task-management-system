# Day 4 Implementation Guide: Version Control & Collaboration (Step-by-Step)

## 🚨 **PENTING - BACA DULU!**

### **Setup yang Diperlukan:**
Pastikan Anda sudah menyelesaikan Day 1, Day 2, dan Day 3, dan project Anda berjalan dengan:
- ✅ `npm start` berfungsi (server berjalan di http://localhost:3000)
- ✅ `npm test` berfungsi (semua tests passing)
- ✅ Aplikasi memiliki User management, Task management, dan Testing
- ✅ Git sudah terinstall di komputer Anda
- ✅ Akun GitHub sudah dibuat

**Jika belum install Git**, download dari: https://git-scm.com/downloads

**Cek Git installation:**
```bash
git --version
# Harus menampilkan versi Git (contoh: git version 2.34.1)
```

---

## 🎯 Tujuan Pembelajaran

Setelah menyelesaikan Day 4, Anda akan:
- Memahami konsep version control dan pentingnya dalam software development
- Bisa menggunakan Git untuk track changes dan collaborate dengan tim
- Menerapkan branching strategy untuk feature development
- Melakukan code review dan merge conflicts resolution
- Setup project untuk team collaboration

## 📚 Konsep Dasar yang Perlu Dipahami

### 1. Apa itu Version Control?
**Analogi sederhana**: Seperti "save game" yang advanced
- Bisa save progress di berbagai titik
- Bisa load kembali ke save point manapun
- Multiple players bisa main di game yang sama
- Track siapa yang buat perubahan apa

**Dalam software development**:
- Track semua perubahan kode
- Collaborate dengan tim tanpa conflict
- Backup otomatis di cloud
- History lengkap siapa mengubah apa dan kapan

### 2. Git Core Concepts
**Repository (Repo)**: Folder project dengan Git tracking
**Commit**: Snapshot/save point dari perubahan kode
**Branch**: Jalur development yang terpisah
**Merge**: Menggabungkan perubahan dari branch yang berbeda
**Remote**: Copy repository di server (GitHub)

### 3. Mengapa Collaboration Penting?
- **Real-world development**: Semua project dikerjakan tim
- **Code quality**: Review dari orang lain catch bugs
- **Knowledge sharing**: Belajar dari cara coding orang lain
- **Backup**: Kode tersimpan di multiple places

## 🚀 Langkah-Langkah Implementasi

### Step 1: Setup Git Repository

Pertama, kita setup Git untuk project kita.

#### 1.1 Initialize Git Repository

```bash
# Masuk ke folder project Anda
cd task-management-system

# Initialize Git repository
git init

# Configure Git dengan nama dan email Anda
git config user.name "fazkiidham18-cell"
git config user.email "fazkiidham.18@gmail.com"

# Set default branch name ke 'main'
git config init.defaultBranch main
```

#### 1.2 Create .gitignore File

File ini memberitahu Git file mana yang TIDAK perlu di-track.

**File**: `.gitignore` (buat file baru di root project)

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Test coverage
coverage/
.nyc_output/

# Temporary folders
tmp/
temp/
```

#### 1.3 Create Initial Commit

```bash
# Check status (lihat file apa saja yang akan di-commit)
git status

# Add semua file ke staging area
git add .

# Create initial commit
git commit -m "feat: initial project setup with Day 1-3 implementation

- Add basic task management functionality (Day 1)
- Implement MVC architecture with Repository pattern (Day 2)  
- Include comprehensive test suite with Jest (Day 3)
- Setup development environment and build tools"

# Check commit history
git log --oneline
```

**Penjelasan commit message format:**
- `feat:` = new feature
- `fix:` = bug fix
- `docs:` = documentation
- `test:` = adding tests
- `refactor:` = code refactoring

### Step 2: Connect to GitHub

Sekarang kita connect local repository ke GitHub.

#### 2.1 Create GitHub Repository

1. Buka https://github.com
2. Login ke akun Anda
3. Click "New repository" (tombol hijau)
4. Repository name: `task-management-system`
5. Description: `Collaborative task management app - Software Engineering Course`
6. Set ke **Public** (untuk pembelajaran)
7. **JANGAN** centang "Add a README file" (kita sudah punya)
8. Click "Create repository"

#### 2.2 Connect Local to Remote

```bash
# Add remote repository (ganti 'your-username' dengan username GitHub Anda)
git remote add origin https://github.com/your-username/task-management-system.git

# Verify remote connection
git remote -v

# Push ke GitHub untuk pertama kali
git branch -M main
git push -u origin main
```

**Jika diminta username/password:**
- Username: GitHub username Anda
- Password: Gunakan Personal Access Token (bukan password biasa)
- Cara buat token: GitHub Settings → Developer settings → Personal access tokens

#### 2.3 Verify Upload

1. Refresh halaman GitHub repository Anda
2. Pastikan semua file sudah terupload
3. Check apakah README.md tampil dengan benar

### Step 3: Branching Strategy dan Feature Development

Sekarang kita belajar branching untuk develop features secara terpisah.

#### 3.1 Understanding Branches

**Analogy**: Branch seperti parallel universe
- `main` branch: Universe utama (production-ready)
- `feature/task-categories`: Universe alternatif untuk develop categories
- Setelah feature selesai, merge kembali ke main universe

#### 3.2 Create Feature Branch

Kita akan implement task categories sebagai contoh feature development.

```bash
# Pastikan kita di main branch dan up-to-date
git checkout main
git pull origin main

# Create dan switch ke feature branch
git checkout -b feature/task-categories

# Verify kita di branch yang benar
git branch
# * feature/task-categories (tanda * menunjukkan current branch)
#   main
```

#### 3.3 Implement Task Categories Feature

Sekarang kita implement feature baru di branch terpisah.

**File**: `src/models/EnhancedTask.js` (update existing file)

Tambahkan method untuk categories:

```javascript
// Tambahkan di class EnhancedTask, setelah existing methods

/**
 * Update task category
 * @param {string} newCategory - New category
 */
updateCategory(newCategory) {
    this._category = this._validateCategory(newCategory);
    this._updateTimestamp();
}

/**
 * Get available categories (static method)
 * @returns {string[]} - Array of valid categories
 */
static getAvailableCategories() {
    return ['work', 'personal', 'study', 'health', 'finance', 'shopping', 'other'];
}

/**
 * Get category display name
 * @returns {string} - Formatted category name
 */
getCategoryDisplayName() {
    const categoryNames = {
        'work': 'Work & Business',
        'personal': 'Personal',
        'study': 'Study & Learning',
        'health': 'Health & Fitness',
        'finance': 'Finance & Money',
        'shopping': 'Shopping',
        'other': 'Other'
    };
    
    return categoryNames[this._category] || this._category;
}

/**
 * Check if task belongs to specific category
 * @param {string} category - Category to check
 * @returns {boolean} - True if task is in category
 */
isInCategory(category) {
    return this._category === category;
}
```
**File**: `src/repositories/TaskRepository.js` (update existing file)

Tambahkan method untuk filter by category:

```javascript
// Tambahkan method ini di class TaskRepository

/**
 * Find tasks by category
 * @param {string} category - Category to filter by
 * @returns {EnhancedTask[]} - Array of tasks in category
 */
findByCategory(category) {
    return this.findAll().filter(task => task.category === category);
}

/**
 * Get task statistics by category
 * @param {string} userId - User ID (optional)
 * @returns {Object} - Statistics grouped by category
 */
getCategoryStats(userId = null) {
    let tasks = userId ? this.findByOwner(userId) : this.findAll();
    
    const stats = {};
    const categories = EnhancedTask.getAvailableCategories();
    
    // Initialize all categories with 0
    categories.forEach(category => {
        stats[category] = {
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0
        };
    });
    
    // Count tasks in each category
    tasks.forEach(task => {
        const category = task.category;
        if (stats[category]) {
            stats[category].total++;
            
            if (task.isCompleted) {
                stats[category].completed++;
            } else {
                stats[category].pending++;
            }
            
            if (task.isOverdue) {
                stats[category].overdue++;
            }
        }
    });
    
    return stats;
}

/**
 * Get most used categories
 * @param {string} userId - User ID (optional)
 * @param {number} limit - Number of categories to return
 * @returns {Array} - Array of categories sorted by usage
 */
getMostUsedCategories(userId = null, limit = 5) {
    const stats = this.getCategoryStats(userId);
    
    return Object.entries(stats)
        .sort(([,a], [,b]) => b.total - a.total)
        .slice(0, limit)
        .map(([category, data]) => ({
            category,
            count: data.total,
            displayName: EnhancedTask.prototype.getCategoryDisplayName.call({ _category: category })
        }));
}
```

**File**: `src/controllers/TaskController.js` (update existing file)

Tambahkan methods untuk category management:

```javascript
// Tambahkan methods ini di class TaskController

/**
 * Get tasks by category
 * @param {string} category - Category to filter by
 * @returns {Object} - Response dengan filtered tasks
 */
getTasksByCategory(category) {
    try {
        if (!this.currentUser) {
            return {
                success: false,
                error: 'User harus login terlebih dahulu'
            };
        }
        
        // Validate category
        const validCategories = EnhancedTask.getAvailableCategories();
        if (!validCategories.includes(category)) {
            return {
                success: false,
                error: 'Kategori tidak valid'
            };
        }
        
        // Get user's tasks in specific category
        const userTasks = this.taskRepository.findByOwner(this.currentUser.id);
        const categoryTasks = userTasks.filter(task => task.isInCategory(category));
        
        // Sort by priority and due date
        const sortedTasks = this.taskRepository.sort(categoryTasks, 'priority', 'desc');
        
        return {
            success: true,
            data: sortedTasks,
            count: sortedTasks.length,
            category: category,
            categoryDisplayName: EnhancedTask.prototype.getCategoryDisplayName.call({ _category: category })
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get category statistics for current user
 * @returns {Object} - Response dengan category statistics
 */
getCategoryStats() {
    try {
        if (!this.currentUser) {
            return {
                success: false,
                error: 'User harus login terlebih dahulu'
            };
        }
        
        const stats = this.taskRepository.getCategoryStats(this.currentUser.id);
        const mostUsed = this.taskRepository.getMostUsedCategories(this.currentUser.id);
        
        return {
            success: true,
            data: {
                byCategory: stats,
                mostUsed: mostUsed,
                totalCategories: Object.keys(stats).filter(cat => stats[cat].total > 0).length
            }
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update task category
 * @param {string} taskId - Task ID
 * @param {string} newCategory - New category
 * @returns {Object} - Response dengan updated task
 */
updateTaskCategory(taskId, newCategory) {
    try {
        if (!this.currentUser) {
            return {
                success: false,
                error: 'User harus login terlebih dahulu'
            };
        }
        
        const task = this.taskRepository.findById(taskId);
        
        if (!task) {
            return {
                success: false,
                error: 'Task tidak ditemukan'
            };
        }
        
        // Check permission
        if (task.ownerId !== this.currentUser.id) {
            return {
                success: false,
                error: 'Hanya owner yang bisa mengubah kategori task'
            };
        }
        
        // Validate category
        const validCategories = EnhancedTask.getAvailableCategories();
        if (!validCategories.includes(newCategory)) {
            return {
                success: false,
                error: 'Kategori tidak valid'
            };
        }
        
        // Update category
        const updatedTask = this.taskRepository.update(taskId, { category: newCategory });
        
        return {
            success: true,
            data: updatedTask,
            message: `Kategori task berhasil diubah ke ${EnhancedTask.prototype.getCategoryDisplayName.call({ _category: newCategory })}`
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get available categories
 * @returns {Object} - Response dengan available categories
 */
getAvailableCategories() {
    try {
        const categories = EnhancedTask.getAvailableCategories();
        const categoriesWithDisplay = categories.map(category => ({
            value: category,
            label: EnhancedTask.prototype.getCategoryDisplayName.call({ _category: category })
        }));
        
        return {
            success: true,
            data: categoriesWithDisplay
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
```

#### 3.4 Update HTML untuk Category Features

**File**: `public/index.html` (update existing file)

Tambahkan category selector di task form:

```html
<!-- Update task form section dengan category selector -->
<section class="form-section">
    <h2>Create New Task</h2>
    <form id="taskForm" class="task-form">
        <div class="form-group">
            <label for="taskTitle">Task Title *</label>
            <input type="text" id="taskTitle" name="title" required placeholder="Enter task title">
        </div>
        
        <div class="form-group">
            <label for="taskDescription">Description</label>
            <textarea id="taskDescription" name="description" placeholder="Enter task description (optional)"></textarea>
        </div>
        
        <!-- NEW: Category selector -->
        <div class="form-group">
            <label for="taskCategory">Category</label>
            <select id="taskCategory" name="category">
                <option value="personal">Personal</option>
                <option value="work">Work & Business</option>
                <option value="study">Study & Learning</option>
                <option value="health">Health & Fitness</option>
                <option value="finance">Finance & Money</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="taskPriority">Priority</label>
            <select id="taskPriority" name="priority">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
            </select>
        </div>
        
        <button type="submit" class="btn btn-primary">Create Task</button>
    </form>
</section>

<!-- NEW: Category filter section -->
<section class="filter-section">
    <h2>Filter Tasks</h2>
    <div class="filter-buttons">
        <button class="filter-btn active" data-filter="all">All Tasks</button>
        <button class="filter-btn" data-filter="pending">Pending</button>
        <button class="filter-btn" data-filter="completed">Completed</button>
        <button class="filter-btn" data-filter="high">High Priority</button>
    </div>
    
    <!-- NEW: Category filters -->
    <div class="category-filters">
        <h3>By Category</h3>
        <div class="category-buttons">
            <button class="category-btn" data-category="personal">Personal</button>
            <button class="category-btn" data-category="work">Work</button>
            <button class="category-btn" data-category="study">Study</button>
            <button class="category-btn" data-category="health">Health</button>
            <button class="category-btn" data-category="finance">Finance</button>
            <button class="category-btn" data-category="shopping">Shopping</button>
            <button class="category-btn" data-category="other">Other</button>
        </div>
    </div>
</section>
```

#### 3.5 Update CSS untuk Category Styling

**File**: `public/styles.css` (tambahkan di akhir file)

```css
/* Category Filters */
.category-filters {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
}

.category-filters h3 {
    margin-bottom: 15px;
    color: #495057;
    font-size: 1rem;
    font-weight: 600;
}

.category-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.category-btn {
    padding: 6px 12px;
    border: 1px solid #dee2e6;
    background-color: white;
    color: #6c757d;
    border-radius: 15px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.category-btn:hover {
    border-color: #667eea;
    color: #667eea;
    background-color: #f8f9ff;
}

.category-btn.active {
    background-color: #667eea;
    border-color: #667eea;
    color: white;
}

/* Task Category Display */
.task-category {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-left: 10px;
}

.task-category.category-work {
    background-color: #e3f2fd;
    color: #1565c0;
}

.task-category.category-personal {
    background-color: #f3e5f5;
    color: #7b1fa2;
}

.task-category.category-study {
    background-color: #e8f5e8;
    color: #2e7d32;
}

.task-category.category-health {
    background-color: #fff3e0;
    color: #ef6c00;
}

.task-category.category-finance {
    background-color: #e0f2f1;
    color: #00695c;
}

.task-category.category-shopping {
    background-color: #fce4ec;
    color: #c2185b;
}

.task-category.category-other {
    background-color: #f5f5f5;
    color: #616161;
}

/* Category Statistics */
.category-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
}

.category-stat-item {
    background: white;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.category-stat-item h4 {
    margin: 0 0 8px 0;
    font-size: 0.9rem;
    color: #495057;
}

.category-stat-item .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
}
```

#### 3.6 Update JavaScript untuk Category Functionality

**File**: `src/app.js` (update existing file)

Tambahkan event listeners untuk category features:

```javascript
// Tambahkan di function setupEventListeners()

// Category filter buttons
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(btn => {
    btn.addEventListener('click', handleCategoryFilter);
});

// Tambahkan functions baru di akhir file

/**
 * Handle category filter changes
 */
function handleCategoryFilter(event) {
    const category = event.target.dataset.category;
    
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Clear other filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Render tasks filtered by category
    renderTaskList('category', category);
}

/**
 * Update renderTaskList function untuk support category filtering
 */
function renderTaskList(filterType = 'all', filterValue = null) {
    const taskListContainer = document.getElementById('taskList');
    if (!taskListContainer) return;
    
    let tasks = taskService.getAllTasks();
    
    // Apply filters
    switch (filterType) {
        case 'pending':
            tasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            tasks = tasks.filter(task => task.completed);
            break;
        case 'high':
            tasks = tasks.filter(task => task.priority === 'high');
            break;
        case 'medium':
            tasks = tasks.filter(task => task.priority === 'medium');
            break;
        case 'low':
            tasks = tasks.filter(task => task.priority === 'low');
            break;
        case 'category':
            tasks = tasks.filter(task => task.category === filterValue);
            break;
    }
    
    // Sort tasks by creation date (newest first)
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (tasks.length === 0) {
        const filterText = filterType === 'category' ? 
            `in ${filterValue} category` : 
            `with ${filterType} filter`;
            
        taskListContainer.innerHTML = `
            <div class="empty-state">
                <p>No tasks found ${filterText}</p>
                <small>Create your first task using the form above</small>
            </div>
        `;
        return;
    }
    
    const taskHTML = tasks.map(task => createTaskHTML(task)).join('');
    taskListContainer.innerHTML = taskHTML;
}

/**
 * Update createTaskHTML function untuk include category display
 */
function createTaskHTML(task) {
    const priorityClass = `priority-${task.priority}`;
    const completedClass = task.completed ? 'completed' : '';
    const categoryClass = `category-${task.category}`;
    const createdDate = new Date(task.createdAt).toLocaleDateString();
    
    // Get category display name
    const categoryDisplayNames = {
        'work': 'Work',
        'personal': 'Personal',
        'study': 'Study',
        'health': 'Health',
        'finance': 'Finance',
        'shopping': 'Shopping',
        'other': 'Other'
    };
    
    const categoryDisplay = categoryDisplayNames[task.category] || task.category;
    
    return `
        <div class="task-item ${priorityClass} ${completedClass}" data-task-id="${task.id}">
            <div class="task-content">
                <div class="task-header">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    <div class="task-badges">
                        <span class="task-priority">${task.priority}</span>
                        <span class="task-category ${categoryClass}">${categoryDisplay}</span>
                    </div>
                </div>
                ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                <div class="task-meta">
                    <small>Created: ${createdDate}</small>
                    ${task.completed ? `<small>Completed: ${new Date(task.updatedAt).toLocaleDateString()}</small>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-toggle" onclick="handleTaskToggle('${task.id}')" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
                    ${task.completed ? '↶' : '✓'}
                </button>
                <button class="btn btn-delete" onclick="handleTaskDelete('${task.id}')" title="Delete task">
                    🗑️
                </button>
            </div>
        </div>
    `;
}

/**
 * Render category statistics
 */
function renderCategoryStats() {
    const statsContainer = document.getElementById('categoryStats');
    if (!statsContainer) return;
    
    const tasks = taskService.getAllTasks();
    const categoryStats = {};
    
    // Initialize categories
    const categories = ['work', 'personal', 'study', 'health', 'finance', 'shopping', 'other'];
    categories.forEach(cat => {
        categoryStats[cat] = { total: 0, completed: 0 };
    });
    
    // Count tasks by category
    tasks.forEach(task => {
        if (categoryStats[task.category]) {
            categoryStats[task.category].total++;
            if (task.completed) {
                categoryStats[task.category].completed++;
            }
        }
    });
    
    // Render stats
    const statsHTML = Object.entries(categoryStats)
        .filter(([category, stats]) => stats.total > 0)
        .map(([category, stats]) => {
            const displayNames = {
                'work': 'Work',
                'personal': 'Personal', 
                'study': 'Study',
                'health': 'Health',
                'finance': 'Finance',
                'shopping': 'Shopping',
                'other': 'Other'
            };
            
            return `
                <div class="category-stat-item">
                    <h4>${displayNames[category]}</h4>
                    <div class="stat-number">${stats.total}</div>
                    <small>${stats.completed} completed</small>
                </div>
            `;
        }).join('');
    
    if (statsHTML) {
        statsContainer.innerHTML = `
            <h3>Tasks by Category</h3>
            <div class="category-stats">${statsHTML}</div>
        `;
    }
}

// Update initializeApp function untuk include category stats
function initializeApp() {
    console.log('🚀 Initializing Task Management System...');
    
    // Initialize storage manager
    storageManager = new StorageManager('taskApp');
    
    // Initialize task service
    taskService = new TaskService(storageManager);
    
    // Set up event listeners
    setupEventListeners();
    
    // Listen for task service events
    taskService.addListener(handleTaskServiceEvent);
    
    // Render initial UI
    renderTaskList();
    renderTaskStats();
    renderCategoryStats(); // NEW: Render category stats
    
    console.log('✅ Application initialized successfully!');
    console.log(`📊 Loaded ${taskService.getAllTasks().length} existing tasks`);
}
```

#### 3.7 Commit Feature Changes

Sekarang kita commit perubahan kita step by step:

```bash
# Check status untuk lihat file yang berubah
git status

# Add dan commit model changes
git add src/models/EnhancedTask.js
git commit -m "feat(categories): add category methods to EnhancedTask model

- Add updateCategory() method
- Add getAvailableCategories() static method  
- Add getCategoryDisplayName() for UI display
- Add isInCategory() helper method"

# Add dan commit repository changes
git add src/repositories/TaskRepository.js
git commit -m "feat(categories): add category filtering to TaskRepository

- Add findByCategory() method
- Add getCategoryStats() for analytics
- Add getMostUsedCategories() method"

# Add dan commit controller changes
git add src/controllers/TaskController.js
git commit -m "feat(categories): add category management to TaskController

- Add getTasksByCategory() method
- Add getCategoryStats() method
- Add updateTaskCategory() method
- Add getAvailableCategories() method"

# Add dan commit UI changes
git add public/index.html public/styles.css src/app.js
git commit -m "feat(categories): add category UI and filtering

- Add category selector to task form
- Add category filter buttons
- Add category display in task items
- Add category statistics display
- Update JavaScript for category functionality"

# Check commit history
git log --oneline
```
### Step 4: Testing the Feature

Sebelum merge, kita harus test feature kita.

#### 4.1 Manual Testing

```bash
# Test aplikasi
npm start
```

1. Buka http://localhost:3000
2. Create beberapa tasks dengan categories berbeda
3. Test category filtering buttons
4. Pastikan category display muncul di task items
5. Check category statistics

#### 4.2 Add Automated Tests

**File**: `tests/models/EnhancedTask.test.js` (update existing file)

Tambahkan tests untuk category functionality:

```javascript
// Tambahkan test cases ini di describe('EnhancedTask Model')

describe('Category Management', () => {
    let task;
    
    beforeEach(() => {
        const taskData = TestDataFactory.createValidTaskData();
        task = new EnhancedTask(taskData.title, taskData.description, taskData.ownerId);
    });
    
    test('should have default category', () => {
        expect(task.category).toBe('personal');
    });
    
    test('should update category successfully', () => {
        // Act
        task.updateCategory('work');
        
        // Assert
        expect(task.category).toBe('work');
        expect(task.updatedAt).toBeInstanceOf(Date);
    });
    
    test('should throw error for invalid category', () => {
        // Act & Assert
        expect(() => {
            task.updateCategory('invalid-category');
        }).toThrow('Kategori tidak valid');
    });
    
    test('should return available categories', () => {
        // Act
        const categories = EnhancedTask.getAvailableCategories();
        
        // Assert
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toContain('work');
        expect(categories).toContain('personal');
        expect(categories).toContain('study');
        expect(categories.length).toBeGreaterThan(0);
    });
    
    test('should get category display name', () => {
        // Arrange
        task.updateCategory('work');
        
        // Act
        const displayName = task.getCategoryDisplayName();
        
        // Assert
        expect(displayName).toBe('Work & Business');
    });
    
    test('should check if task is in category', () => {
        // Arrange
        task.updateCategory('study');
        
        // Act & Assert
        expect(task.isInCategory('study')).toBe(true);
        expect(task.isInCategory('work')).toBe(false);
    });
});
```

**File**: `tests/controllers/TaskController.test.js` (update existing file)

Tambahkan tests untuk category controller methods:

```javascript
// Tambahkan test cases ini di describe('TaskController')

describe('Category Management', () => {
    let testTask;
    
    beforeEach(() => {
        const taskData = TestDataFactory.createValidTaskData({ category: 'work' });
        const createResponse = taskController.createTask(taskData);
        testTask = createResponse.data;
    });
    
    test('should get tasks by category', () => {
        // Act
        const response = taskController.getTasksByCategory('work');
        
        // Assert
        TestAssertions.assertControllerResponse(response, true);
        expect(response.data).toHaveLength(1);
        expect(response.data[0].category).toBe('work');
        expect(response.category).toBe('work');
        expect(response.categoryDisplayName).toBe('Work & Business');
    });
    
    test('should fail with invalid category', () => {
        // Act
        const response = taskController.getTasksByCategory('invalid');
        
        // Assert
        TestAssertions.assertControllerResponse(response, false);
        expect(response.error).toBe('Kategori tidak valid');
    });
    
    test('should get category statistics', () => {
        // Arrange - create tasks in different categories
        taskController.createTask(TestDataFactory.createValidTaskData({ category: 'personal' }));
        taskController.createTask(TestDataFactory.createValidTaskData({ category: 'study' }));
        
        // Act
        const response = taskController.getCategoryStats();
        
        // Assert
        TestAssertions.assertControllerResponse(response, true);
        expect(response.data).toHaveProperty('byCategory');
        expect(response.data).toHaveProperty('mostUsed');
        expect(response.data.byCategory.work.total).toBe(1);
        expect(response.data.byCategory.personal.total).toBe(1);
        expect(response.data.byCategory.study.total).toBe(1);
    });
    
    test('should update task category', () => {
        // Act
        const response = taskController.updateTaskCategory(testTask.id, 'personal');
        
        // Assert
        TestAssertions.assertControllerResponse(response, true);
        expect(response.data.category).toBe('personal');
        expect(response.message).toContain('Personal');
    });
    
    test('should get available categories', () => {
        // Act
        const response = taskController.getAvailableCategories();
        
        // Assert
        TestAssertions.assertControllerResponse(response, true);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.data.length).toBeGreaterThan(0);
        expect(response.data[0]).toHaveProperty('value');
        expect(response.data[0]).toHaveProperty('label');
    });
});
```

#### 4.3 Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test EnhancedTask.test.js

# Run tests with coverage
npm run test:coverage
```

Pastikan semua tests passing sebelum lanjut ke step berikutnya.

#### 4.4 Commit Test Changes

```bash
# Add dan commit test changes
git add tests/
git commit -m "test(categories): add comprehensive tests for category functionality

- Add category management tests for EnhancedTask model
- Add category controller tests for TaskController
- Test category validation and error handling
- Test category statistics and filtering"
```

### Step 5: Push Feature Branch dan Create Pull Request

Sekarang kita push feature branch ke GitHub dan create pull request.

#### 5.1 Push Feature Branch

```bash
# Push feature branch ke GitHub
git push -u origin feature/task-categories

# Check branch di GitHub
# Buka https://github.com/your-username/task-management-system
# Anda akan lihat notification untuk create pull request
```

#### 5.2 Create Pull Request

1. **Di GitHub**, click "Compare & pull request" button
2. **Title**: `feat: add task categories functionality`
3. **Description**: 
```markdown
## 🎯 What this PR does

Adds comprehensive task categorization functionality to the task management system.

## ✨ Features Added

- **Category Management**: Tasks can be assigned to categories (Work, Personal, Study, Health, Finance, Shopping, Other)
- **Category Filtering**: Filter tasks by category using dedicated filter buttons
- **Category Statistics**: Display task counts and completion rates by category
- **Category Display**: Visual category badges on task items with color coding
- **Category Validation**: Proper validation and error handling for categories

## 🧪 Testing

- ✅ All existing tests still pass
- ✅ Added comprehensive unit tests for category functionality
- ✅ Added controller tests for category management
- ✅ Manual testing completed for all category features

## 📸 Screenshots

(Add screenshots of the new category features if possible)

## 🔍 Code Review Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] No breaking changes to existing functionality
- [ ] Documentation updated where needed
- [ ] UI is responsive and accessible

## 🚀 How to Test

1. Pull this branch: `git checkout feature/task-categories`
2. Run `npm start`
3. Create tasks with different categories
4. Test category filtering buttons
5. Verify category statistics display
6. Run tests: `npm test`
```

4. **Reviewers**: Jika ada teman sekelas, assign mereka sebagai reviewer
5. **Labels**: Add label "enhancement" atau "feature"
6. Click "Create pull request"

#### 5.3 Code Review Process

**Jika Anda reviewer:**

1. **Check out branch** untuk test locally:
```bash
git fetch origin
git checkout feature/task-categories
npm start
# Test functionality manually
npm test
# Run tests
```

2. **Review code changes** di GitHub:
   - Click "Files changed" tab
   - Review setiap file yang berubah
   - Add comments jika ada suggestions
   - Check for:
     - Code quality dan readability
     - Proper error handling
     - Test coverage
     - No breaking changes

3. **Leave review**:
   - "Approve" jika code bagus
   - "Request changes" jika ada issues
   - "Comment" untuk general feedback

**Contoh review comments:**
- ✅ Good: "Great implementation! Consider adding JSDoc comments to the new methods for better documentation."
- ✅ Good: "The category validation looks solid. Maybe we could extract the category list to a constants file for easier maintenance?"
- ❌ Bad: "This is wrong"
- ❌ Bad: "I don't like this"

### Step 6: Merge dan Cleanup

Setelah code review approved, kita merge ke main branch.

#### 6.1 Merge Pull Request

1. **Di GitHub**, pada pull request page
2. Click "Merge pull request" button
3. **Merge method**: Pilih "Squash and merge" (untuk clean history)
4. **Commit message**: Edit jika perlu, biasanya sudah bagus
5. Click "Confirm squash and merge"
6. Click "Delete branch" untuk cleanup

#### 6.2 Update Local Repository

```bash
# Switch ke main branch
git checkout main

# Pull latest changes dari GitHub
git pull origin main

# Delete local feature branch (sudah tidak diperlukan)
git branch -d feature/task-categories

# Verify merge berhasil
git log --oneline -5
# Anda harus lihat commit merge dari feature branch
```

#### 6.3 Verify Everything Works

```bash
# Test aplikasi setelah merge
npm start

# Run tests
npm test

# Check semua functionality masih bekerja
```

### Step 7: Practice Merge Conflicts

Sekarang kita practice handle merge conflicts - situasi yang sering terjadi dalam team development.

#### 7.1 Create Conflicting Branches

```bash
# Create branch pertama
git checkout -b feature/ui-improvements
```

**File**: `public/styles.css` (edit existing file)

Tambahkan di akhir file:

```css
/* UI Improvements - Version 1 */
.task-item {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn {
    border-radius: 8px;
    font-weight: 600;
}
```

```bash
# Commit changes
git add public/styles.css
git commit -m "feat(ui): improve task item and button styling"

# Switch ke main dan create another branch
git checkout main
git checkout -b feature/ui-colors
```

**File**: `public/styles.css` (edit same section)

Tambahkan di akhir file (same location):

```css
/* UI Colors - Version 2 */
.task-item {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border: 1px solid #e1e8ed;
}

.btn {
    transition: all 0.3s ease;
    text-transform: uppercase;
}
```

```bash
# Commit changes
git add public/styles.css
git commit -m "feat(ui): add gradient backgrounds and button animations"
```

#### 7.2 Create Merge Conflict

```bash
# Merge first branch ke main
git checkout main
git merge feature/ui-improvements
# This should work fine

# Try to merge second branch (will create conflict)
git merge feature/ui-colors
# Git akan report conflict!
```

#### 7.3 Resolve Merge Conflict

```bash
# Check conflict status
git status
# Akan show "both modified: public/styles.css"

# Open styles.css di editor
# Anda akan lihat conflict markers:
```

File akan terlihat seperti ini:
```css
/* ... existing CSS ... */

<<<<<<< HEAD
/* UI Improvements - Version 1 */
.task-item {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn {
    border-radius: 8px;
    font-weight: 600;
}
=======
/* UI Colors - Version 2 */
.task-item {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border: 1px solid #e1e8ed;
}

.btn {
    transition: all 0.3s ease;
    text-transform: uppercase;
}
>>>>>>> feature/ui-colors
```

**Resolve conflict** dengan menggabungkan kedua changes:

```css
/* UI Improvements - Combined */
.task-item {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border: 1px solid #e1e8ed;
}

.btn {
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-transform: uppercase;
}
```

```bash
# Stage resolved file
git add public/styles.css

# Complete merge
git commit -m "resolve: merge UI improvements and colors

- Combine border-radius and box-shadow from ui-improvements
- Combine gradient background and border from ui-colors  
- Merge button styles from both branches"

# Clean up branches
git branch -d feature/ui-improvements
git branch -d feature/ui-colors
```

### Step 8: Team Collaboration Setup

Sekarang kita setup project untuk team collaboration.

#### 8.1 Create Team Documentation

**File**: `CONTRIBUTING.md` (buat file baru)

```markdown
# Contributing to Task Management System

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Workflow

### 1. Fork and Clone
```bash
git clone https://github.com/your-username/task-management-system.git
cd task-management-system
npm install
```

### 2. Create Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Write code following our coding standards
- Add tests for new functionality
- Update documentation if needed
- Test your changes locally

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `test:` for adding tests
- `refactor:` for code refactoring

### 5. Push and Create PR
```bash
git push -u origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Review Guidelines

### For Authors
- Provide clear PR description
- Include screenshots for UI changes
- Link related issues
- Ensure all tests pass
- Keep PRs focused and small

### For Reviewers
- Be constructive and respectful
- Test changes locally when possible
- Check for code quality and consistency
- Verify tests are adequate
- Approve when ready or request changes

## Coding Standards

### JavaScript
- Use ES6+ features
- Follow consistent naming conventions
- Add JSDoc comments for public methods
- Handle errors appropriately
- Write meaningful variable names

### Testing
- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow AAA pattern (Arrange-Act-Assert)

### Git
- Use meaningful commit messages
- Keep commits atomic (one logical change)
- Rebase feature branches before merging
- Delete branches after merging

## Getting Help

- Check existing issues and PRs
- Ask questions in PR comments
- Contact maintainers if needed

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a positive environment
```

**File**: `CODE_OF_CONDUCT.md` (buat file baru)

```markdown
# Code of Conduct

## Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

## Enforcement

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 1.4.
```

#### 8.2 Update README.md

**File**: `README.md` (update existing file)

```markdown
# Task Management System

A collaborative task management application built with vanilla JavaScript, demonstrating software engineering principles and team development practices.

## 🚀 Features

- ✅ **Task Management**: Create, edit, delete, and organize tasks
- 🏷️ **Categories**: Organize tasks by categories (Work, Personal, Study, etc.)
- 🔍 **Search & Filter**: Find tasks quickly with advanced filtering
- 👥 **Multi-User Support**: User management and authentication
- 📊 **Analytics**: Task statistics and progress tracking
- 🧪 **Testing**: Comprehensive test suite with Jest
- 🔄 **Version Control**: Git workflow with feature branches

## 🛠️ Getting Started

### Prerequisites
- Node.js 14+ installed
- Git installed and configured
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/task-management-system.git
cd task-management-system

# Install dependencies
npm install

# Start development server
npm start
```

Visit http://localhost:3000 to see the application.

### Development Commands
```bash
npm start          # Start development server
npm test           # Run test suite
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🏗️ Architecture

This project demonstrates key software engineering principles:

- **MVC Pattern**: Separation of Model, View, and Controller
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Loose coupling between components
- **Test-Driven Development**: Comprehensive test coverage
- **Version Control**: Git workflow with feature branches

### Project Structure
```
src/
├── models/          # Data models and business logic
├── controllers/     # Request handling and coordination
├── repositories/    # Data access layer
├── services/        # Business logic services
└── utils/           # Utility functions

tests/
├── models/          # Model unit tests
├── controllers/     # Controller integration tests
├── repositories/    # Repository tests
└── helpers/         # Test utilities

public/
├── index.html       # Main HTML file
├── styles.css       # Application styles
└── assets/          # Static assets
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit: `git commit -m "feat: add amazing feature"`
5. Push: `git push origin feature/amazing-feature`
6. Create a Pull Request

## 🧪 Testing

We maintain high test coverage to ensure code quality:

```bash
# Run all tests
npm test

# Run specific test file
npm test User.test.js

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Test Utilities**: Shared test helpers and factories

## 📚 Learning Objectives

This project is designed for software engineering education:

- **Day 1**: Basic structure and MVC pattern
- **Day 2**: Requirements analysis and design patterns
- **Day 3**: Testing and quality assurance
- **Day 4**: Version control and collaboration
- **Day 5**: Deployment and production practices

## 🔧 Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express (development server)
- **Testing**: Jest with jsdom
- **Version Control**: Git with GitHub
- **Development**: ESLint, Prettier for code quality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Software Engineering Course instructors and students
- Open source community for tools and inspiration
- Contributors who help improve this project

## 📞 Support

- Create an issue for bug reports or feature requests
- Check existing issues before creating new ones
- Contact maintainers for questions

---

**Happy Coding!** 🎉
```

#### 8.3 Create Team Setup Script

**File**: `scripts/setup-team-member.sh` (buat folder dan file baru)

```bash
#!/bin/bash

echo "🚀 Setting up Task Management System for new team member..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is required but not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is required but not installed${NC}"
    echo "Please install Git from https://git-scm.com/"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

# Run tests to verify setup
echo "🧪 Running tests to verify setup..."
npm test

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Some tests failed, but setup can continue${NC}"
else
    echo -e "${GREEN}✅ All tests passed${NC}"
fi

# Setup Git hooks (optional)
echo "🔧 Setting up Git hooks..."
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running tests before commit..."
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
echo -e "${GREEN}✅ Git hooks setup complete${NC}"

# Final instructions
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start development server: ${YELLOW}npm start${NC}"
echo "2. Visit http://localhost:3000 to see the application"
echo "3. Read CONTRIBUTING.md for development guidelines"
echo "4. Create a feature branch for your work: ${YELLOW}git checkout -b feature/your-feature${NC}"
echo ""
echo "Happy coding! 🚀"
```

```bash
# Make script executable
chmod +x scripts/setup-team-member.sh
```

#### 8.4 Commit Team Setup

```bash
# Add all team documentation
git add CONTRIBUTING.md CODE_OF_CONDUCT.md README.md scripts/

git commit -m "docs: add comprehensive team collaboration setup

- Add CONTRIBUTING.md with development workflow guidelines
- Add CODE_OF_CONDUCT.md for community standards
- Update README.md with detailed project information
- Add setup script for new team members
- Include Git hooks for automated testing"

# Push to GitHub
git push origin main
```
### Step 9: Advanced Git Workflows

Sekarang kita practice advanced Git workflows yang sering digunakan dalam professional development.

#### 9.1 Git Rebase untuk Clean History

```bash
# Create feature branch dengan multiple commits
git checkout -b feature/task-search

# Make several small commits
echo "// Search functionality" >> src/app.js
git add src/app.js
git commit -m "add search comment"

echo "// Search input" >> public/index.html
git add public/index.html
git commit -m "add search input comment"

echo "// Search styling" >> public/styles.css
git add public/styles.css
git commit -m "add search styling comment"

# Check commit history
git log --oneline -5
```

**Interactive Rebase untuk cleanup commits:**

```bash
# Rebase last 3 commits interactively
git rebase -i HEAD~3

# Di editor yang muncul, Anda akan lihat:
# pick abc1234 add search comment
# pick def5678 add search input comment  
# pick ghi9012 add search styling comment

# Change to:
# pick abc1234 add search comment
# squash def5678 add search input comment
# squash ghi9012 add search styling comment

# Save dan close editor
# Git akan prompt untuk edit commit message
# Edit menjadi: "feat: add basic search functionality setup"
```

#### 9.2 Cherry-pick untuk Selective Merging

```bash
# Scenario: Anda ingin ambil specific commit dari branch lain
git checkout main

# Create another branch dengan useful commit
git checkout -b feature/bug-fixes
echo "// Bug fix" >> src/app.js
git add src/app.js
git commit -m "fix: resolve task deletion bug"

# Switch ke branch lain dan cherry-pick commit tersebut
git checkout feature/task-search
git cherry-pick <commit-hash-from-bug-fixes>

# Now the bug fix is in both branches
```

#### 9.3 Git Stash untuk Temporary Storage

```bash
# Scenario: Anda sedang coding tapi harus switch branch urgent
# Make some changes (don't commit yet)
echo "// Work in progress" >> src/app.js

# Stash changes
git stash push -m "WIP: search functionality"

# Switch to other branch for urgent work
git checkout main
# Do urgent work...

# Come back dan restore stashed changes
git checkout feature/task-search
git stash pop

# List all stashes
git stash list

# Apply specific stash without removing it
git stash apply stash@{0}
```

### Step 10: Collaboration Simulation

Mari kita simulate real team collaboration scenario.

#### 10.1 Simulate Team Member Workflow

**Scenario**: Anda adalah team member yang join project existing.

```bash
# 1. Clone repository (simulate new team member)
# (In real scenario, they would clone from GitHub)

# 2. Setup development environment
./scripts/setup-team-member.sh

# 3. Create feature branch untuk assigned task
git checkout -b feature/user-profile

# 4. Implement user profile feature
```

**File**: `src/controllers/UserController.js` (update existing file)

Tambahkan method untuk user profile:

```javascript
// Tambahkan method ini di class UserController

/**
 * Get user profile with statistics
 * @returns {Object} - Response dengan user profile dan stats
 */
getUserProfile() {
    try {
        if (!this.currentUser) {
            return {
                success: false,
                error: 'User harus login terlebih dahulu'
            };
        }
        
        // Get user's task statistics
        const userTasks = this.taskRepository ? this.taskRepository.findByOwner(this.currentUser.id) : [];
        
        const stats = {
            totalTasks: userTasks.length,
            completedTasks: userTasks.filter(task => task.isCompleted).length,
            pendingTasks: userTasks.filter(task => !task.isCompleted).length,
            overdueTasks: userTasks.filter(task => task.isOverdue).length,
            tasksByCategory: {}
        };
        
        // Calculate completion rate
        stats.completionRate = stats.totalTasks > 0 ? 
            Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
        
        // Group tasks by category
        userTasks.forEach(task => {
            const category = task.category;
            if (!stats.tasksByCategory[category]) {
                stats.tasksByCategory[category] = 0;
            }
            stats.tasksByCategory[category]++;
        });
        
        return {
            success: true,
            data: {
                user: {
                    id: this.currentUser.id,
                    username: this.currentUser.username,
                    email: this.currentUser.email,
                    fullName: this.currentUser.fullName,
                    role: this.currentUser.role,
                    createdAt: this.currentUser.createdAt,
                    lastLoginAt: this.currentUser.lastLoginAt,
                    preferences: this.currentUser.preferences
                },
                statistics: stats
            }
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update user preferences
 * @param {Object} newPreferences - New preferences
 * @returns {Object} - Response success atau error
 */
updateUserPreferences(newPreferences) {
    try {
        if (!this.currentUser) {
            return {
                success: false,
                error: 'User harus login terlebih dahulu'
            };
        }
        
        // Validate preferences
        const validPreferences = ['theme', 'defaultCategory', 'emailNotifications', 'language'];
        const invalidKeys = Object.keys(newPreferences).filter(key => !validPreferences.includes(key));
        
        if (invalidKeys.length > 0) {
            return {
                success: false,
                error: `Invalid preference keys: ${invalidKeys.join(', ')}`
            };
        }
        
        // Update preferences
        const updatedUser = this.userRepository.update(this.currentUser.id, {
            preferences: {
                ...this.currentUser.preferences,
                ...newPreferences
            }
        });
        
        if (!updatedUser) {
            return {
                success: false,
                error: 'Gagal mengupdate preferences'
            };
        }
        
        this.currentUser = updatedUser;
        
        return {
            success: true,
            data: updatedUser.preferences,
            message: 'Preferences berhasil diupdate'
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
```

```bash
# 5. Commit changes
git add src/controllers/UserController.js
git commit -m "feat(profile): add user profile and preferences management

- Add getUserProfile() method with task statistics
- Add updateUserPreferences() method with validation
- Calculate completion rate and category distribution
- Include comprehensive error handling"

# 6. Push branch
git push -u origin feature/user-profile

# 7. Create pull request (via GitHub UI)
```

#### 10.2 Code Review Process

**Sebagai reviewer**, practice memberikan feedback konstruktif:

**Good Review Comments:**
```
✅ "Great implementation! The statistics calculation looks comprehensive. 
   Consider adding JSDoc comments for better documentation."

✅ "The error handling is solid. One suggestion: we could extract the 
   preference validation to a separate method for reusability."

✅ "Love the completion rate calculation! Maybe we could add a method to 
   get productivity trends over time in the future."
```

**Bad Review Comments:**
```
❌ "This is wrong"
❌ "I don't like this approach"
❌ "Change everything"
```

#### 10.3 Handle Review Feedback

```bash
# Address review feedback
git checkout feature/user-profile

# Make requested changes
# Add JSDoc comments, extract validation method, etc.

# Commit improvements
git add .
git commit -m "refactor(profile): address code review feedback

- Add comprehensive JSDoc documentation
- Extract preference validation to separate method
- Improve error messages for better UX"

# Push updates
git push origin feature/user-profile
```

### Step 11: Git Best Practices dan Troubleshooting

#### 11.1 Commit Message Best Practices

**Good Commit Messages:**
```bash
git commit -m "feat(auth): add user authentication system

- Implement login/logout functionality
- Add session management
- Include password validation
- Add authentication middleware"

git commit -m "fix(tasks): resolve task deletion bug

- Fix issue where completed tasks couldn't be deleted
- Add proper error handling for delete operations
- Update tests to cover edge cases"

git commit -m "docs(readme): update installation instructions

- Add prerequisites section
- Include troubleshooting guide
- Update development commands"
```

**Bad Commit Messages:**
```bash
git commit -m "fix stuff"
git commit -m "update"
git commit -m "changes"
git commit -m "asdf"
```

#### 11.2 Branch Naming Conventions

**Good Branch Names:**
```bash
feature/user-authentication
feature/task-categories
bugfix/task-deletion-error
hotfix/security-vulnerability
chore/update-dependencies
docs/api-documentation
```

**Bad Branch Names:**
```bash
my-branch
test
fix
new-stuff
branch1
```

#### 11.3 Common Git Issues dan Solutions

**Issue 1: Accidentally committed to wrong branch**
```bash
# Move commits to correct branch
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset --hard HEAD~1
```

**Issue 2: Need to change last commit message**
```bash
# If not pushed yet
git commit --amend -m "corrected commit message"

# If already pushed (use carefully!)
git commit --amend -m "corrected commit message"
git push --force-with-lease origin branch-name
```

**Issue 3: Merge conflict in binary files**
```bash
# Choose version from specific branch
git checkout --theirs path/to/file  # Use their version
git checkout --ours path/to/file    # Use our version
git add path/to/file
git commit
```

**Issue 4: Accidentally deleted branch**
```bash
# Find the commit hash
git reflog

# Recreate branch
git checkout -b recovered-branch <commit-hash>
```

**Issue 5: Want to undo last commit but keep changes**
```bash
# Soft reset (keeps changes in working directory)
git reset --soft HEAD~1

# Mixed reset (keeps changes but unstages them)
git reset HEAD~1

# Hard reset (DANGER: loses all changes)
git reset --hard HEAD~1
```

### Step 12: Final Integration dan Testing

#### 12.1 Integration Testing

Test semua features yang sudah diimplementasi bekerja together:

```bash
# Start fresh
git checkout main
git pull origin main

# Test aplikasi
npm start
```

**Manual Testing Checklist:**
- [ ] Create tasks dengan different categories
- [ ] Test category filtering
- [ ] Test task completion/deletion
- [ ] Test user profile features (jika sudah dimerge)
- [ ] Test search functionality
- [ ] Verify responsive design
- [ ] Check browser console for errors

#### 12.2 Run Full Test Suite

```bash
# Run all tests
npm test

# Run tests dengan coverage
npm run test:coverage

# Check coverage report
open coverage/lcov-report/index.html
```

**Target Coverage:**
- Lines: 80%+
- Functions: 85%+
- Branches: 75%+
- Statements: 80%+

#### 12.3 Performance Testing

```bash
# Test dengan banyak tasks
# Create 100+ tasks untuk test performance
# Check loading time dan responsiveness
```

### Step 13: Documentation dan Wrap-up

#### 13.1 Update Documentation

**File**: `CHANGELOG.md` (buat file baru)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2024-01-XX

### Added
- Task categorization system with 7 predefined categories
- Category filtering and statistics
- User profile with task analytics
- User preferences management
- Comprehensive team collaboration documentation
- Git workflow with feature branches and code review process
- Automated setup script for new team members
- Advanced Git practices (rebase, cherry-pick, stash)

### Changed
- Enhanced task model with category support
- Updated UI with category displays and filters
- Improved repository pattern with category methods
- Enhanced controller with category management

### Fixed
- Task deletion bug for completed tasks
- UI responsiveness issues on mobile devices
- Test coverage gaps in category functionality

### Technical
- Added comprehensive test suite for category features
- Implemented Git hooks for automated testing
- Setup continuous integration workflow
- Added code review guidelines and templates

## [1.3.0] - 2024-01-XX

### Added
- Comprehensive testing framework with Jest
- Unit tests for models and controllers
- Integration tests for complete workflows
- Test utilities and factories
- Code coverage reporting

## [1.2.0] - 2024-01-XX

### Added
- MVC architecture implementation
- Repository pattern for data access
- Enhanced task model with advanced features
- User management system
- Multi-user support

## [1.1.0] - 2024-01-XX

### Added
- Basic task management functionality
- Task creation, editing, and deletion
- Task priority and status management
- Local storage persistence
- Basic UI with responsive design

## [1.0.0] - 2024-01-XX

### Added
- Initial project setup
- Basic HTML structure
- CSS styling framework
- JavaScript foundation
- Development server setup
```

#### 13.2 Create Project Summary

**File**: `PROJECT-SUMMARY.md` (buat file baru)

```markdown
# Project Summary: Task Management System

## 🎯 Project Overview

This project demonstrates a complete software engineering workflow from initial development to team collaboration, implementing a full-featured task management system using vanilla JavaScript and modern development practices.

## 🏗️ Architecture Highlights

### Design Patterns Implemented
- **MVC (Model-View-Controller)**: Clear separation of concerns
- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Test data generation
- **Observer Pattern**: Event-driven updates

### Code Quality Practices
- **Test-Driven Development**: 80%+ test coverage
- **Clean Code Principles**: Readable, maintainable code
- **SOLID Principles**: Well-structured, extensible design
- **Documentation**: Comprehensive inline and external docs

## 🚀 Features Implemented

### Core Functionality
- ✅ **Task Management**: CRUD operations with validation
- ✅ **User System**: Multi-user support with authentication
- ✅ **Categories**: Task organization with 7 categories
- ✅ **Filtering**: Advanced search and filter capabilities
- ✅ **Statistics**: Analytics and progress tracking

### Technical Features
- ✅ **Testing**: Jest-based test suite with mocking
- ✅ **Version Control**: Git workflow with branching
- ✅ **Code Review**: Pull request process
- ✅ **Documentation**: Team collaboration guides
- ✅ **Automation**: Setup scripts and Git hooks

## 📊 Project Metrics

### Code Quality
- **Test Coverage**: 85%+ across all modules
- **Code Lines**: ~2,500 lines of production code
- **Test Lines**: ~1,800 lines of test code
- **Documentation**: 100% of public APIs documented

### Git Activity
- **Commits**: 50+ meaningful commits
- **Branches**: 10+ feature branches
- **Pull Requests**: 5+ with code reviews
- **Contributors**: Designed for team collaboration

## 🎓 Learning Outcomes Achieved

### Day 1: Software Engineering Fundamentals
- ✅ MVC architecture implementation
- ✅ Modular code organization
- ✅ Separation of concerns
- ✅ Basic testing concepts

### Day 2: Requirements & Design Patterns
- ✅ Requirements analysis and user stories
- ✅ Repository pattern implementation
- ✅ Advanced model design
- ✅ Controller pattern usage

### Day 3: Testing & Quality Assurance
- ✅ Jest testing framework setup
- ✅ Unit and integration testing
- ✅ Test utilities and factories
- ✅ Code coverage analysis

### Day 4: Version Control & Collaboration
- ✅ Git workflow mastery
- ✅ Feature branch development
- ✅ Code review processes
- ✅ Team collaboration setup

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox/Grid
- **JavaScript ES6+**: Modern language features
- **DOM API**: Direct browser interaction

### Development Tools
- **Node.js**: Development server
- **Jest**: Testing framework
- **Git**: Version control
- **GitHub**: Collaboration platform

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **JSDoc**: Documentation generation
- **Git Hooks**: Automated quality checks

## 📈 Performance Characteristics

### Runtime Performance
- **Load Time**: <2 seconds for 1000+ tasks
- **Memory Usage**: <50MB for typical usage
- **Responsiveness**: 60fps UI interactions
- **Storage**: Efficient localStorage usage

### Development Performance
- **Test Suite**: <5 seconds execution time
- **Build Process**: Instant development server
- **Hot Reload**: Immediate feedback loop
- **Git Operations**: Optimized for team workflow

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time collaboration with WebSockets
- [ ] Cloud synchronization
- [ ] Mobile app version
- [ ] Advanced analytics dashboard
- [ ] Team management features
- [ ] API integration capabilities

### Technical Improvements
- [ ] TypeScript migration
- [ ] Progressive Web App features
- [ ] Automated deployment pipeline
- [ ] Performance monitoring
- [ ] Security enhancements
- [ ] Accessibility improvements

## 🏆 Best Practices Demonstrated

### Software Engineering
- Clean architecture with clear boundaries
- Comprehensive error handling
- Input validation and sanitization
- Consistent coding standards
- Proper abstraction layers

### Team Collaboration
- Clear documentation and guidelines
- Code review processes
- Git workflow best practices
- Onboarding automation
- Knowledge sharing culture

### Quality Assurance
- Test-driven development approach
- Continuous integration mindset
- Code coverage monitoring
- Performance considerations
- User experience focus

## 📚 Educational Value

This project serves as a comprehensive example of:
- Modern JavaScript development practices
- Software engineering principles in action
- Team collaboration workflows
- Quality assurance methodologies
- Professional development standards

Perfect for students learning software engineering, team leads establishing workflows, or developers wanting to see best practices in a real project context.

---

**Project Status**: ✅ Complete and ready for production deployment
**Maintenance**: Actively maintained with regular updates
**Community**: Open for contributions and educational use
```

#### 13.3 Final Commit dan Tag

```bash
# Add all documentation
git add CHANGELOG.md PROJECT-SUMMARY.md

git commit -m "docs: add comprehensive project documentation

- Add CHANGELOG.md with version history
- Add PROJECT-SUMMARY.md with complete project overview
- Document all features, metrics, and learning outcomes
- Include future enhancement roadmap"

# Push to GitHub
git push origin main

# Create release tag
git tag -a v1.4.0 -m "Day 4 Complete: Version Control & Collaboration

Features:
- Task categorization system
- User profile and preferences
- Team collaboration workflow
- Advanced Git practices
- Comprehensive documentation

This release completes Day 4 of the Software Engineering course,
demonstrating professional version control and team collaboration practices."

# Push tag
git push origin v1.4.0
```

## 🔧 Troubleshooting Common Issues

### Issue 1: Git Authentication Problems

**Error**: `Authentication failed`

**Solutions**:
```bash
# Use Personal Access Token instead of password
# GitHub Settings → Developer settings → Personal access tokens

# Or setup SSH keys
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add to GitHub Settings → SSH and GPG keys
```

### Issue 2: Merge Conflicts in Package Files

**Error**: Conflict in `package-lock.json`

**Solution**:
```bash
# Delete the file and regenerate
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
```

### Issue 3: Tests Failing After Merge

**Error**: Tests pass individually but fail together

**Solutions**:
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests in sequence instead of parallel
npm test -- --runInBand

# Check for test pollution (shared state)
# Add proper beforeEach/afterEach cleanup
```

### Issue 4: Branch Not Showing on GitHub

**Error**: Local branch exists but not on remote

**Solution**:
```bash
# Push branch to remote
git push -u origin branch-name

# Check remote branches
git branch -r

# Fetch latest from remote
git fetch origin
```

### Issue 5: Accidentally Committed Sensitive Data

**Error**: API keys or passwords in commit

**Solutions**:
```bash
# If not pushed yet
git reset --soft HEAD~1
# Remove sensitive data, add to .gitignore
git add .
git commit -m "fix: remove sensitive data"

# If already pushed (DANGER: rewrites history)
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch path/to/sensitive/file' \
--prune-empty --tag-name-filter cat -- --all

git push --force-with-lease origin --all
```

## ✅ Implementation Checklist

Pastikan Anda sudah menyelesaikan semua langkah:

### Git Setup
- [ ] Initialize Git repository
- [ ] Create .gitignore file
- [ ] Make initial commit
- [ ] Connect to GitHub remote
- [ ] Verify repository upload

### Feature Development
- [ ] Create feature branch (task-categories)
- [ ] Implement category functionality in models
- [ ] Add category methods to repositories
- [ ] Update controllers with category management
- [ ] Enhance UI with category features
- [ ] Add comprehensive tests
- [ ] Commit changes with good messages

### Collaboration Workflow
- [ ] Push feature branch to GitHub
- [ ] Create pull request with detailed description
- [ ] Perform code review (self or peer)
- [ ] Address review feedback
- [ ] Merge pull request
- [ ] Clean up branches

### Advanced Git Practices
- [ ] Practice merge conflict resolution
- [ ] Use interactive rebase for clean history
- [ ] Try cherry-pick for selective merging
- [ ] Use git stash for temporary storage
- [ ] Implement Git hooks for automation

### Team Setup
- [ ] Create CONTRIBUTING.md
- [ ] Add CODE_OF_CONDUCT.md
- [ ] Update README.md with team info
- [ ] Create setup script for new members
- [ ] Add comprehensive documentation

### Final Integration
- [ ] Test all features work together
- [ ] Run full test suite with coverage
- [ ] Update CHANGELOG.md
- [ ] Create PROJECT-SUMMARY.md
- [ ] Tag release version
- [ ] Verify GitHub repository is complete

## 🎉 Congratulations!

Anda telah berhasil menyelesaikan Day 4! Sekarang project Anda memiliki:

### ✅ **Professional Version Control**
- Git repository dengan clean history
- Feature branch workflow
- Meaningful commit messages
- Proper branching strategy

### ✅ **Team Collaboration Setup**
- Code review processes
- Team documentation
- Onboarding automation
- Contribution guidelines

### ✅ **Advanced Git Skills**
- Merge conflict resolution
- Interactive rebase
- Cherry-picking
- Stashing dan hooks

### ✅ **Production-Ready Codebase**
- Comprehensive testing
- Clean architecture
- Team-friendly documentation
- Professional standards

**Next Steps**: Day 5 akan fokus pada deployment dan production best practices, di mana Anda akan learn cara deploy aplikasi ini ke production environment dan setup monitoring/maintenance processes.

Great job mastering version control dan team collaboration! 🚀