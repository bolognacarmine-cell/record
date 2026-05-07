@echo off
echo ===================================
echo    AVVIO AGENDA VOCALE SMART
echo ===================================
echo.
echo Il browser si aprira automaticamente
echo.

echo [1] Avvio Backend (porta 4000)...
start "BACKEND - NON CHIUDERE" cmd /k "cd /d c:\Users\michele\Desktop\servizio\backend && echo Avvio server... && npm run dev"

timeout /t 4 /nobreak >nul

echo [2] Avvio Frontend (porta 3000)...
start "FRONTEND - NON CHIUDERE" cmd /k "cd /d c:\Users\michele\Desktop\servizio\frontend && echo Avvio app... && npm run dev"

timeout /t 4 /nobreak >nul

echo [3] Apertura browser...
start http://localhost:3000

echo.
echo ===================================
echo ✅ FATTO! App aperta nel browser
echo ===================================
echo.
echo ⚠️  IMPORTANTE: Lascia aperti i 2 terminali neri!
echo    NON chiuderli o l'app si ferma.
echo.
pause
