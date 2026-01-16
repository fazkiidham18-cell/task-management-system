/**
 * Day 4: Collaboration Features
 * Features to support team collaboration and communication
 */

/**
 * Team Member Management
 */
class TeamMember {
    constructor(id, name, email, role = 'contributor') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role; // 'admin', 'maintainer', 'contributor'
        this.joinedAt = new Date();
        this.lastActive = new Date();
        this.contributions = {
            commits: 0,
            pullRequests: 0,
            reviews: 0,
            issues: 0
        };
        this.preferences = {
            notifications: true,
            emailUpdates: true,
            theme: 'light'
        };
    }

    updateActivity() {
        this.lastActive = new Date();
    }

    incrementContribution(type) {
        if (this.contributions.hasOwnProperty(type)) {
            this.contributions[type]++;
        }
    }

    hasPermission(action) {
        const permissions = {
            admin: ['create', 'read', 'update', 'delete', 'manage_users', 'deploy'],
            maintainer: ['create', 'read', 'update', 'delete', 'review'],
            contributor: ['create', 'read', 'update']
        };

        return permissions[this.role]?.includes(action) || false;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            joinedAt: this.joinedAt.toISOString(),
            lastActive: this.lastActive.toISOString(),
            contributions: this.contributions,
            preferences: this.preferences
        };
    }
}

/**
 * Comment System for Tasks and Code
 */
class Comment {
    constructor(id, authorId, content, parentId = null) {
        this.id = id;
        this.authorId = authorId;
        this.content = content;
        this.parentId = parentId; // For threaded comments
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.reactions = new Map(); // emoji -> count
        this.isResolved = false;
        this.mentions = this.extractMentions(content);
    }

    extractMentions(content) {
        const mentionRegex = /@(\w+)/g;
        const mentions = [];
        let match;
        
        while ((match = mentionRegex.exec(content)) !== null) {
            mentions.push(match[1]);
        }
        
        return mentions;
    }

    addReaction(emoji, userId) {
        const key = `${emoji}:${userId}`;
        if (!this.reactions.has(key)) {
            this.reactions.set(key, { emoji, userId, addedAt: new Date() });
        }
    }

    removeReaction(emoji, userId) {
        const key = `${emoji}:${userId}`;
        this.reactions.delete(key);
    }

    getReactionSummary() {
        const summary = new Map();
        
        for (const [key, reaction] of this.reactions) {
            const emoji = reaction.emoji;
            if (!summary.has(emoji)) {
                summary.set(emoji, { count: 0, users: [] });
            }
            summary.get(emoji).count++;
            summary.get(emoji).users.push(reaction.userId);
        }
        
        return Object.fromEntries(summary);
    }

    update(content) {
        this.content = content;
        this.updatedAt = new Date();
        this.mentions = this.extractMentions(content);
    }

    resolve() {
        this.isResolved = true;
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            authorId: this.authorId,
            content: this.content,
            parentId: this.parentId,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            reactions: this.getReactionSummary(),
            isResolved: this.isResolved,
            mentions: this.mentions
        };
    }
}

/**
 * Activity Feed System
 */
class ActivityFeed {
    constructor() {
        this.activities = [];
        this.subscribers = new Map();
    }

    addActivity(type, userId, data, targetId = null) {
        const activity = {
            id: this.generateId(),
            type, // 'task_created', 'task_completed', 'comment_added', 'pr_opened', etc.
            userId,
            data,
            targetId,
            timestamp: new Date(),
            isRead: false
        };

        this.activities.unshift(activity);
        this.notifySubscribers(activity);
        
        // Keep only last 1000 activities
        if (this.activities.length > 1000) {
            this.activities = this.activities.slice(0, 1000);
        }

        return activity;
    }

    subscribe(userId, callback) {
        if (!this.subscribers.has(userId)) {
            this.subscribers.set(userId, []);
        }
        this.subscribers.get(userId).push(callback);
    }

