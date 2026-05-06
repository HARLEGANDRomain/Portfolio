@echo off
set FFMPEG=C:\Users\rharl\ffmpeg-2026-04-30\bin\ffmpeg.exe
set IN=public\gwido\videos
set OUT=public\gwido\videos\optimised

mkdir %OUT% 2>nul

echo === Compression des videos Gwido ===
echo Cible : 720p max, CRF 28, preset slow
echo.

for %%f in (%IN%\*.mp4) do (
    echo Traitement : %%~nf.mp4
    "%FFMPEG%" -i "%%f" -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -movflags +faststart -y "%OUT%\%%~nf.mp4"
    echo    Termine.
    echo.
)

echo.
echo === Tailles originales ===
dir %IN%\*.mp4 /o:-s /-c | findstr "mp4"
echo.
echo === Tailles optimisees ===
dir %OUT%\*.mp4 /o:-s /-c | findstr "mp4"
echo.
echo Pour remplacer les originaux :
echo   xcopy /Y "%OUT%\*.mp4" "%IN%\"
echo.
pause
