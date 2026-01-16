/**
 * Task Workflow Integration Tests - Day 3 Implementation
 * Tests complete workflows across multiple components
 * 
 * Feature: sample-project-refactor, Property 2: Progressive Structure Integrity
 * Validates: Requirements 7.2, 7.5
 */

const { TestDataFactory, TestAssertions, MockFactory, TestEnvironment } = require('../test-utilities');

// Import all components for integration testing
const Task = require('../../day2-requirements-design/enhanced-task-model');
const { TaskRepository } = require('../../day2-requirements-design/task-repository');
const { TaskController } = require('../../day2-requirements-design/task-controller');

describe('Task Management Integration Workflows', () => {
    let taskRepository;
    let taskController;
    let mockStorage;
    let mockUserService;
    let mockTaskView;
    let testUser;

    beforeEach(async () => {
        // Set up complete system
        mockStorage = MockFactory.createMockStorage();
        mockUserService = MockFactory.createMockService();
        mockTaskView = MockFactory.createMockView();
        
        // Create test user
        testUser = TestDataFactory.createUser({ 
            id: 'user123', 
            username: 'testuser',
            isAdmin: false 
        });
        mockUserService.getUserById.mockResolvedValue(testUser);
        
        // Initialize repository with mock storage
        taskRepository = new TaskRepository(mockStorage);
        
        // Create a mock task service that uses the repository
        const mockTaskService = {
            createTask: jest.fn().mockImplementation(async (taskData) => {
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                return await taskRepository.create(task);
            }),
            getTaskById: jest.fn().mockImplementation(async (id) => {
                return await taskRepository.findById(id);
            }),
            updateTask: jest.fn().mockImplementation(async (id, updates) => {
                return await taskRepository.update(id, updates);
            }),
            deleteTask: jest.fn().mockImplementation(async (id) => {
                return await taskRepository.delete(id);
            }),
            getTasksForUser: jest.fn().mockImplementation(async (userId) => {
                return await taskRepository.findByUserId(userId);
            }),
            getPendingTasks: jest.fn().mockImplementation(async (userId) => {
                return await taskRepository.findAll({ userId, completed: false });
            }),
            getCompletedTasks: jest.fn().mockImplementation(async (userId) => {
                return await taskRepository.findAll({ userId, completed: true });
            }),
            getOverdueTasks: jest.fn().mockImplementation(async (userId) => {
                return await taskRepository.findOverdue();
            }),
            getTasksByPriority: jest.fn().mockImplementation(async (userId, priority) => {
                return await taskRepository.findAll({ userId, priority });
            }),
            getTasksByCategory: jest.fn().mockImplementation(async (userId, category) => {
                return await taskRepository.findAll({ userId, category });
            }),
            searchTasks: jest.fn().mockImplementation(async (userId, query) => {
                return await taskRepository.search(query);
            }),
            getTaskStats: jest.fn().mockImplementation(async (userId) => {
                return await taskRepository.getStatistics(userId);
            })
        };
        
        // Initialize controller
        taskController = new TaskController(mockTaskService, mockUserService, mockTaskView);
        await taskController.initialize('user123');
        
        // Set up DOM environment
        TestEnvironment.setupDOM();
    });

    afterEach(() => {
        jest.clearAllMocks();
        TestEnvironment.cleanupDOM();
    });

    describe('Complete Task Lifecycle Workflow', () => {
        test('should handle complete task lifecycle from creation to deletion', async () => {
            // Step 1: Create a new task
            const taskData = TestDataFactory.createValidTaskData({
                title: 'Integration Test Task',
                description: 'Testing complete workflow',
                priority: 'high',
                category: 'testing'
            });

            const createdTask = await taskController.createTask(taskData);
            
            // Verify creation
            expect(createdTask).toBeDefined();
            expect(createdTask.id).toBeDefined();
            expect(createdTask.title).toBe(taskData.title);
            expect(createdTask.userId).toBe('user123');
            
            // Step 2: Retrieve the task
            const retrievedTask = await taskController.getTask(createdTask.id);
            expect(retrievedTask).toBeDefined();
            expect(retrievedTask.id).toBe(createdTask.id);
            
            // Step 3: Update the task
            const updates = {
                title: 'Updated Integration Test Task',
                description: 'Updated description',
                priority: 'medium'
            };
            
            const updatedTask = await taskController.updateTask(createdTask.id, updates);
            expect(updatedTask.title).toBe(updates.title);
            expect(updatedTask.description).toBe(updates.description);
            expect(updatedTask.priority).toBe(updates.priority);
            
            // Step 4: Toggle completion
            const completedTask = await taskController.toggleTaskCompletion(createdTask.id);
            expect(completedTask.completed).toBe(true);
            expect(completedTask.completedAt).toBeDefined();
            
            // Step 5: Toggle back to incomplete
            const incompletedTask = await taskController.toggleTaskCompletion(createdTask.id);
            expect(incompletedTask.completed).toBe(false);
            expect(incompletedTask.completedAt).toBeNull();
            
            // Step 6: Delete the task
            const deleted = await taskController.deleteTask(createdTask.id);
            expect(deleted).toBe(true);
            
            // Step 7: Verify deletion
            const deletedTask = await taskController.getTask(createdTask.id);
            expect(deletedTask).toBeNull();
        });

        test('should maintain data consistency throughout lifecycle', async () => {
            // Create task
            const taskData = TestDataFactory.createValidTaskData();
            const createdTask = await taskController.createTask(taskData);
            const originalId = createdTask.id;
            const originalCreatedAt = createdTask.createdAt;
            
            // Perform multiple operations
            await taskController.updateTask(createdTask.id, { title: 'Updated Title' });
            await taskController.toggleTaskCompletion(createdTask.id);
            await taskController.updateTask(createdTask.id, { priority: 'high' });
            await taskController.toggleTaskCompletion(createdTask.id);
            
            // Verify consistency
            const finalTask = await taskController.getTask(createdTask.id);
            expect(finalTask.id).toBe(originalId);
            expect(finalTask.createdAt).toEqual(originalCreatedAt);
            expect(finalTask.title).toBe('Updated Title');
            expect(finalTask.priority).toBe('high');
            expect(finalTask.completed).toBe(false);
        });
    });

    describe('Multi-Task Management Workflow', () => {
        test('should handle multiple tasks efficiently', async () => {
            // Create multiple tasks
            const taskDataList = TestDataFactory.createMultipleTasks(5);
            const createdTasks = [];
            
            for (const taskData of taskDataList) {
                const task = await taskController.createTask(taskData);
                createdTasks.push(task);
            }
            
            // Verify all tasks were created
            expect(createdTasks).toHaveLength(5);
            createdTasks.forEach(task => {
                expect(task.id).toBeDefined();
                expect(task.userId).toBe('user123');
            });
            
            // Get all tasks for user
            const allTasks = await taskController.getAllTasks();
            expect(allTasks).toHaveLength(5);
            
            // Complete some tasks
            await taskController.toggleTaskCompletion(createdTasks[0].id);
            await taskController.toggleTaskCompletion(createdTasks[2].id);
            
            // Filter completed tasks
            const completedTasks = await taskController.filterTasks('completed');
            expect(completedTasks).toHaveLength(2);
            
            // Filter pending tasks
            const pendingTasks = await taskController.filterTasks('pending');
            expect(pendingTasks).toHaveLength(3);
            
            // Update task statistics
            const stats = await taskController.updateTaskStats();
            expect(stats.total).toBe(5);
            expect(stats.completed).toBe(2);
            expect(stats.pending).toBe(3);
        });

        test('should handle task filtering and search workflows', async () => {
            // Create tasks with different properties
            const tasks = [
                { title: 'High Priority Work Task', priority: 'high', category: 'work' },
                { title: 'Medium Priority Personal Task', priority: 'medium', category: 'personal' },
                { title: 'Low Priority Work Task', priority: 'low', category: 'work' },
                { title: 'Important Meeting Preparation', priority: 'high', category: 'work' }
            ];
            
            const createdTasks = [];
            for (const taskData of tasks) {
                const task = await taskController.createTask(taskData);
                createdTasks.push(task);
            }
            
            // Test priority filtering
            const highPriorityTasks = await taskController.filterTasks('priority', 'high');
            expect(highPriorityTasks).toHaveLength(2);
            
            // Test category filtering
            const workTasks = await taskController.filterTasks('category', 'work');
            expect(workTasks).toHaveLength(3);
            
            // Test search functionality
            const searchResults = await taskController.searchTasks('work');
            expect(searchResults.length).toBeGreaterThan(0);
            
            // Test search with specific term
            const meetingResults = await taskController.searchTasks('meeting');
            expect(meetingResults).toHaveLength(1);
            expect(meetingResults[0].title).toContain('Meeting');
        });
    });

    describe('Task Assignment and Collaboration Workflow', () => {
        let secondUser;

        beforeEach(() => {
            secondUser = TestDataFactory.createUser({ 
                id: 'user456', 
                username: 'seconduser' 
            });
            mockUserService.getUserById.mockImplementation(async (id) => {
                if (id === 'user123') return testUser;
                if (id === 'user456') return secondUser;
                return null;
            });
        });

        test('should handle task assignment workflow', async () => {
            // Create task as user123
            const taskData = TestDataFactory.createValidTaskData({
                title: 'Collaborative Task'
            });
            const createdTask = await taskController.createTask(taskData);
            
            // Verify initial assignment
            expect(createdTask.userId).toBe('user123');
            expect(createdTask.assignedTo).toBe('user123');
            
            // Assign to another user
            const assignedTask = await taskController.assignTask(createdTask.id, 'user456');
            expect(assignedTask.assignedTo).toBe('user456');
            expect(assignedTask.userId).toBe('user123'); // Owner should remain the same
            
            // Verify assignment persisted
            const retrievedTask = await taskController.getTask(createdTask.id);
            expect(retrievedTask.assignedTo).toBe('user456');
        });

        test('should handle permission-based operations', async () => {
            // Create task as user123
            const taskData = TestDataFactory.createValidTaskData();
            const createdTask = await taskController.createTask(taskData);
            
            // Assign to user456
            await taskController.assignTask(createdTask.id, 'user456');
            
            // User123 (owner) should be able to modify
            const updatedTask = await taskController.updateTask(createdTask.id, { 
                title: 'Owner Updated Title' 
            });
            expect(updatedTask.title).toBe('Owner Updated Title');
            
            // Switch to user456 context (assignee)
            await taskController.setCurrentUser('user456');
            
            // User456 (assignee) should be able to modify
            const assigneeUpdatedTask = await taskController.updateTask(createdTask.id, { 
                description: 'Assignee Updated Description' 
            });
            expect(assigneeUpdatedTask.description).toBe('Assignee Updated Description');
        });
    });

    describe('Time Tracking Workflow', () => {
        test('should handle complete time tracking workflow', async () => {
            // Create task with estimated hours
            const taskData = TestDataFactory.createValidTaskData({
                title: 'Time Tracked Task',
                estimatedHours: 8
            });
            const createdTask = await taskController.createTask(taskData);
            
            // Add time spent in increments
            await taskController.addTimeSpent(createdTask.id, 2);
            let updatedTask = await taskController.getTask(createdTask.id);
            expect(updatedTask.actualHours).toBe(2);
            
            await taskController.addTimeSpent(createdTask.id, 3);
            updatedTask = await taskController.getTask(createdTask.id);
            expect(updatedTask.actualHours).toBe(5);
            
            // Set due date
            const dueDate = new Date('2024-12-31');
            await taskController.setDueDate(createdTask.id, dueDate);
            updatedTask = await taskController.getTask(createdTask.id);
            expect(updatedTask.dueDate).toEqual(dueDate);
            
            // Complete the task
            const completedTask = await taskController.toggleTaskCompletion(createdTask.id);
            expect(completedTask.completed).toBe(true);
            expect(completedTask.progress).toBe(100); // Should be 100% when completed
        });
    });

    describe('Tag Management Workflow', () => {
        test('should handle tag management throughout task lifecycle', async () => {
            // Create task
            const taskData = TestDataFactory.createValidTaskData({
                title: 'Tagged Task'
            });
            const createdTask = await taskController.createTask(taskData);
            
            // Add tags
            await taskController.addTaskTag(createdTask.id, 'important');
            await taskController.addTaskTag(createdTask.id, 'urgent');
            await taskController.addTaskTag(createdTask.id, 'client-work');
            
            let updatedTask = await taskController.getTask(createdTask.id);
            expect(updatedTask.tags).toContain('important');
            expect(updatedTask.tags).toContain('urgent');
            expect(updatedTask.tags).toContain('client-work');
            
            // Remove a tag
            await taskController.removeTaskTag(createdTask.id, 'urgent');
            updatedTask = await taskController.getTask(createdTask.id);
            expect(updatedTask.tags).not.toContain('urgent');
            expect(updatedTask.tags).toContain('important');
            expect(updatedTask.tags).toContain('client-work');
            
            // Search by tag (this would work if search includes tags)
            const taggedTasks = await taskController.searchTasks('important');
            expect(taggedTasks.length).toBeGreaterThan(0);
        });
    });

    describe('Error Recovery Workflows', () => {
        test('should handle storage failures gracefully', async () => {
            // Create task successfully
            const taskData = TestDataFactory.createValidTaskData();
            const createdTask = await taskController.createTask(taskData);
            
            // Simulate storage failure for updates
            mockStorage.save.mockRejectedValueOnce(new Error('Storage failure'));
            
            // Update should fail but not crash the system
            await expect(taskController.updateTask(createdTask.id, { title: 'New Title' }))
                .rejects
                .toThrow('Storage failure');
            
            // System should recover for subsequent operations
            mockStorage.save.mockResolvedValue(true);
            const updatedTask = await taskController.updateTask(createdTask.id, { title: 'Recovery Title' });
            expect(updatedTask.title).toBe('Recovery Title');
        });

        test('should handle invalid operations gracefully', async () => {
            // Try to operate on non-existent task
            await expect(taskController.updateTask('non-existent', { title: 'Test' }))
                .rejects
                .toThrow();
            
            await expect(taskController.deleteTask('non-existent'))
                .rejects
                .toThrow();
            
            // Try to assign to non-existent user
            const taskData = TestDataFactory.createValidTaskData();
            const createdTask = await taskController.createTask(taskData);
            
            await expect(taskController.assignTask(createdTask.id, 'non-existent-user'))
                .rejects
                .toThrow('Assignee not found');
        });
    });

    describe('Performance Integration Tests', () => {
        test('should handle bulk operations efficiently', async () => {
            const startTime = performance.now();
            
            // Create many tasks
            const taskPromises = [];
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Bulk Task ${i}`,
                    priority: ['low', 'medium', 'high'][i % 3]
                });
                taskPromises.push(taskController.createTask(taskData));
            }
            
            const createdTasks = await Promise.all(taskPromises);
            expect(createdTasks).toHaveLength(50);
            
            // Perform bulk operations
            const updatePromises = createdTasks.slice(0, 25).map(task =>
                taskController.updateTask(task.id, { description: 'Bulk updated' })
            );
            await Promise.all(updatePromises);
            
            // Complete some tasks
            const completePromises = createdTasks.slice(0, 10).map(task =>
                taskController.toggleTaskCompletion(task.id)
            );
            await Promise.all(completePromises);
            
            const endTime = performance.now();
            
            // Should complete bulk operations in reasonable time
            expect(endTime - startTime).toBeLessThan(1000);
            
            // Verify final state
            const allTasks = await taskController.getAllTasks();
            expect(allTasks).toHaveLength(50);
            
            const completedTasks = await taskController.filterTasks('completed');
            expect(completedTasks).toHaveLength(10);
        });

        test('should maintain performance with complex filtering', async () => {
            // Create diverse set of tasks
            const taskTypes = [
                { priority: 'high', category: 'work', completed: false },
                { priority: 'medium', category: 'personal', completed: true },
                { priority: 'low', category: 'work', completed: false },
                { priority: 'high', category: 'personal', completed: false }
            ];
            
            const createdTasks = [];
            for (let i = 0; i < 100; i++) {
                const taskType = taskTypes[i % taskTypes.length];
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Performance Task ${i}`,
                    ...taskType
                });
                const task = await taskController.createTask(taskData);
                createdTasks.push(task);
            }
            
            const startTime = performance.now();
            
            // Perform various filtering operations
            await taskController.filterTasks('priority', 'high');
            await taskController.filterTasks('category', 'work');
            await taskController.filterTasks('completed');
            await taskController.filterTasks('pending');
            await taskController.searchTasks('performance');
            
            const endTime = performance.now();
            
            // Filtering should be fast even with many tasks
            expect(endTime - startTime).toBeLessThan(200);
        });
    });

    describe('Data Integrity Workflows', () => {
        test('should maintain referential integrity across operations', async () => {
            // Create task
            const taskData = TestDataFactory.createValidTaskData();
            const createdTask = await taskController.createTask(taskData);
            
            // Perform operations that should maintain integrity
            await taskController.updateTask(createdTask.id, { title: 'Updated Title' });
            await taskController.addTaskTag(createdTask.id, 'test-tag');
            await taskController.addTimeSpent(createdTask.id, 2);
            await taskController.toggleTaskCompletion(createdTask.id);
            
            // Verify all changes are reflected consistently
            const finalTask = await taskController.getTask(createdTask.id);
            expect(finalTask.title).toBe('Updated Title');
            expect(finalTask.tags).toContain('test-tag');
            expect(finalTask.actualHours).toBe(2);
            expect(finalTask.completed).toBe(true);
            expect(finalTask.completedAt).toBeDefined();
            
            // Verify task appears in appropriate filters
            const completedTasks = await taskController.filterTasks('completed');
            expect(completedTasks.some(t => t.id === createdTask.id)).toBe(true);
            
            const pendingTasks = await taskController.filterTasks('pending');
            expect(pendingTasks.some(t => t.id === createdTask.id)).toBe(false);
        });

        test('should handle concurrent modifications safely', async () => {
            // Create task
            const taskData = TestDataFactory.createValidTaskData();
            const createdTask = await taskController.createTask(taskData);
            
            // Simulate concurrent modifications
            const operations = [
                taskController.updateTask(createdTask.id, { title: 'Concurrent Update 1' }),
                taskController.updateTask(createdTask.id, { description: 'Concurrent Update 2' }),
                taskController.addTaskTag(createdTask.id, 'concurrent-tag'),
                taskController.addTimeSpent(createdTask.id, 1)
            ];
            
            // All operations should complete without errors
            await Promise.all(operations);
            
            // Verify final state is consistent
            const finalTask = await taskController.getTask(createdTask.id);
            expect(finalTask).toBeDefined();
            expect(finalTask.id).toBe(createdTask.id);
            
            // At least some of the concurrent changes should be applied
            expect(
                finalTask.title.includes('Concurrent') ||
                finalTask.description.includes('Concurrent') ||
                finalTask.tags.includes('concurrent-tag') ||
                finalTask.actualHours > 0
            ).toBe(true);
        });
    });

    describe('Event Flow Integration', () => {
        test('should propagate events through the system correctly', async () => {
            const events = [];
            
            // Set up event listeners
            controller.addListener((eventType, data) => {
                events.push({ eventType, data });
            });
            
            // Perform operations that should generate events
            const taskData = TestDataFactory.createValidTaskData();
            const createdTask = await taskController.createTask(taskData);
            
            await taskController.updateTask(createdTask.id, { title: 'Event Test' });
            await taskController.toggleTaskCompletion(createdTask.id);
            await taskController.deleteTask(createdTask.id);
            
            // Verify events were generated
            const eventTypes = events.map(e => e.eventType);
            expect(eventTypes).toContain('taskCreated');
            expect(eventTypes).toContain('taskUpdated');
            expect(eventTypes).toContain('taskDeleted');
        });
    });
});