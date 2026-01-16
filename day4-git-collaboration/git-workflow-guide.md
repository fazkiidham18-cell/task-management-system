# Git Workflow Guide

## Overview
This guide outlines the Git workflow and best practices for the Task Management System project. Following these guidelines ensures consistent collaboration and maintains code quality.

## Table of Contents
- [Repository Setup](#repository-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review](#code-review)
- [Common Git Commands](#common-git-commands)
- [Troubleshooting](#troubleshooting)

## Repository Setup

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/your-org/task-management-system.git
cd task-management-system

# Install dependencies
npm install

# Verify setup
npm test
npm run dev
```

### Configure Git
```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable helpful colorization
git config --global color.ui auto

# Set up useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

## Branching Strategy

We use a **Feature Branch Workflow** with the following branch types:

### Branch Types

#### Main Branch (`main`)
- **Purpose**: Production-ready code
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Automatically deployed to production
- **Rules**: No direct commits, only merge through PRs

#### Feature Branches (`feature/feature-name`)
- **Purpose**: New features and enhancements
- **Naming**: `feature/task-search`, `feature/user-authentication`
- **Lifetime**: Created from `main`, merged back to `main`
- **Example**: `feature/add-task-filtering`

#### Bug Fix Branches (`fix/bug-description`)
- **Purpose**: Bug fixes and patches
- **Naming**: `fix/task-deletion-error`, `fix/validation-bug`
- **Lifetime**: Created from `main`, merged back to `main`
- **Example**: `fix/duplicate-task-creation`

#### Hotfix Branches (`hotfix/critical-fix`)
- **Purpose**: Critical production fixes
- **Naming**: `hotfix/security-patch`, `hotfix/data-loss-fix`
- **Lifetime**: Created from `main`, merged to `main` immediately
- **Example**: `hotfix/storage-corruption-fix`

#### Documentation Branches (`docs/topic`)
- **Purpose**: Documentation updates
- **Naming**: `docs/api-documentation`, `docs/setup-guide`
- **Lifetime**: Created from `main`, merged back to `main`
- **Example**: `docs/contributing-guide`

### Branch Workflow

#### 1. Starting New Work
```bash
# Switch to main and get latest changes
git checkout main
git pull origin main

# Create and switch to new feature branch
git checkout -b feature/task-search

# Verify you're on the correct branch
git branch --show-current
```

#### 2. Working on Your Branch
```bash
# Make your changes
# ... edit files ...

# Stage changes
git add .

# Commit with meaningful message
git commit -m "feat: add basic task search functionality"

# Push to remote
git push origin feature/task-search
```

#### 3. Keeping Branch Updated
```bash
# Fetch latest changes from main
git fetch origin main

# Rebase your branch on main (preferred)
git rebase origin/main

# Or merge main into your branch (alternative)
git merge origin/main

# Push updated branch
git push origin feature/task-search --force-with-lease
```

#### 4. Finishing Your Work
```bash
# Final rebase on main
git checkout main
git pull origin main
git checkout feature/task-search
git rebase origin/main

# Push final changes
git push origin feature/task-search --force-with-lease

# Create Pull Request through GitHub UI
# After PR is approved and merged, clean up
git checkout main
git pull origin main
git branch -d feature/task-search
git push origin --delete feature/task-search
```

## Commit Guidelines

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: Continuous integration changes

### Examples

#### Simple Commits
```bash
git commit -m "feat: add task search functionality"
git commit -m "fix: resolve task deletion bug"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for task validation"
git commit -m "refactor: improve task sorting algorithm"
```

#### Detailed Commits
```bash
git commit -m "feat(tasks): add advanced filtering options

- Add filter by due date range
- Add filter by creation date  
- Add combined filter functionality
- Update UI to show active filters

Closes #123"
```

#### Breaking Changes
```bash
git commit -m "feat!: change task API structure

BREAKING CHANGE: Task objects now use 'id' instead of '_id' property.
This affects all API responses and requires client updates."
```

### Commit Best Practices

#### Do's
- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("fix bug" not "fixes bug")
- Limit first line to 50 characters
- Reference issues and pull requests when relevant
- Make atomic commits (one logical change per commit)

#### Don'ts
- Don't commit broken code
- Don't commit commented-out code
- Don't commit temporary files or debug code
- Don't use vague messages like "fix stuff" or "update"
- Don't commit unrelated changes together

## Pull Request Process

### Before Creating a PR

#### 1. Self-Review Checklist
- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No console.log or debug statements
- [ ] No commented-out code
- [ ] Branch is up to date with main

#### 2. Pre-PR Commands
```bash
# Run tests
npm test

# Run linting
npm run lint

# Check code formatting
npm run format:check

# Build project
npm run build
```

### Creating a Pull Request

#### 1. Push Your Branch
```bash
git push origin feature/your-feature-name
```

#### 2. Create PR Through GitHub
- Go to the repository on GitHub
- Click "Compare & pull request"
- Fill out the PR template
- Add reviewers and labels
- Link related issues

#### 3. PR Template
```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Related Issues
Closes #123
```

### PR Review Process

#### For Authors
1. **Respond to feedback promptly**
2. **Make requested changes**
3. **Re-request review after changes**
4. **Keep PR updated with main branch**
5. **Be open to suggestions**

#### For Reviewers
1. **Review within 24-48 hours**
2. **Provide constructive feedback**
3. **Test the changes locally if needed**
4. **Approve when satisfied**
5. **Be respectful and helpful**

## Code Review

### Review Checklist

#### Functionality
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error conditions are handled gracefully
- [ ] No obvious bugs or logic errors

#### Code Quality
- [ ] Code is readable and well-organized
- [ ] Functions are appropriately sized
- [ ] Variable and function names are clear
- [ ] No code duplication
- [ ] Follows project conventions

#### Testing
- [ ] Adequate test coverage
- [ ] Tests are meaningful and test the right things
- [ ] Tests pass consistently
- [ ] No tests are disabled without good reason

#### Security
- [ ] No sensitive data exposed
- [ ] Input validation is present
- [ ] No obvious security vulnerabilities
- [ ] Dependencies are up to date

#### Performance
- [ ] No obvious performance issues
- [ ] Efficient algorithms used
- [ ] No memory leaks
- [ ] Database queries are optimized

### Review Comments

#### Giving Feedback
```markdown
# Suggestion
Consider using a Map instead of an object for better performance:
```javascript
const taskMap = new Map();
```

# Question
Why did you choose this approach over using the existing utility function?

# Nitpick (optional)
Minor: Consider adding a space after the comma for consistency.

# Praise
Great job handling the edge case where tasks might be null!
```

#### Receiving Feedback
- **Be receptive**: Feedback is meant to improve the code
- **Ask questions**: If you don't understand, ask for clarification
- **Explain decisions**: If you disagree, explain your reasoning
- **Make changes**: Address feedback promptly
- **Say thanks**: Appreciate the reviewer's time

## Common Git Commands

### Daily Workflow
```bash
# Check status
git status

# See what changed
git diff

# Stage specific files
git add file1.js file2.js

# Stage all changes
git add .

# Commit changes
git commit -m "feat: add new functionality"

# Push to remote
git push origin branch-name

# Pull latest changes
git pull origin main
```

### Branch Management
```bash
# List all branches
git branch -a

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Viewing History
```bash
# View commit history
git log --oneline

# View changes in a commit
git show commit-hash

# View file history
git log --follow filename

# View who changed what
git blame filename
```

### Undoing Changes
```bash
# Unstage files
git reset HEAD filename

# Discard local changes
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (safe for shared branches)
git revert commit-hash
```

## Troubleshooting

### Common Issues

#### Merge Conflicts
```bash
# When you encounter conflicts
git status  # See conflicted files

# Edit files to resolve conflicts
# Look for <<<<<<< ======= >>>>>>> markers

# After resolving conflicts
git add resolved-file.js
git commit -m "resolve merge conflicts"
```

#### Accidentally Committed to Wrong Branch
```bash
# Move commits to correct branch
git checkout correct-branch
git cherry-pick commit-hash

# Remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

#### Need to Change Last Commit Message
```bash
# If not pushed yet
git commit --amend -m "new commit message"

# If already pushed (use with caution)
git commit --amend -m "new commit message"
git push --force-with-lease origin branch-name
```

#### Accidentally Deleted Branch
```bash
# Find the commit hash
git reflog

# Recreate branch
git checkout -b recovered-branch commit-hash
```

### Getting Help
```bash
# Get help for any command
git help command-name
git command-name --help

# Quick reference
git help -a  # List all commands
git help -g  # List guides
```

## Best Practices Summary

### Repository Management
- Keep main branch stable and deployable
- Use descriptive branch names
- Delete merged branches promptly
- Keep commit history clean and meaningful

### Collaboration
- Communicate changes that affect others
- Review code thoroughly but kindly
- Respond to feedback promptly
- Keep PRs focused and reasonably sized

### Code Quality
- Test your changes before pushing
- Write meaningful commit messages
- Keep commits atomic and focused
- Document complex changes

### Security
- Never commit sensitive information
- Use .gitignore effectively
- Keep dependencies updated
- Review security implications of changes

Remember: Git is a powerful tool, but with great power comes great responsibility. When in doubt, ask for help! 🚀