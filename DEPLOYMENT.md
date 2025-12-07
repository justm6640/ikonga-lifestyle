# 🚀 IKONGA Lifestyle - Deployment Guide

## ✅ Pre-Deployment Checklist

Your project is now ready for Hostinger deployment with the following configurations:

### 📦 Build Scripts Configured

**Backend:**
- ✅ `npm install` - Install dependencies
- ✅ `npm run build` - Build NestJS application
- ✅ `npm run start:prod` - Start production server

**Frontend:**
- ✅ `npm install` - Install dependencies
- ✅ `npm run build` - Build Next.js application
- ✅ `npm start` - Start production server

### 📁 New Files Created

1. **`ecosystem.config.js`** - PM2 configuration for process management
2. **`deploy.sh`** - Automated deployment script
3. **`backend/.env.example`** - Backend environment template
4. **`frontend/.env.example`** - Frontend environment template

---

## 🎯 Deployment Steps on Hostinger

### 1. Connect to your VPS

```bash
ssh root@YOUR_VPS_IP
```

### 2. Install Node.js and dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

### 3. Setup PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE ikonga_db;
CREATE USER ikonga_user WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE ikonga_db TO ikonga_user;
\q
```

### 4. Clone and configure project

```bash
# Create user
adduser ikonga
usermod -aG sudo ikonga
su - ikonga

# Clone project
git clone https://github.com/justm6640/ikonga-lifestyle.git
cd ikonga-lifestyle

# Configure backend environment
cd backend
cp .env.example .env
nano .env  # Edit with your values

# Configure frontend environment
cd ../frontend
cp .env.example .env.local
nano .env.local  # Edit with your values
```

### 5. Build and deploy

```bash
cd ~/ikonga-lifestyle

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Or manually:
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# Frontend
cd ../frontend
npm install
npm run build

# Start with PM2
cd ..
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/ikonga
```

Add configuration (see hostinger_deployment.md for full config)

```bash
sudo ln -s /etc/nginx/sites-available/ikonga /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Setup SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

---

## 🔄 Update Deployment

To update your application after pushing changes to GitHub:

```bash
cd ~/ikonga-lifestyle
./deploy.sh
```

Or manually:
```bash
git pull origin main
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build
pm2 restart all
```

---

## 📊 Monitoring

```bash
# Check status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart apps
pm2 restart ikonga-backend
pm2 restart ikonga-frontend
```

---

## ⚙️ Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://ikonga_user:PASSWORD@localhost:5432/ikonga_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

---

## 🆘 Troubleshooting

**Build fails:**
```bash
# Clear node_modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Database connection error:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U ikonga_user -d ikonga_db -h localhost
```

**PM2 not starting:**
```bash
# Check logs
pm2 logs --lines 100

# Restart PM2
pm2 kill
pm2 start ecosystem.config.js
```

---

Your project is ready for deployment! 🎉
