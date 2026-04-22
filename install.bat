@echo off
setlocal

echo ==========================================
echo Installation du Portfolio 3D Hexagonal
echo ==========================================
echo.

echo [1/2] Installation des dependances npm...

REM Force l'utilisation de cmd pour npm
cmd /c npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERREUR: L'installation a echoue.
    echo.
    echo Verifiez que Node.js est bien installe avec: node --version
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Installation terminee avec succes!
echo ==========================================
echo.
echo Pour lancer le projet, utilisez:
echo   start-dev.bat
echo.
pause
