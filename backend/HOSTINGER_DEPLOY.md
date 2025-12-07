# IKONGA Lifestyle Backend - Hostinger Deployment

## Build Configuration

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm run start:prod
```

**Port:** 3001

## Environment Variables

Add these in Hostinger hPanel:

```env
DATABASE_URL=postgresql://ikonga_user:YOUR_PASSWORD@localhost:5432/ikonga_db
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_MINIMUM_32_CHARACTERS
PORT=3001
NODE_ENV=production
```

## Post-Deployment Steps

After first deployment, run migrations via SSH:

```bash
cd /domains/your-domain.com/public_html/backend
npx prisma migrate deploy
```

## Domain Configuration

Create subdomain: `api.your-domain.com`
Point to this Node.js application

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check PostgreSQL service is running
- Test connection: `psql -U ikonga_user -d ikonga_db -h localhost`

### Build Fails
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Rebuild: `npm run build`

### Application Won't Start
- Check logs in hPanel
- Verify all environment variables are set
- Ensure port 3001 is available
