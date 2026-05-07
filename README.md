# Agenda Vocale Smart (PWA)

Monorepo con:
- **frontend/**: Nuxt 3 mobile-first (PWA installabile su Android Chrome)
- **backend/**: Node.js + Express (REST API) + MongoDB (Mongoose + GridFS per audio)

## Avvio locale

1) Avvia MongoDB

```bash
docker compose up -d
```

2) Configura backend

- Copia [backend/.env.example](file:///c:/Users/michele/Desktop/servizio/backend/.env.example) in `backend/.env`
- Imposta almeno `JWT_SECRET`
- (Opzionale) Imposta `OPENAI_API_KEY` per trascrizione + analisi avanzata
- (Opzionale) Imposta VAPID per notifiche push

3) Avvia backend

```bash
cd backend
npm run dev
```

4) Configura e avvia frontend

- Copia [frontend/.env.example](file:///c:/Users/michele/Desktop/servizio/frontend/.env.example) in `frontend/.env`

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:4000/api/health

## Notifiche (Reminder)

Per abilitare notifiche push in PWA:

1) Genera chiavi VAPID

```bash
cd backend
npx web-push generate-vapid-keys
```

2) Copia `publicKey` e `privateKey` in `backend/.env` come `VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY`.

3) Avvia backend + frontend e, dalla Dashboard, premi **Abilita** nella sezione notifiche.

## Deploy (struttura pronta)

- Backend: Node (process manager o container) + MongoDB (managed o container)
- Frontend: build SSR o statico (a seconda del target). Per PWA su Android, SSR va benissimo con hosting Node.

"# record" 
"# record" 
