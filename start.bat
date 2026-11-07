@echo off
echo ==========================================
echo  Portfolio - serveur de developpement
echo ==========================================
echo.

if not exist "node_modules" (
    echo ATTENTION: Les dependances ne sont pas installees.
    echo Veuillez d'abord executer: install.bat
    echo.
    pause
    exit /b 1
)

echo Le portfolio sera accessible a: http://localhost:5173/Portfolio/
echo Appuyez sur Ctrl+C pour arreter le serveur.
echo.

call npm run dev
