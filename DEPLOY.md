# 🚀 Deploy Agenda Vocale Smart (Cloud Gratuito)

## ✅ Prerequisiti

1. Account **GitHub** (gratuito) - per caricare il codice
2. Account **Render.com** (gratuito) - per il backend  
3. Account **Netlify** (gratuito) - per il frontend
4. **MongoDB Atlas** - già configurato ✓

---

## 📋 Passo 1: Prepara il codice

### 1.1 Aggiorna il file `frontend/.env.production`

Crea questo file con l'URL del backend:

```env
NUXT_PUBLIC_API_BASE=https://TUO-BACKEND-URL.onrender.com
```

**NOTA:** Dopo il primo deploy del backend, aggiornerai questo URL.

---

## 📦 Passo 2: Backend su Render.com

### 2.1 Vai su Render.com
- Apri: https://render.com
- Registrati con GitHub ("Sign up with GitHub")
- Conferma email

### 2.2 Crea nuovo Web Service
1. Dashboard → **"New +"** → **"Web Service"**
2. Scegli **"Build and deploy from a Git repository"**
3. Collega il tuo repository GitHub (se non c'è, carica prima su GitHub)
   - O usa "Upload your code" → carica la cartella `backend/`

### 2.3 Configura il servizio
| Campo | Valore |
|-------|--------|
| **Name** | `agenda-vocale-backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### 2.4 Aggiungi Environment Variables
Vai su **Environment** e aggiungi:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | `mongodb+srv://fermicarlo38_db_user:MdIHhOkMz6MMbz8k@cluster0.xitv3ti.mongodb.net/agenda_vocale_smart?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | (genera casuale: https://jwtsecret.com/generate) |
| `CORS_ORIGIN` | `https://TUO-FRONTEND.netlify.app` (aggiorna dopo deploy frontend) |

### 2.5 Deploy
- Clicca **"Create Web Service"**
- Attendi 2-3 minuti
- Copia l'URL generato (es: `https://agenda-vocale-backend.onrender.com`)
- Verifica: aggiungi `/api/health` all'URL → dovrebbe mostrare `{"ok":true}`

---

## 🌐 Passo 3: Frontend su Netlify

### 3.1 Vai su Netlify
- Apri: https://www.netlify.com
- Registrati con GitHub

### 3.2 Deploy
1. Dashboard → **"Add new site"** → **"Deploy manually"**
2. Trascina la cartella `frontend/` (o usa "Upload folder")
   - Oppure collega repository GitHub

### 3.3 Configura Build Settings
| Campo | Valore |
|-------|--------|
| **Build command** | `npm install && npm run generate` |
| **Publish directory** | `.output/public` |

### 3.4 Environment Variables
Vai su **Site settings** → **Environment variables**:

| Key | Value |
|-----|-------|
| `NUXT_PUBLIC_API_BASE` | `https://TUO-BACKEND-URL.onrender.com` (l'URL del backend) |

### 3.5 Deploy
- Clicca **"Deploy site"**
- Attendi 2-3 minuti
- Copia l'URL generato (es: `https://agenda-vocale.netlify.app`)

---

## 🔗 Passo 4: Collega Frontend ↔ Backend

### 4.1 Aggiorna CORS sul backend
Torna su Render.com → il tuo backend → **Environment**:

Modifica `CORS_ORIGIN` con l'URL reale del frontend Netlify:
```
CORS_ORIGIN=https://tuo-sito-xyz.netlify.app
```

### 4.2 Redeploy backend
- Clicca **"Manual Deploy"** → **"Clear build cache & deploy"**

---

## ✅ Verifica finale

Apri il frontend (URL Netlify) nel browser:
- Registrazione/Login dovrebbe funzionare
- Creare task dovrebbe funzionare
- Notifiche push (opzionale): richiede VAPID keys

---

## 🛠️ Troubleshooting

### Errore "Cannot connect to backend"
Verifica che `NUXT_PUBLIC_API_BASE` nel frontend punti correttamente al backend Render.

### Errore CORS
Verifica che `CORS_ORIGIN` nel backend includa esattamente l'URL del frontend.

### Build fallita
Controlla i log su Render/Netlify per errori specifici.

---

## 🎉 Fatto!

La tua Agenda Vocale Smart è online e accessibile da qualsiasi dispositivo!
