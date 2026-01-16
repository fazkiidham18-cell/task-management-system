/**
 * Team User Model - Day 4 Implementation
 * 
 * Extends the Day 2 User Model with team collaboration features
 * including team membership, collaboration history, and team-specific settings.
 * 
 * Demonstrates:
 * - Team membership and role management
 * - Collaboration statistics and history
 * - Team-specific preferences and settings
 * - Activity tracking across teams
 * - Integration with collaboration systems
 */

// Import the base User model from Day 2
const User = require('../day2-requirements-design/user-model');

class TeamUser extends User {
    constructor(username, email, options = {}) {
        // Call parent constructor
        super(username, email, options);
        
        // Team membership properties
        this._teams = this._validateTeams(options.teams || []);
        this._primaryTeam = options.primaryTeam || null;
        this._teamRoles = options.teamRoles || {}; // teamId -> role mapping
        
        // Collaboration properties
        this._collaborationStats = this._validateCollaborationStats(options.collaborationStats || {});
        this._workingHours = this._validateWorkingHours(options.workingHours || {});
        this._availability = options.availability || 'available'; // 'available', 'busy', 'away', 'offline'
        this._statusMessage = options.statusMessage || '';
        
        // Team communication preferences
        this._notificationSettings = this._validateNotificationSettings(options.notificationSettings || {});
        this._communicationPreferences = options.communicationPreferences || {};
        
        // Collaboration history
        this._recentActivity = options.recentActivity || [];
        this._collaborationHistory = options.collaborationHistory || [];
        this._mentorshipRelations = options.mentorshipRelations || {
            mentoring: [], // Users this person is mentoring
            mentoredBy: [] // Users mentoring this person
        };
        
        // Skills and expertise
        this._skills = this._validateSkills(options.skills || []);
        this._expertise = options.expertise || [];
        this._interests = options.interests || [];
        
        // Team integration
        this._integrations = options.integrations || {}; // External tool integrations
        this._teamSettings = options.teamSettings || {};
    }
    
    // Team membership properties
    get teams() { return [...this._teams]; }
    get primaryTeam() { return this._primaryTeam; }
    get teamRoles() { return { ...this._teamRoles }; }
    
    // Collaboration properties
    get collaborationStats() { return { ...this._collaborationStats }; }
    get workingHours() { return { ...this._workingHours }; }
    get availability() { return this._availability; }
    get statusMessage() { return this._statusMessage; }
    
    // Communication properties
    get notificationSettings() { return { ...this._notificationSettings }; }
    get communicationPreferences() { return { ...this._communicationPreferences }; }
    
    // History and relationships
    get recentActivity() { return [...this._recentActivity]; }
    get collaborationHistory() { return [...this._collaborationHistory]; }
    get mentorshipRelations() { return { ...this._mentorshipRelations }; }
    
    // Skills and expertise
    get skills() { return [...this._skills]; }
    get expertise() { return [...this._expertise]; }
    get interests() { return [...this._interests]; }
    
    // Integration properties
    get integrations() { return { ...this._integrations }; }
    get teamSettings() { return { ...this._teamSettings }; }
    
    // Computed team properties
    get isTeamMember() {
        return this._teams.length > 0;
    }
    
    get isTeamLead() {
        return Object.values(this._teamRoles).some(role => 
            role === 'lead' || role === 'manager' || role === 'admin'
        );
    }
    
    get totalTeams() {
        return this._teams.length;
    }
    
    get isAvailable() {
        return this._availability === 'available';
    }
    
    get isMentor() {
        return this._mentorshipRelations.mentoring.length > 0;
    }
    
    get isMentee() {
        return this._mentorshipRelations.mentoredBy.length > 0;
    }
    
    // Team membership methods
    joinTeam(teamId, role = 'member') {
        if (!teamId || typeof teamId !== 'string') {
            throw new Error('Valid team ID is required');
        }
        
        if (!this._teams.includes(teamId)) {
            this._teams.push(teamId);
            this._teamRoles[teamId] = role;
            
            // Set as primary team if it's the first team
            if (!this._primaryTeam) {
                this._primaryTeam = teamId;
            }
            
            this._recordActivity('joined_team', { teamId, role });
            this._touch();
        }
        
        return this;
    }
    
