@echo off
title ShadowKeep Desktop Console
cd /d "%~dp0"

echo ==================================================
echo   SHADOWKEEP SYSTEM CHECK
echo ==================================================

:: 1. Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! 
    echo Please install it from https://nodejs.org/
    pause
    exit
)

:: 2. Check for node_modules
if not exist "node_modules\" (
    echo [1/3] node_modules not found. Starting Installation...
    echo       This will show download progress below.
    echo       Please stay connected to the internet.
    echo.
    
    :: Running install visibly with info level logging
    call npm install --loglevel info
    
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Installation failed! Check your internet connection.
        pause
        exit
    )
    echo.
    echo [SUCCESS] All components downloaded.
) else (
    echo [1/3] Components already installed.
)

echo [2/3] Starting ShadowKeep Server...
:: We use 'start' for the server so it runs in the background
start "ShadowKeepServer" /min npm run dev

echo [3/3] Waiting for the interface to warm up...
:: Wait 5 seconds for Vite to start
timeout /t 5 /nobreak >nul

echo ==================================================
echo   LAUNCHING APP...
echo ==================================================
start chrome --app=http://localhost:3000

echo.
echo ShadowKeep is now running. 
echo - To stop the app, close this window.
echo - If the browser shows "Connection Refused", wait 5 seconds and refresh.
echo.
pause
taskkill /FI "WINDOWTITLE eq ShadowKeepServer*" /T /F >nul 2>&1
exit