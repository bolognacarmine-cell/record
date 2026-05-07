# 🚀 Deploy su Render.com (Solo Render - Gratuito)

## ✅ Vantaggi
- Tutto su un unico servizio (più semplice)
- Backend + Frontend insieme
- Gratuito con 512MB RAM

---

## 📋 Prerequisiti

1. Account **GitHub** (gratuito)
2. Account **Render.com** (gratuito) - registrati con GitHub
3. **MongoDB Atlas** - già configurato ✓

---

## 🔵 PASSO 1: Carica su GitHub

### 1.1 Crea repository su GitHub
1. Vai su https://github.com/new
2. **Repository name**: `agenda-vocale-smart`
3. Clicca **"Create repository"**

### 1.2 Carica il codice

**Opzione A - Da VS Code:**
1. Apri VS Code
2. Terminal → New Terminal
3. Esegui:
```bash
cd c:/Users/michele/Desktop/servizio
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/agenda-vocale-smart.git
git push -u origin main
```

**Sostituisci** `TUO_USERNAME` con il tuo username GitHub.

---

## 🔵 PASSO 2: Deploy Backend su Render

### 2.1 Vai su Render.com
- Apri: https://render.com
- Clicca **"Sign in with GitHub"**
- Autorizza l'accesso

### 2.2 Crea Web Service
1. Dashboard → **"New +"** → **"Web Service"**
2. Seleziona il repository `agenda-vocale-smart`
3. Clicca **"Connect"**

### 2.3 Configura il Backend
| Campo | Valore |
|-------|--------|
| **Name** | `agenda-vocale-backend` |
| **Root Directory** | `backend` ⚠️ IMPORTANTE |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### 2.4 Environment Variables
Clicca **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | `mongodb+srv://fermicarlo38_db_user:MdIHhOkMz6MMbz8k@cluster0.xitv3ti.mongodb.net/agenda_vocale_smart?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | Genera qui: https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new |
| `CORS_ORIGIN` | `https://agenda-vocale-frontend.onrender.com` (temporaneo, aggiorneremo dopo) |

### 2.5 Deploy
- Clicca **"Create Web Service"**
- Attendi 3-5 minuti (vedi i log in tempo reale)
- Quando finisce, copia l'URL (es: `https://agenda-vocale-backend.onrender.com`)
- Verifica: aggiungi `/api/health` → dovrebbe mostrare `{"ok":true}`

---

## 🟢 PASSO 3: Deploy Frontend su Render

### 3.1 Crea Static Site
1. Dashboard → **"New +"** → **"Static Site"**
2. Seleziona lo stesso repository `agenda-vocale-smart`
3. Clicca **"Connect"**

### 3.2 Configura il Frontend
| Campo | Valore |
|-------|--------|
| **Name** | `agenda-vocale-frontend` |
| **Root Directory** | `frontend` ⚠️ IMPORTANTE |
| **Build Command** | `npm install && npm run generate` |
| **Publish Directory** | `.output/public` |

### 3.3 Environment Variables
Aggiungi:

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `20` |
| `NUXT_PUBLIC_API_BASE` | `https://agenda-vocale-backend.onrender.com` (l'URL reale del backend) |

### 3.4 Deploy
- Clicca **"Create Static Site"**
- Attendi 3-5 minuti
- Copia l'URL generato (es: `https://agenda-vocale-frontend.onrender.com`)

---

## 🔗 PASSO 4: Collega i servizi

### 4.1 Aggiorna CORS sul backend
1. Torna su Render.com → il tuo backend
2. Vai su **"Environment"**
3. Modifica `CORS_ORIGIN` con l'URL reale del frontend:
   ```
   CORS_ORIGIN=https://tuo-frontend-xyz.onrender.com
   ```
4. Clicca **"Save Changes"**
5. Il backend si redeploya automaticamente

### 4.2 (Opzionale) Aggiorna frontend
Se vuoi cambiare il nome del frontend:
1. Settings → cambia il Name
2. Si aggiorna automaticamente l'URL

---

## ✅ Verifica finale

Apri l'URL del frontend nel browser:
1. **Registrazione** → Crea un account
2. **Login** → Entra
3. **Crea task** → Prova a creare un'attività
4. **Audio** → Registra una nota vocale (se funziona il microfono)

Se tutto funziona → 🎉 **Deploy riuscito!**

---

## 🛠️ Problemi comuni

### "Cannot connect to backend"
- Verifica `NUXT_PUBLIC_API_BASE` nel frontend
- Verifica che il backend sia "Live" (non "Deploying")

### "CORS error"
- Verifica `CORS_ORIGIN` nel backend = URL esatto del frontend
- Il backend deve redeployare dopo aver cambiato CORS

### "Build failed"
- Controlla i log su Render (molto dettagliati)
- Solito problema: dimenticare `npm install` nel build command

---

## 📝 Note importanti

### Piano Gratuito Render:
- ✅ Backend: si spegne dopo 15 min di inattività, si riattiva alla prima richiesta (cold start ~30s)
- ✅ Frontend: sempre online (static site)
- ✅ 100GB bandwidth/mese
- ✅ SSL automatico (HTTPS)

### Database:
- MongoDB Atlas gratuito: 512MB storage, sufficiente per test e uso personale

---

## 🎉 Fatto!

La tua Agenda Vocale Smart è online su:
- **Frontend**: https://tuo-frontend.onrender.com
- **Backend**: https://tuo-backend.onrender.com

Funziona su PC, tablet e smartphone Android (come PWA)!
