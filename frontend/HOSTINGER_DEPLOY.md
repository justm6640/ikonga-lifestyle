# IKONGA Lifestyle Frontend - Hostinger Deployment

## Build Configuration

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

**Port:** 3000

## Environment Variables

Add these in Hostinger hPanel:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NODE_ENV=production
```

⚠️ **Important:** Replace `api.your-domain.com` with your actual API subdomain

## Domain Configuration

Point your main domain `your-domain.com` to this Node.js application

## Troubleshooting

### API Connection Error
- Verify NEXT_PUBLIC_API_URL is correct
- Ensure backend is running and accessible
- Check CORS configuration in backend

### Build Fails
- Clear cache: `rm -rf .next node_modules package-lock.json`
- Reinstall: `npm install`
- Rebuild: `npm run build`

### Page Not Loading
- Check logs in hPanel
- Verify all environment variables are set
- Ensure port 3000 is available
- Check if build completed successfully

## Production Optimization

Next.js is automatically optimized for production with:
- ✅ Static page generation
- ✅ Image optimization
- ✅ Code splitting
- ✅ Minification
