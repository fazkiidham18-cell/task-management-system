/**
 * Property-Based Tests for Task Management System - Day 3 Implementation
 * Tests universal properties that should hold for all valid inputs
 * 
 * Feature: sample-project-refactor, Property 5: Test Coverage Adequacy
 * Validates: Requirements 4.1, 4.4, 4.5
 */

const { TestDataFactory, TestAssertions, TestEnvironment } = require('../test-utilities');

// Import the Task model for property testing
const Task = require('../../day2-requirements-design/enhanced-task-model');

// Note: In a real implementation, you would use fast-check or similar library
// For this educational example, we'll simulate property-based testing concepts

describe('Task Model Properties', () => {
    beforeEach(() => {
        TestEnvironment.mockDateNow('2024-01-01T12:00:00.000Z');
    });

    afterEach(() => {
        TestEnvironment.restoreDateNow();
    });

    describe('Serialization Properties', () => {
        test('Property 1: Serialization round-trip preserves essential data', () => {
            // Simulate property-based testing with multiple random inputs
            for (let i = 0; i < 100; i++) {
                // Generate random but valid task data
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Task ${i} ${Math.random().toString(36).substr(2, 9)}`,
                    description: `Description ${i}`,
                    priority: ['low', 'medium', 'high', 'urgent'][i % 4],
                    category: ['work', 'personal', 'shopping', 'health'][i % 4],
                    estimatedHours: Math.floor(Math.random() * 20) + 1
                });
                
                // Create original task
                const originalTask = new Task(
                    taskData.title, 
                    taskData.description, 
                    taskData.userId,
                    taskData
                );
                
                // Add some random modifications
                if (i % 3 === 0) originalTask.markComplete();
                if (i % 4 === 0) originalTask.addTag(`tag-${i}`);
                if (i % 5 === 0) originalTask.setActualHours(Math.floor(Math.random() * 10));
                
                // Serialize and deserialize
                const serialized = originalTask.toJSON();
                const deserialized = Task.fromJSON(serialized);
                
                // Property: Essential data should be preserved
                expect(deserialized.title).toBe(originalTask.title);
                expect(deserialized.description).toBe(originalTask.description);
                expect(deserialized.userId).toBe(originalTask.userId);
                expect(deserialized.priority).toBe(originalTask.priority);
                expect(deserialized.category).toBe(originalTask.category);
                expect(deserialized.completed).toBe(originalTask.completed);
                expect(deserialized.estimatedHours).toBe(originalTask.estimatedHours);
                expect(deserialized.actualHours).toBe(originalTask.actualHours);
                expect(deserialized.tags).toEqual(originalTask.tags);
            }
        });

        test('Property 2: Double serialization produces identical results', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Double Serialize Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // First serialization
                const firstSerialization = task.toJSON();
                const firstDeserialized = Task.fromJSON(firstSerialization);
                
                // Second serialization
                const secondSerialization = firstDeserialized.toJSON();
                
                // Property: Multiple serializations should produce identical results
                expect(secondSerialization).toEqual(firstSerialization);
            }
        });
    });

    describe('State Consistency Properties', () => {
        test('Property 3: Completed tasks always have completedAt timestamp', () => {
            for (let i = 0; i < 100; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Completion Test Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // Mark as complete
                task.markComplete();
                
                // Property: Completed tasks must have completedAt timestamp
                expect(task.completed).toBe(true);
                expect(task.completedAt).not.toBeNull();
                expect(task.completedAt).toBeInstanceOf(Date);
                expect(task.status).toBe('completed');
            }
        });

        test('Property 4: Incomplete tasks never have completedAt timestamp', () => {
            for (let i = 0; i < 100; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Incomplete Test Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // Ensure task starts incomplete
                task.markIncomplete();
                
                // Property: Incomplete tasks must not have completedAt timestamp
                expect(task.completed).toBe(false);
                expect(task.completedAt).toBeNull();
                expect(task.status).not.toBe('completed');
            }
        });

        test('Property 5: Completion toggle maintains state consistency', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Toggle Test Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                const initialState = task.completed;
                
                // Toggle completion twice
                task.markComplete();
                task.markIncomplete();
                
                // Property: Double toggle should return to original state
                expect(task.completed).toBe(initialState);
                expect(task.completedAt).toBeNull();
            }
        });
    });

    describe('Invariant Properties', () => {
        test('Property 6: Task ID never changes after creation', () => {
            for (let i = 0; i < 100; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `ID Invariant Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                const originalId = task.id;
                
                // Perform various operations
                const operations = [
                    () => task.updateTitle(`Updated Title ${i}`),
                    () => task.updateDescription(`Updated Description ${i}`),
                    () => task.updatePriority('high'),
                    () => task.markComplete(),
                    () => task.markIncomplete(),
                    () => task.addTag(`tag-${i}`),
                    () => task.setEstimatedHours(8),
                    () => task.setActualHours(4),
                    () => task.setCategory('work'),
                    () => task.assignTo('user456')
                ];
                
                // Apply random operations
                const numOperations = Math.floor(Math.random() * operations.length) + 1;
                for (let j = 0; j < numOperations; j++) {
                    const operation = operations[Math.floor(Math.random() * operations.length)];
                    operation();
                }
                
                // Property: ID should never change
                expect(task.id).toBe(originalId);
            }
        });

        test('Property 7: CreatedAt timestamp never changes after creation', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `CreatedAt Invariant Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                const originalCreatedAt = task.createdAt;
                
                // Perform operations that might affect timestamps
                task.updateTitle('New Title');
                task.markComplete();
                task.updateDescription('New Description');
                
                // Property: CreatedAt should never change
                expect(task.createdAt).toEqual(originalCreatedAt);
            }
        });

        test('Property 8: UpdatedAt changes with modifications', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `UpdatedAt Property Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                const originalUpdatedAt = task.updatedAt;
                
                // Simulate time passing by advancing the mock time
                const newTime = new Date('2024-01-01T13:00:00.000Z').getTime();
                Date.now.mockReturnValue(newTime);
                
                // Perform a modification
                const modifications = [
                    () => task.updateTitle('Modified Title'),
                    () => task.updateDescription('Modified Description'),
                    () => task.updatePriority('high'),
                    () => task.markComplete(),
                    () => task.addTag('modified')
                ];
                
                const modification = modifications[i % modifications.length];
                modification();
                
                // Property: UpdatedAt should change after modification
                expect(task.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
            }
        });
    });

    describe('Validation Properties', () => {
        test('Property 9: Valid tasks always have required properties', () => {
            for (let i = 0; i < 100; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Validation Test Task ${i}`,
                    priority: ['low', 'medium', 'high', 'urgent'][i % 4]
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // Property: All valid tasks must have required properties
                TestAssertions.assertTaskHasRequiredProperties(task);
                expect(task.title).toBeTruthy();
                expect(task.userId).toBeTruthy();
                expect(task.id).toBeTruthy();
                expect(task.createdAt).toBeInstanceOf(Date);
                expect(task.updatedAt).toBeInstanceOf(Date);
                expect(['low', 'medium', 'high', 'urgent']).toContain(task.priority);
            }
        });

        test('Property 10: Invalid inputs always throw errors', () => {
            const invalidInputs = [
                { title: '', description: 'Valid', userId: 'user123' },
                { title: null, description: 'Valid', userId: 'user123' },
                { title: 'Valid', description: 'Valid', userId: '' },
                { title: 'Valid', description: 'Valid', userId: null },
                { title: '   ', description: 'Valid', userId: 'user123' }
            ];
            
            invalidInputs.forEach((input, i) => {
                // Property: Invalid inputs should always throw errors
                expect(() => {
                    new Task(input.title, input.description, input.userId);
                }).toThrow();
            });
        });
    });

    describe('Tag Management Properties', () => {
        test('Property 11: Tags are always normalized and unique', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Tag Property Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // Add tags with various cases and duplicates
                const tagsToAdd = [
                    'Important',
                    'IMPORTANT',
                    'important',
                    'Urgent',
                    'urgent',
                    'Work',
                    'work'
                ];
                
                tagsToAdd.forEach(tag => task.addTag(tag));
                
                // Property: Tags should be normalized (lowercase) and unique
                const tags = task.tags;
                expect(tags).toContain('important');
                expect(tags).toContain('urgent');
                expect(tags).toContain('work');
                
                // Should not contain duplicates
                const uniqueTags = [...new Set(tags)];
                expect(tags.length).toBe(uniqueTags.length);
                
                // All tags should be lowercase
                tags.forEach(tag => {
                    expect(tag).toBe(tag.toLowerCase());
                });
            }
        });

        test('Property 12: Tag operations are idempotent', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Tag Idempotent Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // Add same tag multiple times
                const tag = `test-tag-${i}`;
                task.addTag(tag);
                task.addTag(tag);
                task.addTag(tag);
                
                // Property: Multiple additions of same tag should be idempotent
                expect(task.tags.filter(t => t === tag.toLowerCase())).toHaveLength(1);
                
                // Remove tag multiple times
                task.removeTag(tag);
                task.removeTag(tag);
                task.removeTag(tag);
                
                // Property: Multiple removals should be idempotent
                expect(task.tags).not.toContain(tag.toLowerCase());
            }
        });
    });

    describe('Time Tracking Properties', () => {
        test('Property 13: Time values are always non-negative', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Time Property Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // Set various time values
                const validHours = Math.floor(Math.random() * 100);
                task.setEstimatedHours(validHours);
                task.setActualHours(validHours / 2);
                
                // Property: Time values should always be non-negative
                expect(task.estimatedHours).toBeGreaterThanOrEqual(0);
                expect(task.actualHours).toBeGreaterThanOrEqual(0);
                
                // Test addTimeSpent
                const additionalHours = Math.floor(Math.random() * 10);
                const previousActual = task.actualHours;
                task.addTimeSpent(additionalHours);
                
                // Property: Adding time should increase actual hours
                expect(task.actualHours).toBe(previousActual + additionalHours);
                expect(task.actualHours).toBeGreaterThanOrEqual(0);
            }
        });

        test('Property 14: Progress calculation is consistent', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Progress Property Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                const estimatedHours = Math.floor(Math.random() * 20) + 1;
                const actualHours = Math.floor(Math.random() * estimatedHours);
                
                task.setEstimatedHours(estimatedHours);
                task.setActualHours(actualHours);
                
                // Property: Progress should be calculated correctly
                const expectedProgress = Math.min(100, (actualHours / estimatedHours) * 100);
                expect(task.progress).toBe(expectedProgress);
                
                // Property: Completed tasks should always show 100% progress
                task.markComplete();
                expect(task.progress).toBe(100);
            }
        });
    });

    describe('Due Date Properties', () => {
        test('Property 15: Overdue calculation is consistent', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Due Date Property Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // Test with past date (relative to mocked time 2024-01-01)
                const pastDate = new Date('2023-01-01');
                task.setDueDate(pastDate);
                
                // Property: Tasks with past due dates should be overdue (if not completed)
                expect(task.isOverdue).toBe(true);
                
                // Property: Completed tasks should never be overdue
                task.markComplete();
                expect(task.isOverdue).toBe(false);
                
                // Test with future date (relative to mocked time 2024-01-01)
                task.markIncomplete();
                const futureDate = new Date('2024-12-31');
                task.setDueDate(futureDate);
                
                // Property: Tasks with future due dates should not be overdue
                expect(task.isOverdue).toBe(false);
                
                // Property: Tasks without due dates should not be overdue
                task.clearDueDate();
                expect(task.isOverdue).toBe(false);
            }
        });
    });

    describe('Assignment Properties', () => {
        test('Property 16: Assignment maintains user relationships', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Assignment Property Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                const originalUserId = task.userId;
                
                // Assign to different users
                const assignees = ['user456', 'user789', 'user123'];
                const assignee = assignees[i % assignees.length];
                
                task.assignTo(assignee);
                
                // Property: Owner should never change through assignment
                expect(task.userId).toBe(originalUserId);
                
                // Property: Assignee should be updated
                expect(task.assignedTo).toBe(assignee);
                
                // Property: Reassigning to owner should work
                task.reassignToOwner();
                expect(task.assignedTo).toBe(originalUserId);
            }
        });
    });

    describe('Metamorphic Properties', () => {
        test('Property 17: Task cloning preserves properties but creates new identity', () => {
            for (let i = 0; i < 30; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Clone Property Task ${i}`,
                    priority: ['low', 'medium', 'high'][i % 3]
                });
                
                const originalTask = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                // Add some properties
                originalTask.addTag(`original-tag-${i}`);
                originalTask.setEstimatedHours(8);
                if (i % 2 === 0) originalTask.markComplete();
                
                const clonedTask = originalTask.clone();
                
                // Property: Clone should have different ID but same properties
                expect(clonedTask.id).not.toBe(originalTask.id);
                expect(clonedTask.title).toBe(originalTask.title);
                expect(clonedTask.description).toBe(originalTask.description);
                expect(clonedTask.userId).toBe(originalTask.userId);
                expect(clonedTask.priority).toBe(originalTask.priority);
                expect(clonedTask.tags).toEqual(originalTask.tags);
                expect(clonedTask.estimatedHours).toBe(originalTask.estimatedHours);
                
                // Property: Clone should be independent
                clonedTask.updateTitle('Modified Clone Title');
                expect(originalTask.title).not.toBe('Modified Clone Title');
            }
        });

        test('Property 18: Status changes maintain logical consistency', () => {
            for (let i = 0; i < 50; i++) {
                const taskData = TestDataFactory.createValidTaskData({
                    title: `Status Property Task ${i}`
                });
                
                const task = new Task(taskData.title, taskData.description, taskData.userId, taskData);
                
                const statuses = ['pending', 'in-progress', 'blocked', 'completed', 'cancelled'];
                const status = statuses[i % statuses.length];
                
                task.setStatus(status);
                
                // Property: Status and completion should be consistent
                if (status === 'completed') {
                    expect(task.completed).toBe(true);
                    expect(task.completedAt).not.toBeNull();
                } else {
                    expect(task.completed).toBe(false);
                    expect(task.completedAt).toBeNull();
                }
                
                expect(task.status).toBe(status);
            }
        });
    });
});