    unsubscribe(userId, callback) {
        if (this.subscribers.has(userId)) {
            const callbacks = this.subscribers.get(userId);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    notifySubscribers(activity) {
        // Notify all subscribers
        for (const [userId, callbacks] of this.subscribers) {
            callbacks.forEach(callback => {
                try {
                    callback(activity, userId);
                } catch (error) {
                    console.error('Error in activity feed callback:', error);
                }
            });
        }
    }

    getActivitiesForUser(userId, limit = 50, offset = 0) {
        // Get activities relevant to the user
        const relevantActivities = this.activities.filter(activity => {
            return activity.userId === userId || 
                   activity.data.mentions?.includes(userId) ||
                   activity.data.assignees?.includes(userId);
        });

        return relevantActivities.slice(offset, offset + limit);
    }

    getTeamActivities(limit = 50, offset = 0) {
        return this.activities.slice(offset, offset + limit);
    }

    markAsRead(activityId, userId) {
        const activity = this.activities.find(a => a.id === activityId);
        if (activity) {
            if (!activity.readBy) {
                activity.readBy = [];
            }
            if (!activity.readBy.includes(userId)) {
                activity.readBy.push(userId);
            }
        }
    }

    generateId() {
        return 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

/**
 * Notification System
 */
class NotificationSystem {
    constructor(activityFeed) {
        this.activityFeed = activityFeed;
        this.notifications = new Map(); // userId -> notifications[]
        this.preferences = new Map(); // userId -> preferences
        
        // Subscribe to activity feed
        this.activityFeed.subscribe('system', (activity) => {
            this.processActivity(activity);
        });
    }

    processActivity(activity) {
        // Determine who should be notified
        const recipients = this.getNotificationRecipients(activity);
        
        recipients.forEach(userId => {
            this.createNotification(userId, activity);
        });
    }

    getNotificationRecipients(activity) {
        const recipients = new Set();
        
        // Add mentioned users
        if (activity.data.mentions) {
            activity.data.mentions.forEach(userId => recipients.add(userId));
        }
        
        // Add assignees
        if (activity.data.assignees) {
            activity.data.assignees.forEach(userId => recipients.add(userId));
        }
        
        // Add task owner for task-related activities
        if (activity.data.taskOwnerId && activity.type.startsWith('task_')) {
            recipients.add(activity.data.taskOwnerId);
        }
        
        // Add PR author for PR-related activities
        if (activity.data.prAuthorId && activity.type.startsWith('pr_')) {
            recipients.add(activity.data.prAuthorId);
        }
        
        // Don't notify the person who performed the action
        recipients.delete(activity.userId);
        
        return Array.from(recipients);
    }

    createNotification(userId, activity) {
        if (!this.notifications.has(userId)) {
            this.notifications.set(userId, []);
        }
        
        const userPrefs = this.preferences.get(userId) || { notifications: true };
        if (!userPrefs.notifications) {
            return;
        }
        
        const notification = {
            id: this.generateId(),
            userId,
            activityId: activity.id,
            type: activity.type,
            title: this.generateNotificationTitle(activity),
            message: this.generateNotificationMessage(activity),
            isRead: false,
            createdAt: new Date(),
            data: activity.data
        };
        
        this.notifications.get(userId).unshift(notification);
        
        // Keep only last 100 notifications per user
        const userNotifications = this.notifications.get(userId);
        if (userNotifications.length > 100) {
            this.notifications.set(userId, userNotifications.slice(0, 100));
        }
        
        // Send real-time notification if supported
        this.sendRealTimeNotification(userId, notification);
    }

    generateNotificationTitle(activity) {
        const titles = {
            task_created: 'New Task Created',
            task_completed: 'Task Completed',
            task_assigned: 'Task Assigned to You',
            comment_added: 'New Comment',
            pr_opened: 'Pull Request Opened',
            pr_reviewed: 'Pull Request Reviewed',
            mention: 'You were mentioned'
        };
        
        return titles[activity.type] || 'New Activity';
    }

    generateNotificationMessage(activity) {
        const messages = {
            task_created: `${activity.data.authorName} created task "${activity.data.taskTitle}"`,
            task_completed: `${activity.data.authorName} completed task "${activity.data.taskTitle}"`,
            task_assigned: `${activity.data.authorName} assigned you to task "${activity.data.taskTitle}"`,
            comment_added: `${activity.data.authorName} commented on "${activity.data.targetTitle}"`,
            pr_opened: `${activity.data.authorName} opened pull request "${activity.data.prTitle}"`,
            pr_reviewed: `${activity.data.authorName} reviewed your pull request "${activity.data.prTitle}"`,
            mention: `${activity.data.authorName} mentioned you in a ${activity.data.context}`
        };
        
        return messages[activity.type] || 'New activity occurred';
    }

    sendRealTimeNotification(userId, notification) {
        // This would integrate with WebSocket, Server-Sent Events, or push notifications
        // For now, we'll just emit a custom event
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('notification', {
                detail: { userId, notification }
            }));
        }
    }

    getNotifications(userId, limit = 20, offset = 0) {
        const userNotifications = this.notifications.get(userId) || [];
        return userNotifications.slice(offset, offset + limit);
    }

    getUnreadCount(userId) {
        const userNotifications = this.notifications.get(userId) || [];
        return userNotifications.filter(n => !n.isRead).length;
    }

    markAsRead(userId, notificationId) {
        const userNotifications = this.notifications.get(userId) || [];
        const notification = userNotifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
        }
    }

    markAllAsRead(userId) {
        const userNotifications = this.notifications.get(userId) || [];
        userNotifications.forEach(n => n.isRead = true);
    }

    setPreferences(userId, preferences) {
        this.preferences.set(userId, { ...this.preferences.get(userId), ...preferences });
    }

    generateId() {
        return 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

/**
 * Code Review System
 */
class CodeReview {
    constructor(id, pullRequestId, reviewerId) {
        this.id = id;
        this.pullRequestId = pullRequestId;
        this.reviewerId = reviewerId;
        this.status = 'pending'; // 'pending', 'approved', 'changes_requested', 'commented'
        this.comments = [];
        this.overallComment = '';
        this.createdAt = new Date();
        this.submittedAt = null;
    }

    addComment(lineNumber, filePath, content, type = 'comment') {
        const comment = {
            id: this.generateId(),
            lineNumber,
            filePath,
            content,
            type, // 'comment', 'suggestion', 'issue'
            createdAt: new Date(),
            isResolved: false
        };
        
        this.comments.push(comment);
        return comment;
    }

    submit(status, overallComment = '') {
        this.status = status;
        this.overallComment = overallComment;
        this.submittedAt = new Date();
    }

    resolveComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.isResolved = true;
        }
    }

    getUnresolvedComments() {
        return this.comments.filter(c => !c.isResolved);
    }

    generateId() {
        return 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    toJSON() {
        return {
            id: this.id,
            pullRequestId: this.pullRequestId,
            reviewerId: this.reviewerId,
            status: this.status,
            comments: this.comments,
            overallComment: this.overallComment,
            createdAt: this.createdAt.toISOString(),
            submittedAt: this.submittedAt ? this.submittedAt.toISOString() : null
        };
    }
}

/**
 * Collaboration Manager - Orchestrates all collaboration features
 */
class CollaborationManager {
    constructor() {
        this.teamMembers = new Map();
        this.activityFeed = new ActivityFeed();
        this.notificationSystem = new NotificationSystem(this.activityFeed);
        this.comments = new Map();
        this.reviews = new Map();
    }

    // Team Management
    addTeamMember(memberData) {
        const member = new TeamMember(
            memberData.id,
            memberData.name,
            memberData.email,
            memberData.role
        );
        
        this.teamMembers.set(member.id, member);
        
        this.activityFeed.addActivity('member_joined', 'system', {
            memberName: member.name,
            memberRole: member.role
        });
        
        return member;
    }

    getTeamMember(memberId) {
        return this.teamMembers.get(memberId);
    }

    getAllTeamMembers() {
        return Array.from(this.teamMembers.values());
    }

    updateMemberRole(memberId, newRole) {
        const member = this.teamMembers.get(memberId);
        if (member) {
            const oldRole = member.role;
            member.role = newRole;
            
            this.activityFeed.addActivity('role_changed', 'system', {
                memberName: member.name,
                oldRole,
                newRole
            });
        }
    }

    // Comment Management
    addComment(targetType, targetId, authorId, content, parentId = null) {
        const commentId = this.generateId();
        const comment = new Comment(commentId, authorId, content, parentId);
        
        this.comments.set(commentId, comment);
        
        const author = this.teamMembers.get(authorId);
        this.activityFeed.addActivity('comment_added', authorId, {
            authorName: author?.name || 'Unknown',
            targetType,
            targetId,
            commentId,
            mentions: comment.mentions
        });
        
        return comment;
    }

    getComments(targetType, targetId) {
        return Array.from(this.comments.values())
            .filter(comment => comment.targetType === targetType && comment.targetId === targetId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // Activity and Notifications
    recordActivity(type, userId, data) {
        return this.activityFeed.addActivity(type, userId, data);
    }

    getUserNotifications(userId, limit = 20) {
        return this.notificationSystem.getNotifications(userId, limit);
    }

    getUnreadNotificationCount(userId) {
        return this.notificationSystem.getUnreadCount(userId);
    }

    // Code Review
    createReview(pullRequestId, reviewerId) {
        const reviewId = this.generateId();
        const review = new CodeReview(reviewId, pullRequestId, reviewerId);
        
        this.reviews.set(reviewId, review);
        return review;
    }

    submitReview(reviewId, status, overallComment) {
        const review = this.reviews.get(reviewId);
        if (review) {
            review.submit(status, overallComment);
            
            const reviewer = this.teamMembers.get(review.reviewerId);
            this.activityFeed.addActivity('review_submitted', review.reviewerId, {
                reviewerName: reviewer?.name || 'Unknown',
                pullRequestId: review.pullRequestId,
                status,
                commentCount: review.comments.length
            });
        }
    }

    // Utility
    generateId() {
        return 'collab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Statistics
    getCollaborationStats() {
        const members = this.getAllTeamMembers();
        const totalComments = this.comments.size;
        const totalReviews = this.reviews.size;
        const recentActivities = this.activityFeed.getTeamActivities(10);
        
        return {
            teamSize: members.length,
            totalComments,
            totalReviews,
            recentActivities: recentActivities.length,
            activeMembers: members.filter(m => {
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return new Date(m.lastActive) > dayAgo;
            }).length
        };
    }
}

// Example usage and integration:
/*
// Initialize collaboration system
const collaboration = new CollaborationManager();

// Add team members
const alice = collaboration.addTeamMember({
    id: 'alice123',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'maintainer'
});

const bob = collaboration.addTeamMember({
    id: 'bob456',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'contributor'
});

// Record activities
collaboration.recordActivity('task_created', 'alice123', {
    authorName: 'Alice Johnson',
    taskTitle: 'Implement user authentication',
    taskId: 'task_001'
});

// Add comments
const comment = collaboration.addComment('task', 'task_001', 'bob456', 
    'Great idea! @alice123 should we also add password reset functionality?');

// Create code review
const review = collaboration.createReview('pr_001', 'alice123');
review.addComment(42, 'src/auth.js', 'Consider using bcrypt for password hashing', 'suggestion');
collaboration.submitReview(review.id, 'changes_requested', 'Overall good work, just a few security concerns');

// Get notifications
const notifications = collaboration.getUserNotifications('alice123');
console.log('Alice has', notifications.length, 'notifications');

// Get collaboration stats
const stats = collaboration.getCollaborationStats();
console.log('Team collaboration stats:', stats);
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TeamMember,
        Comment,
        ActivityFeed,
        NotificationSystem,
        CodeReview,
        CollaborationManager
    };
}