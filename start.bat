@echo off
REM Windows startup script for Lucullus Menu

echo Starting Lucullus La Goulette Menu System...
echo.

REM Start backend
echo Starting backend server on port 5000...
cd backend
call npm install
start cmd /k npm start

REM Wait for backend to start
timeout /t 3

REM Start frontend
echo Starting frontend server...
cd ..\
echo.
echo ============================================
echo Frontend is ready at http://localhost:8000
echo Admin dashboard at http://localhost:8000/admin/
echo Backend API at http://localhost:5000
echo ============================================
echo.

REM Open browser
start http://localhost:8000

echo Press any key to open a terminal for the frontend server...
pause

REM Start simple server for frontend
cd frontend
npx http-server . -p 8000
