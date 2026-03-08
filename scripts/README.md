# Git Validation Scripts

This directory contains validation scripts for enforcing Git Flow conventions.

## Scripts

### 1. Branch Name Validation

**PowerShell:**
```powershell
.\scripts\validate-branch.ps1 -BranchName "feature/student-crud"
```

**Bash:**
```bash
bash scripts/validate-branch.sh "feature/student-crud"
```

**Valid branch formats:**
- `feature/<name>` - Feature branches (lowercase, numbers, hyphens)
- `release/<version>` - Release branches (semantic versioning: X.Y.Z)
- `hotfix/<name>` - Hotfix branches (lowercase, numbers, hyphens)
- `main` - Main production branch
- `develop` - Development integration branch

### 2. Commit Message Validation

**PowerShell:**
```powershell
.\scripts\validate-commit.ps1 -CommitMessage "feat: add student CRUD"
```

**Bash:**
```bash
bash scripts/validate-commit.sh "feat: add student CRUD"
```

**Valid commit prefixes:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks

### 3. Tag Validation

**PowerShell:**
```powershell
.\scripts\validate-tag.ps1 -TagName "v1.0.0"
```

**Bash:**
```bash
bash scripts/validate-tag.sh "v1.0.0"
```

**Valid tag format:**
- `vMAJOR.MINOR.PATCH` (e.g., v1.0.0, v2.1.3)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

## Usage in Git Hooks

You can integrate these scripts into Git hooks for automatic validation:

### Pre-commit hook (validate commit message)
```bash
#!/bin/bash
COMMIT_MSG=$(cat $1)
bash scripts/validate-commit.sh "$COMMIT_MSG"
```

### Pre-push hook (validate branch name)
```bash
#!/bin/bash
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
bash scripts/validate-branch.sh "$BRANCH_NAME"
```

## Exit Codes

- `0` - Validation passed
- `1` - Validation failed
