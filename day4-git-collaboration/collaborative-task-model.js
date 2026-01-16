/**
 * Collaborative Task Model - Day 4 Implementation
 * 
 * Extends the Day 2 Enhanced Task Model with collaboration features
 * including sharing, assignment, comments, and team workflows.
 * 
 * Demonstrates:
 * - Task sharing and permission management
 * - Multi-user assignment and collaboration
 * - Comment threads and discussions
 * - Activity tracking and notifications
 * - Team workflow integration
 * - Real-time collaboration features
 */

// Import the base Task model from Day 2
const Task = require('../day2-requirements-design/enhanced-task-model');

class CollaborativeTask extends Task {
    constructor(title, description, userId, options = {}) {
        // Call parent constructor
        super(title, description, userId, options);
        
        // Collaboration-specific properties
        this._creatorId = userId; // Original creator (immutable)
        this._collaborators = this._validateCollaborators(options.collaborators || []);
        this._sharedWith = this._validateSharedWith(options.sharedWith || []);
        this._visibility = this._validateVisibility(options.visibility || 'private');
        this._permissions = this._validatePermissions(options.permissions || {});
        
        // Comment and discussion properties
        this._comments = options.comments || [];
        this._commentCount = options.commentCount || 0;
        this._lastCommentAt = options.lastCommentAt ? new Date(options.lastCommentAt) : null;
        
        // Activity and notification properties
        this._watchers = this._validateWatchers(options.watchers || [userId]);
        this._mentions = options.mentions || [];
        this._lastActivityAt = options.lastActivityAt ? new Date(options.lastActivityAt) : new Date();
        
        // Team workflow properties
        this._workflowStage = options.workflowStage || 'backlog';
        this._reviewers = options.reviewers || [];
        this._approvals = options.approvals || [];
        this._blockedBy = options.blockedBy || [];
        this._blocking = options.blocking || [];
        
        // Collaboration metadata
        this._shareHistory = options.shareHistory || [];
        this._assignmentHistory = options.assignmentHistory || [];
        this._collaborationMetrics = options.collaborationMetrics || {
            totalCollaborators: 0,
            totalComments: 0,
            totalShares: 0,
            totalAssignments: 0
        };
    }
    
    // Collaboration properties (read-only)
    get creatorId() { return this._creatorId; }
    get collaborators() { return [...this._collaborators]; }
    get sharedWith() { return [...this._sharedWith]; }
    get visibility() { return this._visibility; }
    get permissions() { return { ...this._permissions }; }
    
    // Comment properties
    get comments() { return [...this._comments]; }
    get commentCount() { return this._commentCount; }
    get lastCommentAt() { return this._lastCommentAt ? new Date(this._lastCommentAt) : null; }
    
    // Activity properties
    get watchers() { return [...this._watchers]; }
    get mentions() { return [...this._mentions]; }
    get lastActivityAt() { return new Date(this._lastActivityAt); }
    
    // Workflow properties
    get workflowStage() { return this._workflowStage; }
    get reviewers() { return [...this._reviewers]; }
    get approvals() { return [...this._approvals]; }
    get blockedBy() { return [...this._blockedBy]; }
    get blocking() { return [...this._blocking]; }
    
    // History and metrics
    get shareHistory() { return [...this._shareHistory]; }
    get assignmentHistory() { return [...this._assignmentHistory]; }
    get collaborationMetrics() { return { ...this._collaborationMetrics }; }
    
    // Computed collaboration properties
    get isShared() {
        return this._visibility !== 'private' || this._sharedWith.length > 0;
    }
    
    get totalCollaborators() {
        const allUsers = new Set([
            this._creatorId,
            this._assignedTo,
            ...this._collaborators,
            ...this._sharedWith,
            ...this._watchers
        ]);
        return allUsers.size;
    }
    
    get isBlocked() {
        return this._blockedBy.length > 0;
    }
    
    get hasApprovals() {
        return this._approvals.length > 0;
    }
    
    get needsReview() {
        return this._reviewers.length > 0 && this._approvals.length === 0;
    }
    
