@echo off
echo.
echo ========================================
echo   College API Admin Panel Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo.
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🚀 Starting the admin panel server...
echo.
echo 📍 The admin panel will be available at: http://localhost:3000
echo 🔐 Use your API admin credentials to login
echo 🏥 API URL: https://collegeapi-mnni.onrender.com
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
