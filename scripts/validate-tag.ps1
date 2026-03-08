# Tag validation script for semantic versioning
# Valid format: vMAJOR.MINOR.PATCH (e.g., v1.0.0, v2.1.3)

param(
    [Parameter(Mandatory=$true)]
    [string]$TagName
)

# Check if tag follows semantic versioning format
if ($TagName -match '^v[0-9]+\.[0-9]+\.[0-9]+$') {
    Write-Host "Valid tag: $TagName" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Invalid tag: $TagName" -ForegroundColor Red
    Write-Host "Tag must follow semantic versioning format: vMAJOR.MINOR.PATCH"
    Write-Host "Examples:"
    Write-Host "  - v1.0.0 (initial release)"
    Write-Host "  - v1.1.0 (minor version)"
    Write-Host "  - v1.1.1 (patch version)"
    Write-Host ""
    Write-Host "MAJOR: Breaking changes"
    Write-Host "MINOR: New features (backward compatible)"
    Write-Host "PATCH: Bug fixes (backward compatible)"
    exit 1
}
