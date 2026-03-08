#!/bin/bash

# Branch naming validation script
# Valid patterns: feature/<name>, release/<version>, hotfix/<name>

BRANCH_NAME=$1

if [ -z "$BRANCH_NAME" ]; then
    echo "Error: Branch name is required"
    exit 1
fi

# Check if branch name matches valid patterns
if [[ "$BRANCH_NAME" =~ ^feature/[a-z0-9-]+$ ]] || \
   [[ "$BRANCH_NAME" =~ ^release/[0-9]+\.[0-9]+\.[0-9]+$ ]] || \
   [[ "$BRANCH_NAME" =~ ^hotfix/[a-z0-9-]+$ ]] || \
   [[ "$BRANCH_NAME" == "main" ]] || \
   [[ "$BRANCH_NAME" == "develop" ]]; then
    echo "Valid branch name: $BRANCH_NAME"
    exit 0
else
    echo "Invalid branch name: $BRANCH_NAME"
    echo "Valid formats:"
    echo "  - feature/<name> (lowercase, numbers, hyphens)"
    echo "  - release/<version> (semantic versioning: X.Y.Z)"
    echo "  - hotfix/<name> (lowercase, numbers, hyphens)"
    echo "  - main"
    echo "  - develop"
    exit 1
fi