    leaveTeam(teamId) {
        const index = this._teams.indexOf(teamId);
        if (index > -1) {
            this._teams.splice(index, 1);
            delete this._teamRoles[teamId];
            
            // Update primary team if leaving it
            if (this._primaryTeam === teamId) {
                this._primaryTeam = this._teams.length > 0 ? this._teams[0] : null;
            }
            
            this._recordActivity('left_team', { teamId });
            this._touch();
        }
        
        return this;
    }
    
    setTeamRole(teamId, role) {
        if (!this._teams.includes(teamId)) {
            throw new Error('User is not a member of this team');
        }
        
        const validRoles = ['member', 'contributor', 'maintainer', 'lead', 'admin'];
        if (!validRoles.includes(role)) {
            throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
        }
        
        const oldRole = this._teamRoles[teamId];
        this._teamRoles[teamId] = role;
        
        this._recordActivity('role_changed', { teamId, oldRole, newRole: role });
        this._touch();
        
        return this;
    }
    
    getTeamRole(teamId) {
        return this._teamRoles[teamId] || null;
    }
    
    setPrimaryTeam(teamId) {
        if (!this._teams.includes(teamId)) {
            throw new Error('Cannot set primary team to a team user is not a member of');
        }
        
        this._primaryTeam = teamId;
        this._touch();
        return this;
    }
    
    // Availability and status methods
    setAvailability(availability, statusMessage = '') {
        const validStatuses = ['available', 'busy', 'away', 'offline'];
        if (!validStatuses.includes(availability)) {
            throw new Error(`Invalid availability: ${availability}. Must be one of: ${validStatuses.join(', ')}`);
        }
        
        this._availability = availability;
        this._statusMessage = statusMessage;
        this._touch();
        
        return this;
    }
    
    setStatusMessage(message) {
        this._statusMessage = message || '';
        this._touch();
        return this;
    }
    
    // Working hours methods
    setWorkingHours(schedule) {
        this._workingHours = this._validateWorkingHours(schedule);
        this._touch();
        return this;
    }
    
    isWorkingHours(date = new Date()) {
        const day = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
        const time = date.toTimeString().slice(0, 5); // HH:MM format
        
        const daySchedule = this._workingHours[day];
        if (!daySchedule || !daySchedule.enabled) {
            return false;
        }
        
        return time >= daySchedule.start && time <= daySchedule.end;
    }
    
    // Collaboration statistics methods
    updateCollaborationStats(type, increment = 1) {
        const validTypes = [
            'tasksCreated', 'tasksCompleted', 'tasksAssigned', 'tasksShared',
            'commentsPosted', 'reviewsGiven', 'reviewsReceived', 'mentoringSessions'
        ];
        
        if (!validTypes.includes(type)) {
            throw new Error(`Invalid collaboration stat type: ${type}`);
        }
        
        if (!this._collaborationStats[type]) {
            this._collaborationStats[type] = 0;
        }
        
        this._collaborationStats[type] += increment;
        this._touch();
        
        return this;
    }
    
    getCollaborationScore() {
        const stats = this._collaborationStats;
        const weights = {
            tasksCreated: 2,
            tasksCompleted: 3,
            tasksAssigned: 1,
            tasksShared: 1,
            commentsPosted: 1,
            reviewsGiven: 2,
            reviewsReceived: 1,
            mentoringSessions: 3
        };
        
        let score = 0;
        Object.keys(weights).forEach(key => {
            score += (stats[key] || 0) * weights[key];
        });
        
        return score;
    }
    
    // Skills and expertise methods
    addSkill(skill, level = 'beginner') {
        if (!skill || typeof skill !== 'string') {
            throw new Error('Skill must be a non-empty string');
        }
        
        const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        if (!validLevels.includes(level)) {
            throw new Error(`Invalid skill level: ${level}. Must be one of: ${validLevels.join(', ')}`);
        }
        
        const skillObj = {
            name: skill.trim().toLowerCase(),
            level: level,
            addedAt: new Date(),
            endorsements: 0
        };
        
        // Remove existing skill with same name
        this._skills = this._skills.filter(s => s.name !== skillObj.name);
        this._skills.push(skillObj);
        
        this._touch();
        return this;
    }
    
    removeSkill(skillName) {
        this._skills = this._skills.filter(s => s.name !== skillName.trim().toLowerCase());
        this._touch();
        return this;
    }
    
