# Commit Message Examples and Best Practices

## Overview

This document provides practical examples of good and bad commit messages, following the Conventional Commits specification. Use these examples as a reference when writing your own commit messages.

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types and Examples

### feat: New Features

#### Good Examples
```bash
feat: add task search functionality
feat(ui): implement dark mode toggle
feat(auth): add user authentication system
feat(api): create REST endpoints for tasks
feat(search): add advanced filtering options
```

#### With Body and Footer
```bash
feat(tasks): add collaborative task assignment

- Allow users to assign tasks to team members
- Add notification system for task assignments
- Implement permission checks for task access
- Update UI to show assigned users

Closes #123
Refs #456
```

#### Bad Examples
```bash
feat: stuff  # Too vague
feat: added some features  # Not descriptive
feat: Fixed the thing  # Wrong type (should be 'fix')
feat: ADD SEARCH FUNCTION  # All caps, not imperative mood
```

### fix: Bug Fixes

#### Good Examples
```bash
fix: resolve task deletion error
fix(storage): prevent data loss on page refresh
fix(ui): correct button alignment in mobile view
fix(validation): handle empty task titles properly
fix(api): return proper error codes for invalid requests
```

#### With Details
```bash
fix(tasks): resolve duplicate task creation bug

The task creation form was submitting multiple times when users
double-clicked the submit button. Added debouncing to prevent
duplicate submissions and disabled the button during processing.

Fixes #789
```

#### Bad Examples
```bash
fix: bug  # Not descriptive
fix: oops  # Too casual
fix: fixed it  # Doesn't explain what was fixed
fix: Bug in the code  # Capitalized, not specific
```

### docs: Documentation

#### Good Examples
```bash
docs: update API documentation
docs(readme): add installation instructions
docs(contributing): clarify code review process
docs: add JSDoc comments to utility functions
docs(changelog): update for version 2.1.0
```

#### Bad Examples
```bash
docs: updated stuff  # Not specific
docs: README  # Doesn't explain what changed
docs: Fixed typos  # Should be lowercase 'fix'
```

### style: Code Style Changes

#### Good Examples
```bash
style: fix indentation in task controller
style(css): improve button hover effects
style: remove trailing whitespace
style(js): apply consistent semicolon usage
style: format code according to style guide
```

### refactor: Code Refactoring

#### Good Examples
```bash
refactor: extract task validation into separate module
refactor(storage): simplify localStorage wrapper
refactor: improve error handling in API calls
refactor(ui): consolidate duplicate CSS rules
refactor: optimize task filtering algorithm
```

#### With Explanation
```bash
refactor(tasks): extract task creation logic

Moved task creation logic from TaskController to TaskService
to improve separation of concerns and make the code more testable.
No functional changes to the API.
```

### test: Testing

#### Good Examples
```bash
test: add unit tests for task validation
test(integration): add end-to-end user workflow tests
test: increase coverage for storage manager
test(ui): add tests for task creation form
test: mock external API calls in tests
```

### chore: Maintenance Tasks

#### Good Examples
```bash
chore: update dependencies to latest versions
chore(build): configure webpack for production
chore: add ESLint configuration
chore(ci): setup GitHub Actions workflow
chore: remove unused dependencies
```

### perf: Performance Improvements

#### Good Examples
```bash
perf: optimize task list rendering
perf(search): implement debounced search input
perf: lazy load task details
perf(storage): batch localStorage operations
perf: reduce bundle size by 15%
```

## Breaking Changes

### Format
```bash
feat!: change task API structure

BREAKING CHANGE: Task objects now use 'id' instead of '_id' property.
This affects all API responses and requires client updates.

Migration guide:
- Update all references from task._id to task.id
- Update database queries to use new field name
- Run migration script: npm run migrate:task-ids
```

### Alternative Format
```bash
feat(api)!: redesign task endpoints

- Change GET /tasks to return paginated results
- Rename POST /task to POST /tasks
- Update response format for consistency

BREAKING CHANGE: API endpoints have been redesigned for better REST compliance.
See MIGRATION.md for upgrade instructions.
```

## Scope Examples

### Common Scopes
- `ui`: User interface changes
- `api`: API-related changes
- `auth`: Authentication/authorization
- `storage`: Data storage and persistence
- `tests`: Test-related changes
- `docs`: Documentation changes
- `build`: Build system changes
- `ci`: Continuous integration changes

### Feature-Specific Scopes
- `tasks`: Task management features
- `users`: User management features
- `search`: Search functionality
- `notifications`: Notification system
- `reports`: Reporting features

