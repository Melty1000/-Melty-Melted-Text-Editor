@echo off
echo Starting DiffEdit Development Server...
echo.

cd /d "%~dp0"

REM Install dependencies if needed
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Install framer-motion if not present
if not exist "node_modules\framer-motion\" (
    echo Installing framer-motion...
    call npm install framer-motion
    echo.
)

echo Launching dev server at http://localhost:5173
echo Press Ctrl+C to stop
echo.
call npm run dev
