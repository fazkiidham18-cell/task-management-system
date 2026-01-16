#!/bin/bash

# Git Repository Setup Script - Day 4 Implementation
# Creates a proper Git repository with example history and collaboration setup

set -e  # Exit on any error

echo "🚀 Setting up Git repository for Task Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory (where package.json is located)"
    exit 1
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if already a Git repository
if [ -d ".git" ]; then
    print_warning "This directory is already a Git repository."
    read -p "Do you want to reinitialize it? This will preserve your history. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping Git initialization."
    else
        print_info "Continuing with existing repository..."
    fi
else
    # Initialize Git repository
    print_info "Initializing Git repository..."
    git init
    print_status "Git repository initialized"
fi

# Configure Git if not already configured
if [ -z "$(git config --global user.name)" ] || [ -z "$(git config --global user.email)" ]; then
    print_warning "Git user configuration not found."
    echo "Please configure your Git identity:"
    
    read -p "Enter your name: " git_name
    read -p "Enter your email: " git_email
    
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
    
    print_status "Git user configuration set"
fi

# Set default branch name to main
git config init.defaultBranch main

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    print_info "Creating .gitignore file..."
    cp day4-git-collaboration/.gitignore . 2>/dev/null || cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Environment variables
.env
.env.test
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE and Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Build outputs
dist/
build/
temp/
tmp/

# Test artifacts
test-results/
screenshots/
videos/

# Backup files
*.bak
*.backup
*.old

# Local configuration files
config/local.json
config/development.json
config/production.json

# Database files
*.db
*.sqlite
*.sqlite3

# Temporary files
*.tmp
*.temp
EOF
    print_status ".gitignore file created"
fi

# Copy collaboration documentation if it doesn't exist
print_info "Setting up collaboration documentation..."

if [ ! -f "CONTRIBUTING.md" ]; then
    cp day4-git-collaboration/CONTRIBUTING.md . 2>/dev/null || print_warning "CONTRIBUTING.md template not found"
    print_status "CONTRIBUTING.md added"
fi

if [ ! -f "CODE_OF_CONDUCT.md" ]; then
    cp day4-git-collaboration/CODE_OF_CONDUCT.md . 2>/dev/null || print_warning "CODE_OF_CONDUCT.md template not found"
    print_status "CODE_OF_CONDUCT.md added"
fi

# Create GitHub templates directory
if [ ! -d ".github" ]; then
    mkdir -p .github/ISSUE_TEMPLATE
    mkdir -p .github/workflows
    print_status ".github directory structure created"
fi

# Create pull request template
if [ ! -f ".github/pull_request_template.md" ]; then
    cp day4-git-collaboration/pull-request-template.md .github/pull_request_template.md 2>/dev/null || cat > .github/pull_request_template.md << 'EOF'
## Description
Brief description of the changes in this PR

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation made
EOF
    print_status "Pull request template created"
fi

# Create issue templates
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]

## Additional Context
Add any other context about the problem here.
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description
A clear and concise description of what you want to happen.

## Problem Statement
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

## Proposed Solution
A clear and concise description of what you want to happen.

## Alternatives Considered
A clear and concise description of any alternative solutions or features you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.
EOF

print_status "Issue templates created"

# Create basic GitHub Actions workflow
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint --if-present
    
    - name: Run tests
      run: npm test --if-present
    
    - name: Build project
      run: npm run build --if-present
EOF

print_status "GitHub Actions workflow created"

# Stage all files for initial commit
print_info "Staging files for initial commit..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit. Repository may already be up to date."
else
    # Create initial commit if this is a new repository
    if [ -z "$(git log --oneline 2>/dev/null)" ]; then
        print_info "Creating initial commit..."
        git commit -m "feat: initial project setup with Day 1-4 implementation

- Add basic task management functionality (Day 1)
- Implement MVC architecture with Repository pattern (Day 2)
- Include comprehensive test suite with Jest (Day 3)
- Setup Git workflow and collaboration features (Day 4)
- Add team documentation and development guidelines
- Configure GitHub Actions for CI/CD
- Setup issue and PR templates for collaboration

This commit represents the complete implementation through Day 4
of the Software Engineering Shortcourse project."
        
        print_status "Initial commit created"
    else
        print_info "Adding collaboration setup commit..."
        git commit -m "feat: setup Git repository and collaboration workflow

