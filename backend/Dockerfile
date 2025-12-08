# ==========================
# 1) BUILD STAGE
# ==========================
FROM node:20 AS builder

WORKDIR /app

# Copier les fichiers de config npm
COPY package*.json ./

# Copier Prisma
COPY prisma ./prisma/

# Installer TOUTES les dépendances (dev + prod) pour pouvoir builder
RUN npm ci

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Builder l'application NestJS (génère dist/)
RUN npm run build


# ==========================
# 2) PRODUCTION STAGE
# ==========================
FROM node:20 AS production

WORKDIR /app

ENV NODE_ENV=production

# Copier uniquement les fichiers nécessaires pour installer les deps prod
COPY package*.json ./

# Installer seulement les dépendances de production
RUN npm ci --only=production

# Copier le build et Prisma depuis le builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Regénérer Prisma dans l'image finale (optionnel mais propre)
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start:prod"]

