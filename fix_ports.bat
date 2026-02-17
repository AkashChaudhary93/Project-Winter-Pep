@echo off
echo Cleaning up Campus Crave zombie processes...
taskkill /F /IM java.exe /T
taskkill /F /IM node.exe /T
echo.
echo SUCCESS: Ports cleared! You can now restart your terminals.
pause
