/**
 * Collaboration Controller - Day 4 Implementation
 * 
 * Orchestrates all collaboration features including task sharing,
 * team management, comments, notifications, and activity tracking.
 * 
 * Demonstrates:
 * - Centralized collaboration management
 * - Integration between different collaboration systems
 * - Permission-based access control
 * - Real-time collaboration features
 * - Activity tracking and notifications
 */

const CollaborativeTask = require('./collaborative-task-model');
const TeamUser = require('./team-user-model');
const { CollaborationManager } = require('./collaboration-features');

class CollaborationController {
    constructor(taskRepository, userRepository, options = {}) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        
        // Initialize collaboration manager
        this.collaborationManager = new CollaborationManager();
        
        // Configuration
        this.config = {
            maxCollaboratorsPerTask: options.maxCollaboratorsPerTask || 50,
            maxCommentsPerTask: options.maxCommentsPerTask || 1000,
            enableRealTimeUpdates: options.enableRealTimeUpdates !== false,
            enableNotifications: options.enableNotifications !== false,
            ...options
        };
        
        // Event handlers for real-time updates
        this.eventHandlers = new Map();
        
        // Initialize event listeners
        this._setupEventListeners();
    }
    
    // Task sharing methods
    async shareTask(taskId, fromUserId, toUserId, permissions = {}) {
        try {
            // Validate inputs
            if (!taskId || !fromUserId || !toUserId) {
                throw new Error('Task ID, from user ID, and to user ID are required');
            }
            
            // Get task and users
            const task = await this.taskRepository.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            
            const fromUser = await this.userRepository.findById(fromUserId);
            const toUser = await this.userRepository.findById(toUserId);
            
            if (!fromUser || !toUser) {
                throw new Error('User not found');
            }
            
            // Check permissions
            if (!task.canShare(fromUserId)) {
                throw new Error('You do not have permission to share this task');
            }
            
            // Share the task
            task.shareWith(toUserId, {
                ...permissions,
                sharedBy: fromUserId
            });
            
            // Update task in repository
            await this.taskRepository.update(taskId, task);
            
            // Record activity
            this.collaborationManager.recordActivity('task_shared', fromUserId, {
                taskId: taskId,
                taskTitle: task.title,
                sharedWithUserId: toUserId,
                sharedWithUsername: toUser.username,
                sharerUsername: fromUser.username
            });
            
            // Update user collaboration stats
            fromUser.updateCollaborationStats('tasksShared');
            await this.userRepository.update(fromUserId, fromUser);
            
            // Send notification
            if (this.config.enableNotifications) {
                await this._sendNotification(toUserId, 'task_shared', {
                    taskId: taskId,
                    taskTitle: task.title,
                    sharerName: fromUser.displayName,
                    sharerId: fromUserId
                });
            }
            
            // Emit real-time event
            this._emitEvent('taskShared', {
                taskId,
                fromUserId,
                toUserId,
                task: task.toJSON()
            });
            
            return {
                success: true,
                message: `Task "${task.title}" shared with ${toUser.displayName}`,
                task: task.toJSON()
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    async unshareTask(taskId, fromUserId, withUserId) {
        try {
            const task = await this.taskRepository.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            
            if (!task.canShare(fromUserId)) {
                throw new Error('You do not have permission to unshare this task');
            }
            
            task.unshareWith(withUserId);
            await this.taskRepository.update(taskId, task);
            
            // Record activity
            this.collaborationManager.recordActivity('task_unshared', fromUserId, {
                taskId: taskId,
                taskTitle: task.title,
                unsharedWithUserId: withUserId
            });
            
            // Emit real-time event
            this._emitEvent('taskUnshared', {
                taskId,
                fromUserId,
                withUserId
            });
            
            return {
                success: true,
                message: 'Task unshared successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Task assignment methods
    async assignTask(taskId, fromUserId, toUserId) {
        try {
            const task = await this.taskRepository.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            
            const fromUser = await this.userRepository.findById(fromUserId);
            const toUser = await this.userRepository.findById(toUserId);
            
            if (!fromUser || !toUser) {
                throw new Error('User not found');
            }
            
            if (!task.canEdit(fromUserId)) {
                throw new Error('You do not have permission to assign this task');
            }
            
            // Assign the task
            task.assignTo(toUserId, fromUserId);
            await this.taskRepository.update(taskId, task);
            
            // Record activity
            this.collaborationManager.recordActivity('task_assigned', fromUserId, {
                taskId: taskId,
                taskTitle: task.title,
                assignedToUserId: toUserId,
                assignedToUsername: toUser.username,
                assignerUsername: fromUser.username
            });
            
            // Update user stats
            fromUser.updateCollaborationStats('tasksAssigned');
            await this.userRepository.update(fromUserId, fromUser);
            
            // Send notification
            if (this.config.enableNotifications) {
                await this._sendNotification(toUserId, 'task_assigned', {
                    taskId: taskId,
                    taskTitle: task.title,
                    assignerName: fromUser.displayName,
                    assignerId: fromUserId
                });
            }
            
            // Emit real-time event
            this._emitEvent('taskAssigned', {
                taskId,
                fromUserId,
                toUserId,
                task: task.toJSON()
            });
            
            return {
                success: true,
                message: `Task "${task.title}" assigned to ${toUser.displayName}`,
                task: task.toJSON()
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Comment methods
    async addComment(taskId, userId, content, options = {}) {
        try {
            const task = await this.taskRepository.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            if (!task.canComment(userId)) {
                throw new Error('You do not have permission to comment on this task');
            }
            
            // Add comment to task
            const comment = task.addComment(content, userId, options);
            await this.taskRepository.update(taskId, task);
            
            // Record activity
            this.collaborationManager.recordActivity('comment_added', userId, {
                taskId: taskId,
                taskTitle: task.title,
                commentId: comment.id,
                authorUsername: user.username,
                mentions: comment.mentions
            });
            
            // Update user stats
            user.updateCollaborationStats('commentsPosted');
            await this.userRepository.update(userId, user);
            
            // Send notifications to watchers and mentioned users
            if (this.config.enableNotifications) {
                const notificationRecipients = new Set([
                    ...task.watchers,
                    ...comment.mentions
                ]);
                
                // Remove the comment author from notifications
                notificationRecipients.delete(userId);
                
                for (const recipientId of notificationRecipients) {
                    await this._sendNotification(recipientId, 'comment_added', {
                        taskId: taskId,
                        taskTitle: task.title,
                        commentId: comment.id,
                        authorName: user.displayName,
                        authorId: userId,
                        content: content.substring(0, 100) + (content.length > 100 ? '...' : '')
                    });
                }
            }
            
            // Emit real-time event
            this._emitEvent('commentAdded', {
                taskId,
                comment: comment,
                task: task.toJSON()
            });
            
            return {
                success: true,
                comment: comment,
                task: task.toJSON()
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    async updateComment(taskId, commentId, userId, content) {
        try {
            const task = await this.taskRepository.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            
            const comment = task.updateComment(commentId, content, userId);
            await this.taskRepository.update(taskId, task);
            
            // Record activity
            this.collaborationManager.recordActivity('comment_updated', userId, {
                taskId: taskId,
                commentId: commentId
            });
            
            // Emit real-time event
            this._emitEvent('commentUpdated', {
                taskId,
                commentId,
                comment: comment
            });
            
            return {
                success: true,
                comment: comment
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    async deleteComment(taskId, commentId, userId) {
        try {
            const task = await this.taskRepository.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            
            task.deleteComment(commentId, userId);
            await this.taskRepository.update(taskId, task);
            
            // Record activity
            this.collaborationManager.recordActivity('comment_deleted', userId, {
                taskId: taskId,
                commentId: commentId
            });
            
            // Emit real-time event
            this._emitEvent('commentDeleted', {
                taskId,
                commentId
            });
            
            return {
                success: true,
                message: 'Comment deleted successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Team management methods
    async createTeam(creatorId, teamData) {
        try {
            const creator = await this.userRepository.findById(creatorId);
            if (!creator) {
                throw new Error('Creator not found');
            }
            
            const team = {
                id: this._generateId(),
                name: teamData.name,
                description: teamData.description || '',
                creatorId: creatorId,
                members: [creatorId],
                roles: {
                    [creatorId]: 'admin'
                },
                settings: teamData.settings || {},
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Add creator to team
            creator.joinTeam(team.id, 'admin');
            await this.userRepository.update(creatorId, creator);
            
            // Record activity
            this.collaborationManager.recordActivity('team_created', creatorId, {
                teamId: team.id,
                teamName: team.name
            });
            
            return {
                success: true,
                team: team
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    async inviteToTeam(teamId, inviterId, inviteeId, role = 'member') {
        try {
            const inviter = await this.userRepository.findById(inviterId);
            const invitee = await this.userRepository.findById(inviteeId);
            
            if (!inviter || !invitee) {
                throw new Error('User not found');
            }
            
            // Check if inviter has permission to invite
            if (!inviter.hasTeamPermission(teamId, 'manage_team')) {
                throw new Error('You do not have permission to invite users to this team');
            }
            
            // Add invitee to team
            invitee.joinTeam(teamId, role);
            await this.userRepository.update(inviteeId, invitee);
            
            // Record activity
            this.collaborationManager.recordActivity('team_invitation_sent', inviterId, {
                teamId: teamId,
                inviteeId: inviteeId,
                inviteeName: invitee.displayName,
                role: role
            });
            
            // Send notification
            if (this.config.enableNotifications) {
                await this._sendNotification(inviteeId, 'team_invitation', {
                    teamId: teamId,
                    inviterName: inviter.displayName,
                    inviterId: inviterId,
                    role: role
                });
            }
            
            return {
                success: true,
                message: `${invitee.displayName} has been invited to the team`
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Activity and notification methods
    async getUserActivity(userId, limit = 20, offset = 0) {
        try {
            const activities = this.collaborationManager.activityFeed.getActivitiesForUser(userId, limit, offset);
            
            return {
                success: true,
                activities: activities,
                hasMore: activities.length === limit
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message,
                activities: []
            };
        }
    }
    
    async getTeamActivity(limit = 50, offset = 0) {
        try {
            const activities = this.collaborationManager.activityFeed.getTeamActivities(limit, offset);
            
            return {
                success: true,
                activities: activities,
                hasMore: activities.length === limit
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message,
                activities: []
            };
        }
    }
    
    async getUserNotifications(userId, limit = 20) {
        try {
            const notifications = this.collaborationManager.getUserNotifications(userId, limit);
            const unreadCount = this.collaborationManager.getUnreadNotificationCount(userId);
            
            return {
                success: true,
                notifications: notifications,
                unreadCount: unreadCount
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message,
                notifications: [],
                unreadCount: 0
            };
        }
    }
    
    async markNotificationAsRead(userId, notificationId) {
        try {
            this.collaborationManager.notificationSystem.markAsRead(userId, notificationId);
            
            return {
                success: true,
                message: 'Notification marked as read'
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Search and discovery methods
    async searchCollaborators(query, currentUserId, options = {}) {
        try {
            const allUsers = await this.userRepository.findAll();
            const currentUser = await this.userRepository.findById(currentUserId);
            
            if (!currentUser) {
                throw new Error('Current user not found');
            }
            
            // Filter users based on query and team membership
            const collaborators = allUsers.filter(user => {
                if (user.id === currentUserId) return false;
                
                const matchesQuery = !query || 
                    user.username.toLowerCase().includes(query.toLowerCase()) ||
                    user.displayName.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase());
                
                // If team filter is specified, only show team members
                if (options.teamId) {
                    return matchesQuery && user.teams.includes(options.teamId);
                }
                
                return matchesQuery;
            });
            
            // Sort by collaboration score and availability
            collaborators.sort((a, b) => {
                if (a.isAvailable && !b.isAvailable) return -1;
                if (!a.isAvailable && b.isAvailable) return 1;
                return b.getCollaborationScore() - a.getCollaborationScore();
            });
            
            return {
                success: true,
                collaborators: collaborators.slice(0, options.limit || 20).map(user => user.toTeamJSON())
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message,
                collaborators: []
            };
        }
    }
    
    async getCollaborationStats(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            
            const stats = this.collaborationManager.getCollaborationStats();
            const userStats = user.collaborationStats;
            
            return {
                success: true,
                userStats: userStats,
                teamStats: stats,
                collaborationScore: user.getCollaborationScore()
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // Real-time event methods
    addEventListener(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }
    
    removeEventListener(event, handler) {
        if (this.eventHandlers.has(event)) {
            const handlers = this.eventHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    // Private helper methods
    _emitEvent(event, data) {
        if (this.config.enableRealTimeUpdates && this.eventHandlers.has(event)) {
            const handlers = this.eventHandlers.get(event);
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error('Error in event handler:', error);
                }
            });
        }
    }
    
    async _sendNotification(userId, type, data) {
        // This would integrate with the notification system
        // For now, we'll just record it in the collaboration manager
        this.collaborationManager.recordActivity(type, 'system', {
            ...data,
            recipientId: userId
        });
    }
    
    _setupEventListeners() {
        // Set up internal event listeners for cross-system integration
        this.collaborationManager.activityFeed.subscribe('controller', (activity) => {
            this._emitEvent('activityCreated', activity);
        });
    }
    
    _generateId() {
        return 'collab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Utility methods
    async getTaskCollaborators(taskId) {
        try {
            const task = await this.taskRepository.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            
            const collaboratorIds = new Set([
                task.creatorId,
                task.assignedTo,
                ...task.collaborators,
                ...task.sharedWith,
                ...task.watchers
            ]);
            
            const collaborators = [];
            for (const userId of collaboratorIds) {
                const user = await this.userRepository.findById(userId);
                if (user) {
                    collaborators.push(user.toTeamJSON());
                }
            }
            
            return {
                success: true,
                collaborators: collaborators
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message,
                collaborators: []
            };
        }
    }
    
    async getSharedTasks(userId) {
        try {
            const allTasks = await this.taskRepository.findAll();
            const sharedTasks = allTasks.filter(task => task.canAccess(userId));
            
            return {
                success: true,
                tasks: sharedTasks.map(task => task.toJSON())
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message,
                tasks: []
            };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollaborationController;
} else {
    window.CollaborationController = CollaborationController;
}