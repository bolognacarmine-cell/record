@echo off
chcp 65001 >nul
echo 🚀 Avvio Agenda Vocale Smart...
echo.

echo [1/3] Avvio MongoDB...
cd /d "%~dp0"
docker compose up -d 2>nul && echo ✅ MongoDB avviato || echo ⚠️  MongoDB non disponibile (forse già attivo o Docker spento)

echo.
echo [2/3] Avvio Backend (porta 4000)...
start "BACKEND" cmd /k "cd /d "%~dp0\backend" && npm run dev"

echo.
echo [3/3] Avvio Frontend (porta 3000)...
start "FRONTEND" cmd /k "cd /d "%~dp0\frontend" && npm run dev"

echo.
echo ✅ Terminali aperti! Attendi qualche secondo...
echo.
echo 📋 URL disponibili:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:4000/api/health
echo.
pause
