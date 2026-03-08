#!/bin/bash

# Tag validation script for semantic versioning
# Valid format: vMAJOR.MINOR.PATCH (e.g., v1.0.0, v2.1.3)

TAG_NAME=$1

if [ -z "$TAG_NAME" ]; then
    echo "Error: Tag name is required"
    exit 1
fi

# Check if tag follows semantic versioning format
if [[ "$TAG_NAME" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Valid tag: $TAG_NAME"
    exit 0
else
    echo "Invalid tag: $TAG_NAME"
    echo "Tag must follow semantic versioning format: vMAJOR.MINOR.PATCH"
    echo "Examples:"
    echo "  - v1.0.0 (initial release)"
    echo "  - v1.1.0 (minor version)"
    echo "  - v1.1.1 (patch version)"
    echo ""
    echo "MAJOR: Breaking changes"
    echo "MINOR: New features (backward compatible)"
    echo "PATCH: Bug fixes (backward compatible)"
    exit 1
fi
