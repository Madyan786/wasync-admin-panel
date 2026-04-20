@echo off
echo ========================================
echo   WASync Admin Panel - Clean Start
echo ========================================
echo.

echo [1/3] Killing existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Clearing build cache...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist "build" rmdir /s /q "build"

echo [3/3] Starting development server...
echo.
echo ✓ Server will start at http://localhost:3000
echo ✓ Press Ctrl+C to stop the server
echo.

npm start
