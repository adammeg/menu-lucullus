#!/bin/bash

# Windows users: Use Command Prompt or PowerShell, run commands manually
# Unix/Mac users: Run this script

echo "Starting Lucullus La Goulette Menu System..."
echo "==========================================="

# Start backend
echo "Starting backend server..."
cd backend
npm install
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend with simple HTTP server
echo "Starting frontend server..."
cd ../frontend
echo "Frontend is ready at http://localhost:8000"
echo "Admin dashboard at http://localhost:8000/admin/"

# Open in browser
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:8000
elif command -v open > /dev/null; then
    open http://localhost:8000
fi

echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Keep script running
wait $BACKEND_PID
