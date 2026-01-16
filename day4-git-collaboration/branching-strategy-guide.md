# Branching Strategy Guide

## Overview

This guide outlines the branching strategy for the Task Management System project. We use a **Feature Branch Workflow** that balances simplicity with collaboration needs, making it perfect for learning and small to medium-sized teams.

## Branching Model

### Main Branches

#### `main` Branch
- **Purpose**: Production-ready code
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Automatically deployed to production
- **Rules**: 
  - No direct commits allowed
  - All changes must come through Pull Requests
  - Must pass all CI checks before merging
  - Requires at least one code review approval

#### `develop` Branch (Optional)
- **Purpose**: Integration branch for features
- **Usage**: Used when multiple features need integration testing
- **Rules**: 
  - Features merge here first for integration testing
  - Periodically merged to `main` for releases
  - Optional for smaller projects

### Supporting Branches

#### Feature Branches (`feature/`)
- **Purpose**: New features and enhancements
- **Naming Convention**: `feature/description-of-feature`
- **Lifetime**: Created from `main`, merged back to `main`
- **Examples**:
  - `feature/task-search`
  - `feature/user-authentication`
  - `feature/task-comments`
  - `feature/dark-mode`

#### Bug Fix Branches (`fix/` or `bugfix/`)
- **Purpose**: Bug fixes and patches
- **Naming Convention**: `fix/description-of-bug`
- **Lifetime**: Created from `main`, merged back to `main`
- **Examples**:
  - `fix/task-deletion-error`
  - `fix/validation-bug`
  - `fix/memory-leak`

#### Hotfix Branches (`hotfix/`)
- **Purpose**: Critical production fixes
- **Naming Convention**: `hotfix/critical-issue`
- **Lifetime**: Created from `main`, merged to `main` immediately
- **Process**: Fast-tracked review and deployment
- **Examples**:
  - `hotfix/security-patch`
  - `hotfix/data-loss-fix`
  - `hotfix/critical-crash`

#### Documentation Branches (`docs/`)
- **Purpose**: Documentation updates
- **Naming Convention**: `docs/topic-or-section`
- **Lifetime**: Created from `main`, merged back to `main`
- **Examples**:
  - `docs/api-documentation`
  - `docs/setup-guide`
  - `docs/contributing-guide`

#### Chore Branches (`chore/`)
- **Purpose**: Maintenance tasks, dependency updates
- **Naming Convention**: `chore/task-description`
- **Examples**:
  - `chore/update-dependencies`
  - `chore/configure-eslint`
  - `chore/setup-ci`

## Branch Naming Conventions

### Format
```
<type>/<short-description>
```

### Rules
- Use lowercase letters
- Use hyphens to separate words
- Keep descriptions short but descriptive
- Use present tense verbs
- Be specific about the change

### Good Examples
```bash
feature/task-search
feature/user-profile-page
fix/duplicate-task-creation
fix/mobile-layout-issue
hotfix/security-vulnerability
docs/installation-guide
chore/update-jest-config
```

### Bad Examples
```bash
feature/stuff                    # Too vague
feature/TaskSearch              # Wrong case
fix/bug                         # Not descriptive
feature/add_search_functionality # Underscores instead of hyphens
fix/Fix-Bug-In-Tasks           # Wrong case, too verbose
```

## Workflow Processes

### Feature Development Workflow

#### 1. Start New Feature
```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/task-search

# Verify you're on the correct branch
git branch --show-current
```

#### 2. Develop Feature
```bash
# Make your changes
# ... edit files ...

# Stage and commit changes
git add .
git commit -m "feat: add basic search input component"

# Continue development with multiple commits
git add .
git commit -m "feat: implement search filtering logic"

git add .
git commit -m "test: add unit tests for search functionality"

# Push branch to remote
git push -u origin feature/task-search
```

#### 3. Keep Branch Updated
```bash
# Regularly sync with main to avoid conflicts
git fetch origin main

# Option 1: Rebase (preferred - cleaner history)
git rebase origin/main

# Option 2: Merge (alternative)
git merge origin/main

# Push updated branch
git push --force-with-lease origin feature/task-search
```

#### 4. Complete Feature
```bash
# Final sync with main
git checkout main
git pull origin main
git checkout feature/task-search
git rebase origin/main

# Push final changes
git push --force-with-lease origin feature/task-search

# Create Pull Request through GitHub UI
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feature/task-search
git push origin --delete feature/task-search
```

### Hotfix Workflow

#### 1. Create Hotfix Branch
```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/security-patch
```

#### 2. Implement Fix
```bash
# Make minimal changes to fix the issue
# ... edit files ...

git add .
git commit -m "hotfix: patch critical security vulnerability"
git push -u origin hotfix/security-patch
```

#### 3. Fast-Track Review
```bash
# Create PR with "hotfix" label
# Request immediate review
# Deploy as soon as approved
```

#### 4. Clean Up
```bash
# After merge and deployment
git checkout main
git pull origin main
git branch -d hotfix/security-patch
git push origin --delete hotfix/security-patch
```

## Branch Protection Rules

### Main Branch Protection
Configure these rules in GitHub:

```yaml
Branch Protection Rules for 'main':
  - Require pull request reviews before merging
  - Require status checks to pass before merging
  - Require branches to be up to date before merging
  - Require conversation resolution before merging
  - Restrict pushes that create files larger than 100MB
  - Do not allow bypassing the above settings
```

