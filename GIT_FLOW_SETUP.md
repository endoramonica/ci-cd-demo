# Git Flow Setup Guide

## Branch Structure

This project follows the **Git Flow** branching model with the following structure:

### Protected Branches

1. **main** - Production-ready code
   - Only accepts merges from `release/*` and `hotfix/*` branches
   - All commits must be tagged with semantic versioning
   - Direct pushes are prohibited

2. **develop** - Integration branch for features
   - Accepts merges from `feature/*` branches
   - Source for `release/*` branches
   - Direct pushes are prohibited (use feature branches)

### Working Branches

3. **feature/\<name\>** - Feature development branches
   - Created from: `develop`
   - Merged into: `develop`
   - Naming: lowercase, numbers, hyphens only
   - Example: `feature/student-crud`, `feature/filter-sort`

4. **release/\<version\>** - Release preparation branches
   - Created from: `develop`
   - Merged into: `main` and `develop`
   - Naming: semantic versioning (X.Y.Z)
   - Example: `release/1.0.0`, `release/1.1.0`

5. **hotfix/\<name\>** - Emergency production fixes
   - Created from: `main`
   - Merged into: `main` and `develop`
   - Naming: lowercase, numbers, hyphens only
   - Example: `hotfix/fix-critical-validation`

## Branch Protection Rules

### For GitLab/GitHub Repository

Configure the following protection rules in your repository settings:

#### Main Branch Protection
- ✅ Require merge requests
- ✅ Require at least 1 approval
- ✅ Prevent direct pushes
- ✅ Require all discussions to be resolved
- ✅ Require passing CI/CD pipeline (if configured)

#### Develop Branch Protection
- ✅ Require merge requests
- ✅ Require at least 1 approval
- ✅ Prevent direct pushes
- ✅ Allow developers to merge

## Validation Scripts

Use the provided validation scripts to ensure compliance with naming conventions:

### Branch Name Validation
```powershell
# PowerShell
.\scripts\validate-branch.ps1 -BranchName "feature/my-feature"

# Bash
bash scripts/validate-branch.sh "feature/my-feature"
```

### Commit Message Validation
```powershell
# PowerShell
.\scripts\validate-commit.ps1 -CommitMessage "feat: add new feature"

# Bash
bash scripts/validate-commit.sh "feat: add new feature"
```

### Tag Validation
```powershell
# PowerShell
.\scripts\validate-tag.ps1 -TagName "v1.0.0"

# Bash
bash scripts/validate-tag.sh "v1.0.0"
```

## Workflow Examples

### Feature Development
```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/student-crud

# 2. Develop and commit with proper messages
git add .
git commit -m "feat: implement student CRUD operations"

# 3. Push and create merge request
git push origin feature/student-crud
# Create MR on GitLab/GitHub: feature/student-crud → develop

# 4. After review and approval, merge via MR
# 5. Delete feature branch after merge
```

### Release Process
```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# 2. Fix any bugs found during testing
git commit -m "fix: resolve validation issue"

# 3. Create MR to main
# Create MR: release/1.0.0 → main

# 4. After merge, tag the release
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 5. Back-merge to develop
git checkout develop
git merge main
git push origin develop
```

### Hotfix Process
```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/fix-critical-bug

# 2. Fix the critical bug
git commit -m "fix: resolve critical validation bug"

# 3. Create MR to main
# Create MR: hotfix/fix-critical-bug → main

# 4. After merge, tag the patch version
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix: critical validation bug"
git push origin v1.0.1

# 5. Back-merge to develop
git checkout develop
git merge main
git push origin develop
```

## Commit Message Convention

All commits must follow this format:

```
<type>: <description>

[optional body]

[optional footer]
```

### Valid Types
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks

### Examples
```
feat: add student CRUD functionality
fix: resolve validation error in student form
refactor: improve filter performance
docs: update README with setup instructions
chore: update dependencies
```

## Semantic Versioning

Tags must follow semantic versioning: `vMAJOR.MINOR.PATCH`

- **MAJOR** (v2.0.0): Breaking changes
- **MINOR** (v1.1.0): New features (backward compatible)
- **PATCH** (v1.0.1): Bug fixes (backward compatible)

## Current Branch Status

- ✅ `main` - Production branch (initialized)
- ✅ `develop` - Development branch (initialized)
- ✅ Validation scripts created
- ⏳ Branch protection rules (configure in repository settings)

## Next Steps

1. Configure branch protection rules in GitLab/GitHub repository settings
2. Create your first feature branch
3. Follow the Git Flow workflow for all development
4. Use validation scripts before pushing
5. Always create merge requests for code review

## Resources

- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
