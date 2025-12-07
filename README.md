# IKONGA Lifestyle

Application full-stack de coaching nutritionnel avec NestJS (backend) et Next.js (frontend).

## 🚀 Déploiement sur Hostinger

### Configuration pour l'hébergement Node.js Hostinger

**Build Command:**
```bash
npm run install:all && npm run prisma:generate && npm run build
```

**Start Command:**
```bash
npm start
```

**Port:** 3000 (frontend) et 3001 (backend)

### Variables d'environnement requises

#### Backend
- `DATABASE_URL` - URL de connexion PostgreSQL
- `JWT_SECRET` - Clé secrète pour JWT
- `PORT` - Port du backend (3001)
- `NODE_ENV` - production

#### Frontend
- `NEXT_PUBLIC_API_URL` - URL de l'API backend

---

## 📦 Installation locale

```bash
# Installer toutes les dépendances
npm run install:all

# Générer le client Prisma
npm run prisma:generate

# Build les deux applications
npm run build

# Démarrer en production
npm start
```

## 🛠️ Développement

```bash
# Backend
cd backend
npm run start:dev

# Frontend (dans un autre terminal)
cd frontend
npm run dev
```

## 📁 Structure du projet

```
ikonga-lifestyle/
├── backend/          # API NestJS
├── frontend/         # Application Next.js
├── package.json      # Configuration monorepo
└── ecosystem.config.js  # Configuration PM2 (pour VPS)
```

## 🔗 Technologies

- **Backend:** NestJS, Prisma, PostgreSQL, JWT
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Déploiement:** Hostinger Node.js ou VPS

---

Pour plus de détails sur le déploiement, consultez `DEPLOYMENT.md`.
