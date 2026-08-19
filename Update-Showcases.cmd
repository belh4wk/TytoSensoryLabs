@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 Resources\generate-showcase-manifests.py
) else (
  python Resources\generate-showcase-manifests.py
)
if errorlevel 1 (
  echo.
  echo Showcase manifest update FAILED.
  pause
  exit /b 1
)
echo.
echo Showcase manifests updated. Refresh the local page.
pause