    // Permission checking methods
    canAccess(userId) {
        if (!userId) return false;
        
        // Creator always has access
        if (userId === this._creatorId) return true;
        
        // Assigned user has access
        if (userId === this._assignedTo) return true;
        
        // Collaborators have access
        if (this._collaborators.includes(userId)) return true;
        
        // Shared users have access
        if (this._sharedWith.includes(userId)) return true;
        
        // Public tasks are accessible to all
        if (this._visibility === 'public') return true;
        
        // Team visibility (would need team context)
        if (this._visibility === 'team') {
            // In a real app, you'd check if user is in the same team
            return true; // Simplified for demo
        }
        
        return false;
    }
    
    canEdit(userId) {
        if (!this.canAccess(userId)) return false;
        
        // Creator can always edit
        if (userId === this._creatorId) return true;
        
        // Assigned user can edit
        if (userId === this._assignedTo) return true;
        
        // Check specific permissions
        const userPermissions = this._permissions[userId] || {};
        return userPermissions.canEdit === true;
    }
    
    canComment(userId) {
        if (!this.canAccess(userId)) return false;
        
        // Most users who can access can also comment
        const userPermissions = this._permissions[userId] || {};
        return userPermissions.canComment !== false; // Default to true
    }
    
    canShare(userId) {
        if (!this.canAccess(userId)) return false;
        
        // Creator can always share
        if (userId === this._creatorId) return true;
        
        // Check specific permissions
        const userPermissions = this._permissions[userId] || {};
        return userPermissions.canShare === true;
    }
    
    // Sharing methods
    shareWith(userId, permissions = {}) {
        if (!userId || typeof userId !== 'string') {
            throw new Error('Valid user ID is required for sharing');
        }
        
        if (userId === this._creatorId) {
            throw new Error('Cannot share task with creator');
        }
        
        if (!this._sharedWith.includes(userId)) {
            this._sharedWith.push(userId);
            this._permissions[userId] = {
                canView: true,
                canEdit: permissions.canEdit || false,
                canComment: permissions.canComment !== false,
                canShare: permissions.canShare || false,
                sharedAt: new Date(),
                sharedBy: permissions.sharedBy || null
            };
            
            this._recordShareActivity(userId, permissions.sharedBy);
            this._touch();
        }
        
        return this;
    }
    
    unshareWith(userId) {
        const index = this._sharedWith.indexOf(userId);
        if (index > -1) {
            this._sharedWith.splice(index, 1);
            delete this._permissions[userId];
            this._touch();
        }
        return this;
    }
    
    setVisibility(visibility) {
        this._visibility = this._validateVisibility(visibility);
        this._touch();
        return this;
    }
    
    // Collaboration methods
    addCollaborator(userId, role = 'contributor') {
        if (!userId || typeof userId !== 'string') {
            throw new Error('Valid user ID is required');
        }
        
        if (!this._collaborators.includes(userId)) {
            this._collaborators.push(userId);
            this._permissions[userId] = {
                canView: true,
                canEdit: role === 'editor' || role === 'owner',
                canComment: true,
                canShare: role === 'owner',
                role: role,
                addedAt: new Date()
            };
            
            this._collaborationMetrics.totalCollaborators++;
            this._touch();
        }
        
        return this;
    }
    
    removeCollaborator(userId) {
        const index = this._collaborators.indexOf(userId);
        if (index > -1) {
            this._collaborators.splice(index, 1);
            delete this._permissions[userId];
            this._touch();
        }
        return this;
    }
    
    // Assignment methods (enhanced from parent)
    assignTo(userId, assignedBy = null) {
        // Call parent method
        super.assignTo(userId);
        
        // Record assignment history
        this._recordAssignmentActivity(userId, assignedBy);
        
        // Add to watchers if not already watching
        if (!this._watchers.includes(userId)) {
            this._watchers.push(userId);
        }
        
        return this;
    }
    