    endorseSkill(skillName, endorserId) {
        const skill = this._skills.find(s => s.name === skillName.trim().toLowerCase());
        if (skill) {
            skill.endorsements = (skill.endorsements || 0) + 1;
            if (!skill.endorsedBy) {
                skill.endorsedBy = [];
            }
            if (!skill.endorsedBy.includes(endorserId)) {
                skill.endorsedBy.push(endorserId);
            }
            this._touch();
        }
        return this;
    }
    
    hasSkill(skillName, minLevel = 'beginner') {
        const skill = this._skills.find(s => s.name === skillName.trim().toLowerCase());
        if (!skill) return false;
        
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const skillLevelIndex = levels.indexOf(skill.level);
        const minLevelIndex = levels.indexOf(minLevel);
        
        return skillLevelIndex >= minLevelIndex;
    }
    
    // Mentorship methods
    addMentee(userId) {
        if (!this._mentorshipRelations.mentoring.includes(userId)) {
            this._mentorshipRelations.mentoring.push(userId);
            this._recordActivity('started_mentoring', { menteeId: userId });
            this._touch();
        }
        return this;
    }
    
    removeMentee(userId) {
        const index = this._mentorshipRelations.mentoring.indexOf(userId);
        if (index > -1) {
            this._mentorshipRelations.mentoring.splice(index, 1);
            this._recordActivity('stopped_mentoring', { menteeId: userId });
            this._touch();
        }
        return this;
    }
    
    addMentor(userId) {
        if (!this._mentorshipRelations.mentoredBy.includes(userId)) {
            this._mentorshipRelations.mentoredBy.push(userId);
            this._recordActivity('started_being_mentored', { mentorId: userId });
            this._touch();
        }
        return this;
    }
    
    removeMentor(userId) {
        const index = this._mentorshipRelations.mentoredBy.indexOf(userId);
        if (index > -1) {
            this._mentorshipRelations.mentoredBy.splice(index, 1);
            this._recordActivity('stopped_being_mentored', { mentorId: userId });
            this._touch();
        }
        return this;
    }
    
    // Notification settings methods
    setNotificationSetting(type, enabled) {
        this._notificationSettings[type] = Boolean(enabled);
        this._touch();
        return this;
    }
    
    getNotificationSetting(type, defaultValue = true) {
        return this._notificationSettings.hasOwnProperty(type) ? 
            this._notificationSettings[type] : defaultValue;
    }
    
    // Activity tracking methods
    recordActivity(type, data = {}) {
        const activity = {
            id: this._generateId(),
            type: type,
            data: data,
            timestamp: new Date()
        };
        
        this._recentActivity.unshift(activity);
        
        // Keep only last 100 activities
        if (this._recentActivity.length > 100) {
            this._recentActivity = this._recentActivity.slice(0, 100);
        }
        
        this.updateActivity(); // Update last active time
        return activity;
    }
    
    getRecentActivity(limit = 20) {
        return this._recentActivity.slice(0, limit);
    }
    
    // Team permission methods
    hasTeamPermission(teamId, permission) {
        const role = this.getTeamRole(teamId);
        if (!role) return false;
        
        const rolePermissions = {
            member: ['read', 'comment'],
            contributor: ['read', 'comment', 'create', 'edit_own'],
            maintainer: ['read', 'comment', 'create', 'edit_own', 'edit_any', 'assign'],
            lead: ['read', 'comment', 'create', 'edit_own', 'edit_any', 'assign', 'manage_team'],
            admin: ['*'] // All permissions
        };
        
        const permissions = rolePermissions[role] || [];
        return permissions.includes('*') || permissions.includes(permission);
    }
    
    // Integration methods
    setIntegration(service, config) {
        this._integrations[service] = {
            ...config,
            connectedAt: new Date(),
            isActive: true
        };
        this._touch();
        return this;
    }
    
    removeIntegration(service) {
        delete this._integrations[service];
        this._touch();
        return this;
    }
    
    hasIntegration(service) {
        return this._integrations[service] && this._integrations[service].isActive;
    }
    
    // Private helper methods
    _recordActivity(type, data) {
        return this.recordActivity(type, data);
    }
    
    // Validation methods
    _validateTeams(teams) {
        if (!Array.isArray(teams)) {
            throw new Error('Teams must be an array');
        }
        return teams.filter(id => typeof id === 'string' && id.trim() !== '');
    }
    
