<#
.SYNOPSIS
    Stage all changes, commit with a message you provide, and push to the remote.

.USAGE
    .\push.ps1 "your commit message"
    (or run with no arguments and you'll be prompted for one)
#>

param(
    [Parameter(Position = 0)]
    [string]$Message
)

$ErrorActionPreference = "Stop"
$RepoPath = "c:\Users\user\Documents\DATA ANALYTICS"

if (-not $Message) {
    $Message = Read-Host "Commit message"
}

if (-not $Message) {
    Write-Host "Aborted: commit message cannot be empty." -ForegroundColor Red
    exit 1
}

git -C $RepoPath add -A
if (-not $?) { exit 1 }

# Nothing to commit is not an error - just skip straight to push.
$staged = git -C $RepoPath diff --cached --name-only
if (-not $staged) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    git -C $RepoPath commit -m $Message
    if (-not $?) { exit 1 }
}

$branch = git -C $RepoPath branch --show-current
git -C $RepoPath push origin $branch
if (-not $?) { exit 1 }

Write-Host "Pushed '$branch' to origin." -ForegroundColor Green
