#!/bin/bash

# Commit message validation script
# Valid prefixes: feat:, fix:, refactor:, docs:, chore:

COMMIT_MSG=$1

if [ -z "$COMMIT_MSG" ]; then
    echo "Error: Commit message is required"
    exit 1
fi

# Check if commit message starts with valid prefix
if [[ "$COMMIT_MSG" =~ ^(feat|fix|refactor|docs|chore): ]]; then
    echo "Valid commit message: $COMMIT_MSG"
    exit 0
else
    echo "Invalid commit message: $COMMIT_MSG"
    echo "Commit message must start with one of:"
    echo "  - feat: (new feature)"
    echo "  - fix: (bug fix)"
    echo "  - refactor: (code refactoring)"
    echo "  - docs: (documentation)"
    echo "  - chore: (maintenance tasks)"
    echo ""
    echo "Example: feat: add student CRUD functionality"
    exit 1
fi