    // Comment methods
    addComment(content, authorId, options = {}) {
        if (!content || typeof content !== 'string') {
            throw new Error('Comment content is required');
        }
        
        if (!this.canComment(authorId)) {
            throw new Error('User does not have permission to comment');
        }
        
        const comment = {
            id: this._generateId(),
            content: content.trim(),
            authorId: authorId,
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: options.parentId || null,
            mentions: this._extractMentions(content),
            reactions: {},
            isResolved: false,
            isEdited: false
        };
        
        this._comments.push(comment);
        this._commentCount++;
        this._lastCommentAt = new Date();
        
        // Add mentioned users to watchers
        comment.mentions.forEach(mentionedUserId => {
            if (!this._watchers.includes(mentionedUserId)) {
                this._watchers.push(mentionedUserId);
            }
        });
        
        this._collaborationMetrics.totalComments++;
        this._touch();
        
        return comment;
    }
    
    updateComment(commentId, content, userId) {
        const comment = this._comments.find(c => c.id === commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }
        
        if (comment.authorId !== userId) {
            throw new Error('Only comment author can edit comment');
        }
        
        comment.content = content.trim();
        comment.updatedAt = new Date();
        comment.isEdited = true;
        comment.mentions = this._extractMentions(content);
        
        this._touch();
        return comment;
    }
    
    deleteComment(commentId, userId) {
        const commentIndex = this._comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) {
            throw new Error('Comment not found');
        }
        
        const comment = this._comments[commentIndex];
        if (comment.authorId !== userId && userId !== this._creatorId) {
            throw new Error('Only comment author or task creator can delete comment');
        }
        
        this._comments.splice(commentIndex, 1);
        this._commentCount--;
        this._touch();
        
