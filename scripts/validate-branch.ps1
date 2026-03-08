# Branch naming validation script
# Valid patterns: feature/<name>, release/<version>, hotfix/<name>

param(
    [Parameter(Mandatory=$true)]
    [string]$BranchName
)

# Check if branch name matches valid patterns
$validPatterns = @(
    '^feature/[a-z0-9-]+$',
    '^release/[0-9]+\.[0-9]+\.[0-9]+$',
    '^hotfix/[a-z0-9-]+$'
)

$isValid = $false

# Check against patterns
foreach ($pattern in $validPatterns) {
    if ($BranchName -match $pattern) {
        $isValid = $true
        break
    }
}

# Also allow main and develop
if ($BranchName -eq "main" -or $BranchName -eq "develop") {
    $isValid = $true
}

if ($isValid) {
    Write-Host "Valid branch name: $BranchName" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Invalid branch name: $BranchName" -ForegroundColor Red
    Write-Host "Valid formats:"
    Write-Host "  - feature/<name> (lowercase, numbers, hyphens)"
    Write-Host "  - release/<version> (semantic versioning: X.Y.Z)"
    Write-Host "  - hotfix/<name> (lowercase, numbers, hyphens)"
    Write-Host "  - main"
    Write-Host "  - develop"
    exit 1
}