- Add comprehensive .gitignore configuration
- Setup GitHub templates for issues and pull requests
- Add GitHub Actions CI/CD workflow
- Include collaboration documentation (CONTRIBUTING.md, CODE_OF_CONDUCT.md)
- Configure repository for team development
- Setup branch protection and review processes

Ready for team collaboration and development workflow."
        
        print_status "Collaboration setup commit created"
    fi
fi

# Create example branches to demonstrate workflow
print_info "Creating example branches to demonstrate Git workflow..."

# Create develop branch
git checkout -b develop 2>/dev/null || git checkout develop
print_status "Develop branch created/switched to"

# Create a feature branch with example work
git checkout -b feature/task-search 2>/dev/null || git checkout feature/task-search

# Add a simple example file to demonstrate the feature
cat > example-feature-work.md << 'EOF'
# Task Search Feature

This is an example feature branch demonstrating the Git workflow.

## Implementation Notes
- Add search input to task view
- Implement filtering logic in TaskController
- Add search method to TaskRepository
- Include tests for search functionality

## Status
- [x] Create feature branch
- [ ] Implement search UI
- [ ] Add backend logic
- [ ] Write tests
- [ ] Create pull request
EOF

git add example-feature-work.md
git commit -m "feat: add task search feature implementation plan

- Create implementation roadmap for search functionality
- Define UI and backend requirements
- Outline testing strategy
- Ready for development work"

print_status "Example feature branch created with sample work"

# Return to main branch
git checkout main

# Create example commit history
print_info "Creating example commit history..."

# Add some example commits to show good commit message practices
echo "# Task Management System

A collaborative task management application demonstrating software engineering principles.

## Features
- Task creation and management
- Team collaboration
- Git workflow integration
- Comprehensive testing

## Getting Started
\`\`\`bash
npm install
npm start
\`\`\`" > README.md

git add README.md
git commit -m "docs: add comprehensive README with project overview

- Include feature list and getting started guide
- Add installation and usage instructions
- Document project structure and goals
- Provide clear onboarding for new contributors"

# Add a changelog
cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Task search functionality (in progress)
- Advanced filtering options (planned)

## [1.4.0] - 2024-01-11

### Added
- Git workflow and collaboration features
- Team management system
- Comment and discussion features
- Real-time collaboration tools
- Comprehensive documentation

### Changed
- Enhanced task model with collaboration features
- Improved user management system
- Updated UI for team collaboration

## [1.3.0] - 2024-01-10

### Added
- Comprehensive test suite with Jest
- Property-based testing framework
- Integration tests for workflows
- Code coverage reporting

### Changed
- Improved error handling across all components
- Enhanced validation in models and services

## [1.2.0] - 2024-01-09

### Added
- MVC architecture implementation
- Repository pattern for data access
- Enhanced task model with categories and tags
- User management system

### Changed
- Refactored from basic structure to proper architecture
- Improved separation of concerns
- Enhanced data validation

## [1.1.0] - 2024-01-08

### Added
- Basic task CRUD operations
- Local storage persistence
- Simple UI for task management
- Basic validation and error handling

## [1.0.0] - 2024-01-07

### Added
- Initial project setup
- Basic development environment
- Project structure and build tools
EOF

git add CHANGELOG.md
git commit -m "docs: add changelog following conventional format

- Document all major releases and features
- Follow Keep a Changelog format
- Include semantic versioning information
- Track breaking changes and migrations"

# Create a tag for the current version
git tag -a v1.4.0 -m "Version 1.4.0: Git Workflow and Collaboration Features

Major release adding comprehensive collaboration features:
- Git workflow implementation
- Team management and collaboration tools
- Real-time commenting and discussions
- Activity tracking and notifications
- Comprehensive documentation and guidelines

This release completes Day 4 of the Software Engineering Shortcourse."

print_status "Version tag v1.4.0 created"

# Show the current status
print_info "Repository setup complete! Here's the current status:"
echo
git log --oneline --graph --all -10
echo

print_status "Git repository setup completed successfully!"
echo
print_info "Next steps:"
echo "  1. Connect to a remote repository:"
echo "     git remote add origin https://github.com/your-username/task-management-system.git"
echo "  2. Push to remote:"
echo "     git push -u origin main"
echo "     git push origin develop"
echo "     git push origin feature/task-search"
echo "     git push --tags"
echo "  3. Set up branch protection rules on GitHub"
echo "  4. Configure team access and permissions"
echo
print_info "Available branches:"
git branch -a
echo
print_info "Recent commits:"
git log --oneline -5
echo
print_status "Ready for team collaboration! 🎉"