        return true;
    }
    
    resolveComment(commentId, userId) {
        const comment = this._comments.find(c => c.id === commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }
        
        if (!this.canEdit(userId)) {
            throw new Error('User does not have permission to resolve comments');
        }
        
        comment.isResolved = true;
        this._touch();
        return comment;
    }
    
    // Watcher methods
    addWatcher(userId) {
        if (!this._watchers.includes(userId)) {
            this._watchers.push(userId);
            this._touch();
        }
        return this;
    }
    
    removeWatcher(userId) {
        const index = this._watchers.indexOf(userId);
        if (index > -1) {
            this._watchers.splice(index, 1);
            this._touch();
        }
        return this;
    }
    
    // Workflow methods
    setWorkflowStage(stage) {
        const validStages = ['backlog', 'todo', 'in-progress', 'review', 'testing', 'done'];
        if (!validStages.includes(stage)) {
            throw new Error(`Invalid workflow stage: ${stage}`);
        }
        
        this._workflowStage = stage;
        this._touch();
        return this;
    }
    
    addReviewer(userId) {
        if (!this._reviewers.includes(userId)) {
            this._reviewers.push(userId);
            this._touch();
        }
        return this;
    }
    
    approve(userId, comment = '') {
        if (!this._reviewers.includes(userId)) {
            throw new Error('User is not a reviewer for this task');
        }
        
        const approval = {
            userId: userId,
            comment: comment,
            approvedAt: new Date()
        };
        
        this._approvals.push(approval);
        this._touch();
        return this;
    }
    
    // Blocking methods
    blockBy(taskId, reason = '') {
        if (!this._blockedBy.includes(taskId)) {
            this._blockedBy.push(taskId);
            this._touch();
        }
        return this;
    }
    
    unblockBy(taskId) {
        const index = this._blockedBy.indexOf(taskId);
        if (index > -1) {
            this._blockedBy.splice(index, 1);
            this._touch();
        }
        return this;
    }
    
    // Activity tracking methods
    recordActivity(type, userId, data = {}) {
        this._lastActivityAt = new Date();
        
        // In a real app, this would integrate with the activity feed system
        const activity = {
            type: type,
            userId: userId,
            taskId: this._id,
            data: data,
            timestamp: new Date()
        };
        
        return activity;
    }
    
    // Private helper methods
    _recordShareActivity(userId, sharedBy) {
        const shareRecord = {
            userId: userId,
            sharedBy: sharedBy,
            sharedAt: new Date()
        };
        
        this._shareHistory.push(shareRecord);
        this._collaborationMetrics.totalShares++;
    }
    
    _recordAssignmentActivity(userId, assignedBy) {
        const assignmentRecord = {
            userId: userId,
            assignedBy: assignedBy,
            assignedAt: new Date(),
            previousAssignee: this._assignedTo
        };
        
        this._assignmentHistory.push(assignmentRecord);
        this._collaborationMetrics.totalAssignments++;
    }
    
    _extractMentions(content) {
        const mentionRegex = /@(\w+)/g;
        const mentions = [];
        let match;
        
        while ((match = mentionRegex.exec(content)) !== null) {
            mentions.push(match[1]);
        }
        
        return mentions;
    }
    
    // Validation methods
    _validateCollaborators(collaborators) {
        if (!Array.isArray(collaborators)) {
            throw new Error('Collaborators must be an array');
        }
        return collaborators.filter(id => typeof id === 'string' && id.trim() !== '');
    }
    
    _validateSharedWith(sharedWith) {
        if (!Array.isArray(sharedWith)) {
            throw new Error('SharedWith must be an array');
        }
        return sharedWith.filter(id => typeof id === 'string' && id.trim() !== '');
    }
    
    _validateVisibility(visibility) {
        const validVisibilities = ['private', 'team', 'public'];
        if (!validVisibilities.includes(visibility)) {
            throw new Error(`Invalid visibility: ${visibility}. Must be one of: ${validVisibilities.join(', ')}`);
        }
        return visibility;
    }
    
    _validatePermissions(permissions) {
        if (typeof permissions !== 'object' || permissions === null) {
            return {};
        }
        return { ...permissions };
    }
    
    _validateWatchers(watchers) {
        if (!Array.isArray(watchers)) {
            throw new Error('Watchers must be an array');
        }
        return watchers.filter(id => typeof id === 'string' && id.trim() !== '');
    }
    
    // Enhanced serialization
    toJSON() {
        const baseData = super.toJSON();
        
        return {
            ...baseData,
            creatorId: this._creatorId,
            collaborators: [...this._collaborators],
            sharedWith: [...this._sharedWith],
            visibility: this._visibility,
            permissions: { ...this._permissions },
            comments: [...this._comments],
            commentCount: this._commentCount,
            lastCommentAt: this._lastCommentAt ? this._lastCommentAt.toISOString() : null,
            watchers: [...this._watchers],
            mentions: [...this._mentions],
            lastActivityAt: this._lastActivityAt.toISOString(),
            workflowStage: this._workflowStage,
            reviewers: [...this._reviewers],
            approvals: [...this._approvals],
            blockedBy: [...this._blockedBy],
            blocking: [...this._blocking],
            shareHistory: [...this._shareHistory],
            assignmentHistory: [...this._assignmentHistory],
            collaborationMetrics: { ...this._collaborationMetrics }
        };
    }
    
    static fromJSON(data) {
        // Create base task first
        const task = new CollaborativeTask(data.title, data.description, data.userId, {
            ...data,
            collaborators: data.collaborators,
            sharedWith: data.sharedWith,
            visibility: data.visibility,
            permissions: data.permissions,
            comments: data.comments,
            commentCount: data.commentCount,
            lastCommentAt: data.lastCommentAt,
            watchers: data.watchers,
            mentions: data.mentions,
            lastActivityAt: data.lastActivityAt,
            workflowStage: data.workflowStage,
            reviewers: data.reviewers,
            approvals: data.approvals,
            blockedBy: data.blockedBy,
            blocking: data.blocking,
            shareHistory: data.shareHistory,
            assignmentHistory: data.assignmentHistory,
            collaborationMetrics: data.collaborationMetrics
        });
        
        return task;
    }
    
    // Enhanced touch method
    _touch() {
        super._touch();
        this._lastActivityAt = new Date();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollaborativeTask;
} else {
    window.CollaborativeTask = CollaborativeTask;
}