@echo off
echo.
echo ========================================
echo   Quick Update & Deploy
echo ========================================
echo.

REM Check if git repository exists
if not exist ".git" (
    echo ❌ This is not a Git repository
    echo Run 'deploy-to-github.bat' first to set up GitHub Pages
    pause
    exit /b 1
)

echo 📝 Checking for changes...

REM Check if there are changes
git diff --quiet
if %errorlevel% equ 0 (
    git diff --cached --quiet
    if %errorlevel% equ 0 (
        echo ℹ️ No changes detected
        echo.
        set /p FORCE="Push anyway? (y/N): "
        if /i not "%FORCE%"=="y" (
            echo Cancelled
            pause
            exit /b 0
        )
    )
)

echo.
set /p MESSAGE="Enter commit message (or press Enter for default): "
if "%MESSAGE%"=="" (
    set MESSAGE=Update admin panel
)

echo.
echo 📁 Adding changes...
git add .

echo 💾 Committing changes...
git commit -m "%MESSAGE%"

echo 🚀 Pushing to GitHub...
git push

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully deployed!
    echo 🌐 Your admin panel will update in 2-3 minutes
    echo 📊 Check deployment status: GitHub repository → Actions tab
) else (
    echo.
    echo ❌ Failed to push changes
    echo Check your internet connection and try again
)

echo.
pause
