/**
 * Day 4 Complete Application - Git Workflow & Collaboration
 * 
 * Integrates all collaboration features including:
 * - Multi-user task management
 * - Real-time collaboration
 * - Comment system
 * - Team management
 * - Activity tracking
 * - Notification system
 */

// Import all the collaboration components
const CollaborativeTask = require('./collaborative-task-model');
const TeamUser = require('./team-user-model');
const CollaborationController = require('./collaboration-controller');
const { CollaborationManager } = require('./collaboration-features');

// Import Day 2 components for base functionality
const TaskRepository = require('../day2-requirements-design/task-repository');
const UserRepository = require('../day2-requirements-design/user-repository');
const TaskController = require('../day2-requirements-design/task-controller');
const TaskView = require('../day2-requirements-design/task-view');

/**
 * Day 4 Application Class
 * Orchestrates all collaboration features and integrates with existing components
 */
class Day4CollaborativeApp {
    constructor() {
        // Initialize repositories
        this.taskRepository = new TaskRepository();
        this.userRepository = new UserRepository();
        
        // Initialize collaboration system
        this.collaborationController = new CollaborationController(
            this.taskRepository,
            this.userRepository,
            {
                enableRealTimeUpdates: true,
                enableNotifications: true,
                maxCollaboratorsPerTask: 50
            }
        );
        
        // Initialize UI components
        this.taskController = new TaskController(this.taskRepository, this.userRepository);
        this.taskView = new TaskView();
        
        // Current user (in a real app, this would come from authentication)
        this.currentUser = null;
        
        // UI state
        this.selectedTask = null;
        this.activeView = 'tasks';
        
        // Initialize the application
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Day 4 Collaborative Task Management System...');
        
        // Setup demo data
        await this.setupDemoData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup real-time collaboration
        this.setupRealTimeFeatures();
        
        // Render initial UI
        this.render();
        
        console.log('✅ Application initialized successfully!');
    }
    
    async setupDemoData() {
        console.log('📊 Setting up demo data...');
        
        // Create demo users
        const alice = new TeamUser('alice', 'alice@example.com', {
            displayName: 'Alice Johnson',
            firstName: 'Alice',
            lastName: 'Johnson',
            role: 'admin',
            bio: 'Senior Developer and Team Lead',
            skills: [
                { name: 'javascript', level: 'expert', endorsements: 15 },
                { name: 'react', level: 'advanced', endorsements: 12 },
                { name: 'node.js', level: 'advanced', endorsements: 10 }
            ]
        });
        
        const bob = new TeamUser('bob', 'bob@example.com', {
            displayName: 'Bob Smith',
            firstName: 'Bob',
            lastName: 'Smith',
            role: 'user',
            bio: 'Frontend Developer',
            skills: [
                { name: 'javascript', level: 'intermediate', endorsements: 8 },
                { name: 'css', level: 'advanced', endorsements: 6 },
                { name: 'html', level: 'expert', endorsements: 5 }
            ]
        });
        
        const carol = new TeamUser('carol', 'carol@example.com', {
            displayName: 'Carol Davis',
            firstName: 'Carol',
            lastName: 'Davis',
            role: 'user',
            bio: 'Backend Developer',
            skills: [
                { name: 'python', level: 'expert', endorsements: 20 },
                { name: 'database', level: 'advanced', endorsements: 15 },
                { name: 'api-design', level: 'advanced', endorsements: 12 }
            ]
        });
        
        // Create a team
        const teamId = 'team_dev_001';
        alice.joinTeam(teamId, 'admin');
        bob.joinTeam(teamId, 'member');
        carol.joinTeam(teamId, 'member');
        
        // Save users
        await this.userRepository.create(alice);
        await this.userRepository.create(bob);
        await this.userRepository.create(carol);
        
        // Set current user
        this.currentUser = alice;
        
        // Create demo tasks with collaboration features
        const task1 = new CollaborativeTask(
            'Implement User Authentication',
            'Add secure login and registration system with JWT tokens',
            alice.id,
            {
                priority: 'high',
                category: 'security',
                tags: ['authentication', 'security', 'backend'],
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                estimatedHours: 16,
                visibility: 'team',
                workflowStage: 'in-progress'
            }
        );
        
        // Share with team members
        task1.shareWith(bob.id, { canEdit: true, canComment: true });
        task1.shareWith(carol.id, { canEdit: false, canComment: true });
        task1.assignTo(carol.id, alice.id);
        
        // Add some comments
        task1.addComment('I can help with the JWT implementation. Should we use a specific library?', bob.id);
        task1.addComment('Great! Let\'s use jsonwebtoken for Node.js. @alice what do you think about the database schema?', carol.id);
        task1.addComment('@carol sounds good! I\'ll create the user schema. Can you handle the password hashing?', alice.id);
        
        const task2 = new CollaborativeTask(
            'Design Task Management UI',
            'Create responsive and intuitive user interface for task management',
            bob.id,
            {
                priority: 'medium',
                category: 'frontend',
                tags: ['ui', 'design', 'react'],
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                estimatedHours: 12,
                visibility: 'team',
                workflowStage: 'review'
            }
        );
        
        task2.shareWith(alice.id, { canEdit: true, canComment: true });
        task2.addReviewer(alice.id);
        task2.addComment('I\'ve completed the initial design. Ready for review!', bob.id);
        task2.addComment('Looks great! Just a few minor suggestions on the color scheme.', alice.id);
        
        const task3 = new CollaborativeTask(
            'Setup CI/CD Pipeline',
            'Configure automated testing and deployment pipeline',
            alice.id,
            {
                priority: 'medium',
                category: 'devops',
                tags: ['ci-cd', 'automation', 'testing'],
                estimatedHours: 8,
                visibility: 'public',
                workflowStage: 'todo'
            }
        );
        
        // Save tasks
        await this.taskRepository.create(task1);
        await this.taskRepository.create(task2);
        await this.taskRepository.create(task3);
        
        console.log('✅ Demo data setup complete');
    }
    
