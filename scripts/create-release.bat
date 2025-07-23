@echo off
echo Creating release for Closed Loop Maintenance PC Companion...
echo.

echo Step 1: Building the application...
npm run build

echo.
echo Step 2: Build complete!
echo.
echo Your executable is ready at: dist\Matrix Closed Loop Maintenance Setup 0.5.2.exe
echo.
echo Now you have 2 options:
echo.
echo OPTION A - Automatic Release (Recommended):
echo   Run: npm run build-and-publish
echo   (Make sure you have GH_TOKEN environment variable set)
echo.
echo OPTION B - Manual Release:
echo   1. Go to https://github.com/hadefuwa/closed-loop-maint/releases
echo   2. Click "Create a new release"
echo   3. Create a tag (e.g., v0.5.2)
echo   4. Upload the .exe file from the dist folder
echo.
echo Choose Option A for automatic release, or Option B for manual control.
echo.
pause 