    _validateCollaborationStats(stats) {
        if (typeof stats !== 'object' || stats === null) {
            return {
                tasksCreated: 0,
                tasksCompleted: 0,
                tasksAssigned: 0,
                tasksShared: 0,
                commentsPosted: 0,
                reviewsGiven: 0,
                reviewsReceived: 0,
                mentoringSessions: 0
            };
        }
        return { ...stats };
    }
    
    _validateWorkingHours(hours) {
        const defaultHours = {
            monday: { enabled: true, start: '09:00', end: '17:00' },
            tuesday: { enabled: true, start: '09:00', end: '17:00' },
            wednesday: { enabled: true, start: '09:00', end: '17:00' },
            thursday: { enabled: true, start: '09:00', end: '17:00' },
            friday: { enabled: true, start: '09:00', end: '17:00' },
            saturday: { enabled: false, start: '09:00', end: '17:00' },
            sunday: { enabled: false, start: '09:00', end: '17:00' }
        };
        
        return { ...defaultHours, ...hours };
    }
    
    _validateNotificationSettings(settings) {
        const defaultSettings = {
            taskAssigned: true,
            taskCompleted: true,
            taskCommented: true,
            taskShared: true,
            mentionReceived: true,
            reviewRequested: true,
            teamInvitation: true,
            dailyDigest: true,
            weeklyReport: false
        };
        
        return { ...defaultSettings, ...settings };
    }
    
    _validateSkills(skills) {
        if (!Array.isArray(skills)) {
            return [];
        }
        
        return skills.map(skill => {
            if (typeof skill === 'string') {
                return {
                    name: skill.trim().toLowerCase(),
                    level: 'beginner',
                    addedAt: new Date(),
                    endorsements: 0
                };
            }
            return skill;
        });
    }
    
    // Enhanced serialization
    toJSON() {
        const baseData = super.toJSON();
        
        return {
            ...baseData,
            teams: [...this._teams],
            primaryTeam: this._primaryTeam,
            teamRoles: { ...this._teamRoles },
            collaborationStats: { ...this._collaborationStats },
            workingHours: { ...this._workingHours },
            availability: this._availability,
            statusMessage: this._statusMessage,
            notificationSettings: { ...this._notificationSettings },
            communicationPreferences: { ...this._communicationPreferences },
            recentActivity: [...this._recentActivity],
            collaborationHistory: [...this._collaborationHistory],
            mentorshipRelations: { ...this._mentorshipRelations },
            skills: [...this._skills],
            expertise: [...this._expertise],
            interests: [...this._interests],
            integrations: { ...this._integrations },
            teamSettings: { ...this._teamSettings }
        };
    }
    
    // Public profile for team members
    toTeamJSON() {
        return {
            id: this._id,
            username: this._username,
            displayName: this._displayName,
            fullName: this.fullName,
            initials: this.initials,
            avatar: this._avatar,
            bio: this._bio,
            role: this._role,
            teams: [...this._teams],
            primaryTeam: this._primaryTeam,
            teamRoles: { ...this._teamRoles },
            availability: this._availability,
            statusMessage: this._statusMessage,
            skills: [...this._skills],
            expertise: [...this._expertise],
            workingHours: { ...this._workingHours },
            collaborationScore: this.getCollaborationScore(),
            isAvailable: this.isAvailable,
            isTeamLead: this.isTeamLead,
            isMentor: this.isMentor,
            lastActiveAt: this._lastActiveAt.toISOString()
        };
    }
    
    static fromJSON(data) {
        const user = new TeamUser(data.username, data.email, {
            ...data,
            teams: data.teams,
            primaryTeam: data.primaryTeam,
            teamRoles: data.teamRoles,
            collaborationStats: data.collaborationStats,
            workingHours: data.workingHours,
            availability: data.availability,
            statusMessage: data.statusMessage,
            notificationSettings: data.notificationSettings,
            communicationPreferences: data.communicationPreferences,
            recentActivity: data.recentActivity,
            collaborationHistory: data.collaborationHistory,
            mentorshipRelations: data.mentorshipRelations,
            skills: data.skills,
            expertise: data.expertise,
            interests: data.interests,
            integrations: data.integrations,
            teamSettings: data.teamSettings
        });
        
        return user;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamUser;
} else {
    window.TeamUser = TeamUser;
}