## Multi-Line Commit Messages

### Template
```bash
type(scope): short description (50 chars max)

Longer explanation of the change, wrapped at 72 characters.
Explain what changed, why it changed, and any important details
about the implementation.

- List specific changes made
- Include any breaking changes
- Mention related issues or PRs

Closes #123
Refs #456
Co-authored-by: Jane Doe <jane@example.com>
```

### Real Example
```bash
feat(collaboration): implement task sharing system

Add ability for users to share tasks with team members and assign
tasks to specific users. Includes permission system to control
who can view, edit, and manage shared tasks.

Changes include:
- New CollaborativeTask model extending base Task
- CollaborationController for sharing operations
- Updated UI with share/assign buttons
- Permission-based access control
- Email notifications for task assignments

The sharing system supports three visibility levels:
- Private: Only creator can access
- Shared: Specific users can access
- Public: All team members can access

Closes #234
Refs #567, #890
Co-authored-by: John Smith <john@example.com>
```

## Commit Message Hooks

### Pre-commit Hook Example
Create `.git/hooks/commit-msg`:

```bash
#!/bin/sh
# Check commit message format

commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Format: type(scope): description"
    echo "Types: feat, fix, docs, style, refactor, test, chore, perf"
    echo "Example: feat(tasks): add search functionality"
    exit 1
fi
```

### Commit Message Template
Create `.gitmessage`:

```
# <type>[optional scope]: <description>
# 
# [optional body]
# 
# [optional footer(s)]

# Types:
# feat: A new feature
# fix: A bug fix
# docs: Documentation only changes
# style: Changes that do not affect the meaning of the code
# refactor: A code change that neither fixes a bug nor adds a feature
# perf: A code change that improves performance
# test: Adding missing tests or correcting existing tests
# chore: Changes to the build process or auxiliary tools

# Examples:
# feat(tasks): add search functionality
# fix(ui): resolve button alignment issue
# docs(readme): update installation instructions
```

Set as default template:
```bash
git config commit.template .gitmessage
```

## Interactive Rebase for Clean History

### Squashing Commits
```bash
# Combine last 3 commits
git rebase -i HEAD~3

# In editor, change 'pick' to 'squash' for commits to combine
pick abc1234 feat: add search input
squash def5678 fix: handle empty search
squash ghi9012 test: add search tests

# Result: One clean commit with all changes
```

### Rewriting Commit Messages
```bash
# Edit last 3 commit messages
git rebase -i HEAD~3

# Change 'pick' to 'reword' for commits to edit
reword abc1234 feat: add search functionality
pick def5678 fix: handle edge cases
pick ghi9012 test: add comprehensive tests
```

## Conventional Commits Tools

### Commitizen
Install and use commitizen for guided commit messages:

```bash
npm install -g commitizen
npm install -g cz-conventional-changelog

# Configure
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc

# Use
git cz  # Instead of git commit
```

### Commitlint
Automatically validate commit messages:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Configure
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

# Add to package.json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Best Practices Summary

### Do's
- ✅ Use imperative mood ("add feature" not "added feature")
- ✅ Keep first line under 50 characters
- ✅ Use lowercase for type and description
- ✅ Be specific and descriptive
- ✅ Reference issues and PRs when relevant
- ✅ Explain the "why" in the body for complex changes
- ✅ Use consistent formatting and conventions

### Don'ts
- ❌ Don't use vague messages like "fix stuff" or "update"
- ❌ Don't use past tense ("fixed" instead of "fix")
- ❌ Don't capitalize the first letter of description
- ❌ Don't end the subject line with a period
- ❌ Don't commit unrelated changes together
- ❌ Don't use commit messages to vent frustration
- ❌ Don't commit broken or untested code

## Quick Reference

### Common Patterns
```bash
# New feature
feat(scope): add new functionality

# Bug fix
fix(scope): resolve specific issue

# Documentation
docs: update relevant documentation

# Code style
style: improve code formatting

# Refactoring
refactor(scope): improve code structure

# Tests
test: add missing test coverage

# Maintenance
chore: update build configuration

# Performance
perf(scope): optimize specific operation
```

### Emergency Fixes
```bash
# Critical production fix
hotfix: resolve critical security vulnerability

# Or using conventional commits
fix!: patch critical authentication bypass

BREAKING CHANGE: All users must re-authenticate due to security update.
```

Remember: Good commit messages are a gift to your future self and your teammates! 🎁