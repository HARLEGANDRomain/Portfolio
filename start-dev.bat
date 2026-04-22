@echo off
setlocal

echo ==========================================
echo Demarrage du Portfolio 3D Hexagonal
echo ==========================================
echo.

if not exist "node_modules" (
    echo ATTENTION: Les dependances ne sont pas installees.
    echo.
    echo Veuillez d'abord executer: install.bat
    echo.
    pause
    exit /b 1
)

echo Demarrage du serveur de developpement...
echo.
echo Le portfolio sera accessible a: http://localhost:5174
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur.
echo.

REM Force l'utilisation de cmd pour npm
cmd /c npm run dev
