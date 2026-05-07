# Avvio Agenda Vocale Smart
$base = "c:\Users\michele\Desktop\servizio"

Write-Host "🚀 Avvio Agenda Vocale Smart..." -ForegroundColor Green

# MongoDB
Write-Host "[1/3] Avvio MongoDB..." -ForegroundColor Cyan
cd "$base"
docker compose up -d 2>$null
if ($?) { Write-Host "✅ MongoDB avviato" -ForegroundColor Green } else { Write-Host "⚠️ Docker/MongoDB non disponibile" -ForegroundColor Yellow }

# Backend
Write-Host "[2/3] Avvio Backend (porta 4000)..." -ForegroundColor Cyan
$backend = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$base\backend`" && npm run dev" -PassThru -WindowStyle Normal

# Frontend  
Write-Host "[3/3] Avvio Frontend (porta 3000)..." -ForegroundColor Cyan
$frontend = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$base\frontend`" && npm run dev" -PassThru -WindowStyle Normal

Write-Host "`n✅ Terminali aperti!" -ForegroundColor Green
Write-Host "📋 URL:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host "   Backend:  http://localhost:4000/api/health" -ForegroundColor Blue

# Attendi e verifica
Start-Sleep -Seconds 5
Write-Host "`n🔍 Verifica..." -ForegroundColor Cyan
try { Invoke-RestMethod -Uri "http://localhost:4000/api/health" -TimeoutSec 3 | Out-Null; Write-Host "✅ Backend OK" -ForegroundColor Green } catch { Write-Host "⏳ Backend in avvio..." -ForegroundColor Yellow }
try { (Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing).StatusCode | Out-Null; Write-Host "✅ Frontend OK" -ForegroundColor Green } catch { Write-Host "⏳ Frontend in avvio..." -ForegroundColor Yellow }

Write-Host "`nPremi un tasto per chiudere questo window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
