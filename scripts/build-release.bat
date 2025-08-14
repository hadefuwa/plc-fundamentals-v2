@echo off
echo Building PLC Fundamentals Trainer PC Companion v0.5.0...
echo.

echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Building executable...
npm run build

echo.
echo Step 3: Build complete!
echo.
echo Executable location: dist\Matrix PLC Fundamentals Trainer Setup 0.5.0.exe
echo Size: ~166MB
echo.
echo To install: Run the setup file and follow the installation wizard.
echo.
pause 