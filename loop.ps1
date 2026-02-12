#Requires -Version 5.1
<#
.SYNOPSIS
    Ralph Wiggum Loop - Fresh context per iteration
.DESCRIPTION
    Repeatedly feeds prompts to Claude with fresh context each iteration.
    Progress is stored in files and git history, not in the LLM context window.
.EXAMPLE
    ./loop.ps1 plan       # Planning mode, unlimited
    ./loop.ps1 plan 5     # Planning mode, max 5 iterations
    ./loop.ps1 build      # Build mode, unlimited
    ./loop.ps1 build 20   # Build mode, max 20 iterations
#>

param(
    [ValidateSet("plan", "build")]
    [string]$Mode = "build",

    [ValidateRange(0, [int]::MaxValue)]
    [int]$MaxIterations = 0
)

$ErrorActionPreference = "Stop"

$PromptFile = switch ($Mode) {
    "plan"  { "PROMPT_plan.md" }
    "build" { "PROMPT_build.md" }
}

if (-not (Test-Path $PromptFile)) {
    Write-Error "Error: $PromptFile not found"
    exit 1
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Ralph Wiggum Loop" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor Cyan
Write-Host "Prompt: $PromptFile" -ForegroundColor Cyan
if ($MaxIterations -gt 0) {
    Write-Host "Max iterations: $MaxIterations" -ForegroundColor Cyan
}
Write-Host "==========================================" -ForegroundColor Cyan

$Iteration = 0

while ($true) {
    if ($MaxIterations -gt 0 -and $Iteration -ge $MaxIterations) {
        Write-Host ""
        Write-Host "Reached max iterations ($MaxIterations). Stopping." -ForegroundColor Yellow
        break
    }

    $Iteration++
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Iteration $Iteration (Mode: $Mode)" -ForegroundColor Green
    Write-Host (Get-Date -Format "yyyy-MM-dd HH:mm:ss") -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green

    # Fresh Claude session each iteration - context resets!
    Get-Content $PromptFile -Raw | claude -p `
        --dangerously-skip-permissions `
        --model sonnet

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Claude exited with code $LASTEXITCODE"
    }

    # Auto-commit progress after each iteration
    git add -A
    $staged = git diff --staged --quiet 2>&1
    if ($LASTEXITCODE -ne 0) {
        git commit -m "Ralph iteration $Iteration ($Mode mode)`n`nCo-Authored-By: Claude <noreply@anthropic.com>"
        Write-Host "Changes committed." -ForegroundColor Green
    } else {
        Write-Host "No changes to commit." -ForegroundColor DarkGray
    }

    Write-Host "Iteration $Iteration complete." -ForegroundColor Green
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Ralph loop finished after $Iteration iterations." -ForegroundColor Cyan