    setupEventListeners() {
        // Real-time collaboration events
        this.collaborationController.addEventListener('taskShared', (data) => {
            this.showNotification(`Task "${data.task.title}" was shared with you`, 'info');
            this.refreshTaskList();
        });
        
        this.collaborationController.addEventListener('taskAssigned', (data) => {
            if (data.toUserId === this.currentUser.id) {
                this.showNotification(`You were assigned to task "${data.task.title}"`, 'info');
            }
            this.refreshTaskList();
        });
        
        this.collaborationController.addEventListener('commentAdded', (data) => {
            if (this.selectedTask && this.selectedTask.id === data.taskId) {
                this.refreshTaskDetails();
            }
            this.showNotification('New comment added', 'info');
        });
        
        // UI event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.setupUIEventListeners();
        });
    }
    
    setupUIEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view]')) {
                this.switchView(e.target.dataset.view);
            }
            
            if (e.target.matches('[data-task-id]')) {
                this.selectTask(e.target.dataset.taskId);
            }
            
            if (e.target.matches('.share-task-btn')) {
                this.showShareDialog(e.target.dataset.taskId);
            }
            
            if (e.target.matches('.assign-task-btn')) {
                this.showAssignDialog(e.target.dataset.taskId);
            }
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#comment-form')) {
                e.preventDefault();
                this.handleCommentSubmit(e.target);
            }
            
            if (e.target.matches('#share-form')) {
                e.preventDefault();
                this.handleShareSubmit(e.target);
            }
            
            if (e.target.matches('#assign-form')) {
                e.preventDefault();
                this.handleAssignSubmit(e.target);
            }
        });
    }
    
    setupRealTimeFeatures() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateUserActivity();
        }, 30000); // Update every 30 seconds
        
        // Setup notification polling
        setInterval(() => {
            this.checkNotifications();
        }, 10000); // Check every 10 seconds
    }
    
    async switchView(viewName) {
        this.activeView = viewName;
        await this.render();
    }
    
    async selectTask(taskId) {
        this.selectedTask = await this.taskRepository.findById(taskId);
        await this.renderTaskDetails();
    }
    
    async render() {
        const appContainer = document.getElementById('app') || this.createAppContainer();
        
        appContainer.innerHTML = `
            <div class="collaborative-app">
                <header class="app-header">
                    <h1>🚀 Collaborative Task Manager</h1>
                    <div class="user-info">
                        <span class="user-avatar">${this.currentUser.initials}</span>
                        <span class="user-name">${this.currentUser.displayName}</span>
                        <div class="availability-indicator ${this.currentUser.availability}"></div>
                    </div>
                </header>
                
                <nav class="app-navigation">
                    <button data-view="tasks" class="${this.activeView === 'tasks' ? 'active' : ''}">
                        📋 My Tasks
                    </button>
                    <button data-view="shared" class="${this.activeView === 'shared' ? 'active' : ''}">
                        🤝 Shared Tasks
                    </button>
                    <button data-view="team" class="${this.activeView === 'team' ? 'active' : ''}">
                        👥 Team
                    </button>
                    <button data-view="activity" class="${this.activeView === 'activity' ? 'active' : ''}">
                        📈 Activity
                    </button>
                </nav>
                
                <main class="app-main">
                    <div class="content-area">
                        ${await this.renderActiveView()}
                    </div>
                    <aside class="sidebar">
                        ${await this.renderSidebar()}
                    </aside>
                </main>
                
                <div id="notifications" class="notifications-container"></div>
                <div id="modals" class="modals-container"></div>
            </div>
        `;
        
        // Add CSS if not already present
        this.addStyles();
    }
    
    async renderActiveView() {
        switch (this.activeView) {
            case 'tasks':
                return await this.renderTasksView();
            case 'shared':
                return await this.renderSharedTasksView();
            case 'team':
                return await this.renderTeamView();
            case 'activity':
                return await this.renderActivityView();
            default:
                return await this.renderTasksView();
        }
    }
    
    async renderTasksView() {
        const tasks = await this.taskRepository.findByUserId(this.currentUser.id);
        
        return `
            <div class="tasks-view">
                <div class="view-header">
                    <h2>📋 My Tasks</h2>
                    <button class="btn btn-primary" onclick="app.showCreateTaskDialog()">
                        ➕ Create Task
                    </button>
                </div>
                
                <div class="tasks-grid">
                    ${tasks.map(task => this.renderTaskCard(task)).join('')}
                </div>
            </div>
        `;
    }
    
    async renderSharedTasksView() {
        const result = await this.collaborationController.getSharedTasks(this.currentUser.id);
        const sharedTasks = result.tasks || [];
        
        return `
            <div class="shared-tasks-view">
                <div class="view-header">
                    <h2>🤝 Shared Tasks</h2>
                    <p class="view-description">Tasks shared with you by team members</p>
                </div>
                
                <div class="tasks-grid">
                    ${sharedTasks.map(task => this.renderTaskCard(task, true)).join('')}
                </div>
            </div>
        `;
    }
    
    async renderTeamView() {
        const allUsers = await this.userRepository.findAll();
        const teamMembers = allUsers.filter(user => 
            user.teams.some(teamId => this.currentUser.teams.includes(teamId))
        );
        
        return `
            <div class="team-view">
                <div class="view-header">
                    <h2>👥 Team Members</h2>
                    <p class="view-description">Collaborate with your team</p>
                </div>
                
                <div class="team-grid">
                    ${teamMembers.map(member => this.renderTeamMemberCard(member)).join('')}
                </div>
            </div>
        `;
    }
    
    async renderActivityView() {
        const result = await this.collaborationController.getUserActivity(this.currentUser.id, 20);
        const activities = result.activities || [];
        
        return `
            <div class="activity-view">
                <div class="view-header">
                    <h2>📈 Recent Activity</h2>
                    <p class="view-description">Your collaboration activity</p>
                </div>
                
                <div class="activity-feed">
                    ${activities.map(activity => this.renderActivityItem(activity)).join('')}
                </div>
            </div>
        `;
    }
    
    renderTaskCard(task, isShared = false) {
        const priorityColors = {
            low: '#28a745',
            medium: '#ffc107',
            high: '#fd7e14',
            urgent: '#dc3545'
        };
        
        return `
            <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-priority" style="background-color: ${priorityColors[task.priority]}">
                        ${task.priority}
                    </div>
                </div>
                
                <p class="task-description">${task.description}</p>
                
                <div class="task-meta">
                    <span class="task-category">📁 ${task.category}</span>
                    <span class="task-stage">🔄 ${task.workflowStage}</span>
                    ${task.dueDate ? `<span class="task-due">📅 ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
                
                <div class="task-collaboration">
                    <div class="collaborators">
                        ${task.totalCollaborators > 1 ? `👥 ${task.totalCollaborators} collaborators` : ''}
                        ${task.commentCount > 0 ? `💬 ${task.commentCount} comments` : ''}
                    </div>
                    
                    <div class="task-actions">
                        ${!isShared ? `
                            <button class="btn btn-sm share-task-btn" data-task-id="${task.id}">🔗 Share</button>
                            <button class="btn btn-sm assign-task-btn" data-task-id="${task.id}">👤 Assign</button>
                        ` : ''}
                        <button class="btn btn-sm" onclick="app.selectTask('${task.id}')">👁️ View</button>
                    </div>
                </div>
                
                ${task.tags.length > 0 ? `
                    <div class="task-tags">
                        ${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    renderTeamMemberCard(member) {
        return `
            <div class="team-member-card">
                <div class="member-avatar">${member.initials}</div>
                <div class="member-info">
                    <h3 class="member-name">${member.displayName}</h3>
                    <p class="member-role">${member.role}</p>
                    <p class="member-bio">${member.bio}</p>
                    
                    <div class="member-status">
                        <span class="availability-indicator ${member.availability}"></span>
                        <span class="status-text">${member.availability}</span>
                        ${member.statusMessage ? `<span class="status-message">${member.statusMessage}</span>` : ''}
                    </div>
                    
                    <div class="member-skills">
                        ${member.skills.slice(0, 3).map(skill => 
                            `<span class="skill-tag">${skill.name} (${skill.level})</span>`
                        ).join('')}
                    </div>
                    
                    <div class="member-stats">
                        <span>🏆 Score: ${member.collaborationScore || 0}</span>
                        <span>📅 Joined: ${new Date(member.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderActivityItem(activity) {
        const timeAgo = this.getTimeAgo(new Date(activity.timestamp));
        
        return `
            <div class="activity-item">
                <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
                <div class="activity-content">
                    <p class="activity-description">${this.getActivityDescription(activity)}</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }
    
    async renderSidebar() {
        const notifications = await this.collaborationController.getUserNotifications(this.currentUser.id, 5);
        
        return `
            <div class="sidebar-content">
                <div class="sidebar-section">
                    <h3>🔔 Notifications</h3>
                    <div class="notifications-list">
                        ${notifications.notifications.map(notification => `
                            <div class="notification-item ${notification.isRead ? 'read' : 'unread'}">
                                <p class="notification-title">${notification.title}</p>
                                <p class="notification-message">${notification.message}</p>
                                <span class="notification-time">${this.getTimeAgo(new Date(notification.createdAt))}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <h3>📊 Quick Stats</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-value">${this.currentUser.collaborationStats.tasksCreated || 0}</span>
                            <span class="stat-label">Tasks Created</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.currentUser.collaborationStats.tasksCompleted || 0}</span>
                            <span class="stat-label">Tasks Completed</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.currentUser.collaborationStats.commentsPosted || 0}</span>
                            <span class="stat-label">Comments Posted</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.currentUser.getCollaborationScore()}</span>
                            <span class="stat-label">Collaboration Score</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Event handlers
    async handleCommentSubmit(form) {
        const formData = new FormData(form);
        const taskId = formData.get('taskId');
        const content = formData.get('content');
        
        if (!content.trim()) return;
        
        const result = await this.collaborationController.addComment(
            taskId,
            this.currentUser.id,
            content
        );
        
        if (result.success) {
            form.reset();
            await this.refreshTaskDetails();
            this.showNotification('Comment added successfully', 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }
    
    async handleShareSubmit(form) {
        const formData = new FormData(form);
        const taskId = formData.get('taskId');
        const userId = formData.get('userId');
        const canEdit = formData.get('canEdit') === 'on';
        
        const result = await this.collaborationController.shareTask(
            taskId,
            this.currentUser.id,
            userId,
            { canEdit, canComment: true }
        );
        
        if (result.success) {
            this.closeModal();
            this.showNotification(result.message, 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }
    
    async handleAssignSubmit(form) {
        const formData = new FormData(form);
        const taskId = formData.get('taskId');
        const userId = formData.get('userId');
        
        const result = await this.collaborationController.assignTask(
            taskId,
            this.currentUser.id,
            userId
        );
        
        if (result.success) {
            this.closeModal();
            this.showNotification(result.message, 'success');
        } else {
            this.showNotification(result.message, 'error');
        }
    }
    
    // Utility methods
    createAppContainer() {
        const container = document.createElement('div');
        container.id = 'app';
        document.body.appendChild(container);
        return container;
    }
    
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }
    
    getActivityIcon(type) {
        const icons = {
            task_created: '➕',
            task_completed: '✅',
            task_assigned: '👤',
            task_shared: '🔗',
            comment_added: '💬',
            team_joined: '👥',
            default: '📝'
        };
        return icons[type] || icons.default;
    }
    
    getActivityDescription(activity) {
        // This would be more sophisticated in a real app
        return activity.data.description || `${activity.type} activity`;
    }
    
    async refreshTaskList() {
        await this.render();
    }
    
    async refreshTaskDetails() {
        if (this.selectedTask) {
            await this.renderTaskDetails();
        }
    }
    
    async updateUserActivity() {
        this.currentUser.updateActivity();
        await this.userRepository.update(this.currentUser.id, this.currentUser);
    }
    
    async checkNotifications() {
        // In a real app, this would check for new notifications
        // For demo purposes, we'll just update the sidebar
        const sidebar = document.querySelector('.sidebar-content');
        if (sidebar) {
            sidebar.innerHTML = await this.renderSidebar();
        }
    }
    
    addStyles() {
        if (document.getElementById('day4-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'day4-styles';
        styles.textContent = `
            .collaborative-app {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .app-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 0;
                border-bottom: 2px solid #e9ecef;
                margin-bottom: 20px;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #007bff;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            
            .availability-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid white;
            }
            
            .availability-indicator.available { background: #28a745; }
            .availability-indicator.busy { background: #dc3545; }
            .availability-indicator.away { background: #ffc107; }
            .availability-indicator.offline { background: #6c757d; }
            
            .app-navigation {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .app-navigation button {
                padding: 10px 20px;
                border: 1px solid #dee2e6;
                background: white;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .app-navigation button:hover {
                background: #f8f9fa;
            }
            
            .app-navigation button.active {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
            
            .app-main {
                display: grid;
                grid-template-columns: 1fr 300px;
                gap: 20px;
            }
            
            .tasks-grid, .team-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .task-card, .team-member-card {
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 20px;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.2s;
            }
            
            .task-card:hover, .team-member-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            
            .task-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
            }
            
            .task-priority {
                padding: 4px 8px;
                border-radius: 4px;
                color: white;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .task-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin: 10px 0;
                font-size: 14px;
                color: #6c757d;
            }
            
            .task-collaboration {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
            }
            
            .task-actions {
                display: flex;
                gap: 5px;
            }
            
            .btn {
                padding: 6px 12px;
                border: 1px solid #dee2e6;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            
            .btn:hover {
                background: #f8f9fa;
            }
            
            .btn-primary {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
            
            .btn-sm {
                padding: 4px 8px;
                font-size: 11px;
            }
            
            .task-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 10px;
            }
            
            .tag, .skill-tag {
                background: #e9ecef;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                color: #495057;
            }
            
            .sidebar-content {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
            }
            
            .sidebar-section {
                margin-bottom: 30px;
            }
            
            .sidebar-section h3 {
                margin: 0 0 15px 0;
                font-size: 16px;
            }
            
            .notification-item {
                padding: 10px;
                border-left: 3px solid #007bff;
                background: white;
                margin-bottom: 10px;
                border-radius: 0 4px 4px 0;
            }
            
            .notification-item.unread {
                border-left-color: #dc3545;
                background: #fff5f5;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            
            .stat-item {
                text-align: center;
                padding: 10px;
                background: white;
                border-radius: 4px;
            }
            
            .stat-value {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
            }
            
            .stat-label {
                font-size: 12px;
                color: #6c757d;
            }
            
            .activity-feed {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .activity-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 10px;
                border-bottom: 1px solid #e9ecef;
            }
            
            .activity-icon {
                font-size: 20px;
            }
            
            .activity-time {
                font-size: 12px;
                color: #6c757d;
            }
            
            .notifications-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .notification {
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 15px;
                margin-bottom: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-width: 300px;
            }
            
            .notification-success { border-left: 4px solid #28a745; }
            .notification-error { border-left: 4px solid #dc3545; }
            .notification-info { border-left: 4px solid #007bff; }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #6c757d;
            }
            
            @media (max-width: 768px) {
                .app-main {
                    grid-template-columns: 1fr;
                }
                
                .tasks-grid, .team-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize the application when the DOM is loaded
let app;
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new Day4CollaborativeApp();
        window.app = app; // Make it globally accessible for demo purposes
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Day4CollaborativeApp;
}