@echo off
echo.
echo ========================================
echo   GitHub Pages Deployment Helper
echo ========================================
echo.

echo This script will help you deploy to GitHub Pages
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo ✅ Git found: 
git --version

echo.
echo 📝 Follow these steps:
echo.
echo 1. Create a new repository on GitHub
echo 2. Name it something like 'college-admin-panel'
echo 3. Make it PUBLIC (required for free GitHub Pages)
echo 4. Copy the repository URL
echo.

set /p REPO_URL="Enter your GitHub repository URL (https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo ❌ Repository URL is required
    pause
    exit /b 1
)

echo.
echo 🔧 Initializing Git repository...

REM Initialize git if not already done
git init >nul 2>&1

REM Add all files
echo 📁 Adding files...
git add .

REM Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo ℹ️ No changes to commit
) else (
    echo 💾 Creating initial commit...
    git commit -m "Initial commit: College Admin Panel for GitHub Pages"
)

REM Add remote origin
echo 🔗 Adding remote repository...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 📋 Next steps:
    echo 1. Go to your GitHub repository
    echo 2. Click Settings → Pages
    echo 3. Select "GitHub Actions" as source
    echo 4. Your site will be at: https://username.github.io/repo-name
    echo.
    echo 🔄 Any future changes: just run 'git add . && git commit -m "update" && git push'
) else (
    echo.
    echo ❌ Failed to push to GitHub
    echo Check your repository URL and try again
)

echo.
pause