### Required Status Checks
- ✅ All tests pass (`npm test`)
- ✅ Linting passes (`npm run lint`)
- ✅ Build succeeds (`npm run build`)
- ✅ Security scan passes
- ✅ Code coverage meets threshold

## Merge Strategies

### 1. Merge Commit (Default)
```bash
# Creates a merge commit
git merge --no-ff feature/task-search
```
**Pros**: Preserves branch history, clear feature boundaries
**Cons**: More complex history graph

### 2. Squash and Merge (Recommended)
```bash
# Combines all commits into one
git merge --squash feature/task-search
git commit -m "feat: add task search functionality"
```
**Pros**: Clean linear history, single commit per feature
**Cons**: Loses individual commit history

### 3. Rebase and Merge
```bash
# Replays commits on top of main
git rebase main
git checkout main
git merge feature/task-search
```
**Pros**: Linear history, preserves individual commits
**Cons**: Can be complex with conflicts

### Recommended Strategy
- **Features**: Squash and merge for clean history
- **Hotfixes**: Regular merge to preserve urgency context
- **Documentation**: Squash and merge for simplicity

## Release Management

### Version Tagging
```bash
# Create release tag
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

### Release Branches (For Complex Projects)
```bash
# Create release branch for final testing
git checkout -b release/v1.2.0 main

# Make final adjustments
git commit -m "chore: bump version to 1.2.0"

# Merge to main and tag
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# Clean up
git branch -d release/v1.2.0
```

## Conflict Resolution

### Common Conflict Scenarios

#### 1. Merge Conflicts During Rebase
```bash
# When conflicts occur during rebase
git status  # See conflicted files

# Edit files to resolve conflicts
# Look for <<<<<<< ======= >>>>>>> markers

# After resolving conflicts
git add resolved-file.js
git rebase --continue

# If you want to abort
git rebase --abort
```

#### 2. Merge Conflicts During PR
```bash
# Update your branch with latest main
git checkout feature/your-feature
git fetch origin main
git rebase origin/main

# Resolve conflicts as above
# Push updated branch
git push --force-with-lease origin feature/your-feature
```

### Conflict Resolution Best Practices
1. **Communicate**: Let team know about complex conflicts
2. **Test**: Always test after resolving conflicts
3. **Review**: Have someone review conflict resolutions
4. **Document**: Note any important decisions in commit messages

## Team Collaboration Guidelines

### Branch Ownership
- **Feature branches**: Owned by the developer who created them
- **Shared branches**: Coordinate changes with team
- **Main branch**: Owned by maintainers

### Communication
- **Starting work**: Announce what you're working on
- **Large changes**: Discuss approach before starting
- **Conflicts**: Ask for help with complex conflicts
- **Reviews**: Be responsive to review feedback

### Code Review Process
1. **Self-review**: Review your own changes first
2. **Request review**: Assign appropriate reviewers
3. **Address feedback**: Respond to all comments
4. **Re-request review**: After making changes
5. **Merge**: Only after approval

## Automation and Tools

### Git Hooks
```bash
# Pre-commit hook to run tests
#!/bin/sh
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

### GitHub Actions Workflow
```yaml
name: CI
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: npm install
      - run: npm test
      - run: npm run lint
      - run: npm run build
```

### Branch Cleanup Automation
```bash
# Script to clean up merged branches
#!/bin/bash
git checkout main
git pull origin main

# Delete local branches that have been merged
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# Delete remote tracking branches that no longer exist
git remote prune origin
```

## Troubleshooting

### Common Issues

#### "Branch is behind main"
```bash
git checkout your-branch
git rebase origin/main
git push --force-with-lease origin your-branch
```

#### "Cannot delete branch"
```bash
# Force delete if branch is not merged
git branch -D branch-name

# Delete remote branch
git push origin --delete branch-name
```

#### "Accidentally committed to main"
```bash
# Move commits to feature branch
git branch feature/accidental-commits
git reset --hard HEAD~3  # Remove last 3 commits from main
git checkout feature/accidental-commits
```

### Getting Help
- Check Git documentation: `git help <command>`
- Ask team members for complex scenarios
- Use Git GUI tools for visual conflict resolution
- Practice with test repositories

## Best Practices Summary

### Do's ✅
- Keep branches focused on single features/fixes
- Use descriptive branch names
- Regularly sync with main branch
- Write clear commit messages
- Test before pushing
- Clean up merged branches
- Communicate with team about changes

### Don'ts ❌
- Don't commit directly to main
- Don't let branches get too far behind main
- Don't include unrelated changes in feature branches
- Don't force push to shared branches (use --force-with-lease)
- Don't ignore merge conflicts
- Don't leave branches unmerged for too long

## Quick Reference

### Essential Commands
```bash
# Branch management
git checkout -b feature/new-feature    # Create and switch to branch
git branch -d feature/old-feature      # Delete local branch
git push origin --delete branch-name   # Delete remote branch

# Syncing
git fetch origin main                  # Fetch latest main
git rebase origin/main                 # Rebase on main
git push --force-with-lease origin branch-name  # Safe force push

# Cleanup
git branch --merged                    # List merged branches
git remote prune origin                # Clean up remote references
```

### Branch Status Check
```bash
# See all branches and their status
git branch -vv

# See which branches are merged
git branch --merged main

# See which branches are not merged
git branch --no-merged main
```

Remember: A good branching strategy enables collaboration while maintaining code quality. When in doubt, communicate with your team! 🌟