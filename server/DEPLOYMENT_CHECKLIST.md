# ✅ Render Deployment Checklist

## Before Deployment

- [ ] **Code is pushed to GitHub**
- [ ] **`.env` file is in `.gitignore`** ✅ (already done)
- [ ] **All dependencies are in `package.json`** ✅ (already done)
- [ ] **Server runs locally** (`npm run server`)

## Render Setup

- [ ] **Create Render account** at [render.com](https://render.com)
- [ ] **Connect GitHub repository**
- [ ] **Create new Web Service**
  - Name: `core-access-api`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm run server:prod`
  - Plan: `Free`

## Environment Variables

- [ ] **Add `DATABASE_URL`** (your Neon PostgreSQL connection string)
- [ ] **Add `NODE_ENV`** = `production`

## After Deployment

- [ ] **Get your Render URL** (e.g., `https://core-access-api.onrender.com`)
- [ ] **Update `app/lib/config.ts`** with your Render URL
- [ ] **Test health endpoint**: `https://your-app.onrender.com/health`
- [ ] **Test from your mobile app**

## Troubleshooting

- **Build fails**: Check Render logs for missing dependencies
- **Database connection fails**: Verify `DATABASE_URL` is correct
- **CORS errors**: Update CORS origins in `server/index.ts`
- **App can't connect**: Check if Render URL is correct in `config.ts`
