# Commit message validation script
# Valid prefixes: feat:, fix:, refactor:, docs:, chore:

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

# Check if commit message starts with valid prefix
$validPrefixes = @('feat:', 'fix:', 'refactor:', 'docs:', 'chore:')
$isValid = $false

foreach ($prefix in $validPrefixes) {
    if ($CommitMessage.StartsWith($prefix)) {
        $isValid = $true
        break
    }
}

if ($isValid) {
    Write-Host "Valid commit message: $CommitMessage" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Invalid commit message: $CommitMessage" -ForegroundColor Red
    Write-Host "Commit message must start with one of:"
    Write-Host "  - feat: (new feature)"
    Write-Host "  - fix: (bug fix)"
    Write-Host "  - refactor: (code refactoring)"
    Write-Host "  - docs: (documentation)"
    Write-Host "  - chore: (maintenance tasks)"
    Write-Host ""
    Write-Host "Example: feat: add student CRUD functionality"
    exit 1
}
