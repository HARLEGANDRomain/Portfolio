@echo off
echo ==========================================
echo Demarrage du Portfolio 3D Hexagonal
echo ==========================================
echo.

if not exist "node_modules" (
    echo ATTENTION: Les dependances ne sont pas installees.
    echo Veuillez d'abord executer: install.bat
    echo.
    pause
    exit /b 1
)

echo Demarrage du serveur de developpement...
echo.
echo Le portfolio sera accessible a: http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur.
echo.

call npm run dev
