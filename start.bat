@echo off
echo Starting Dayflow HRMS Full Stack Application...
echo.

echo Starting MySQL Database...
echo Please ensure MySQL is running and your .env file is configured
echo.

echo Starting Server...
cd server
start "Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo Starting Client...
cd ../client
start "Client" cmd /k "npm start"

echo.
echo Both server and client are starting...
echo Server: http://localhost:4000
echo Client: http://localhost:3000
echo.
pause
