# 🚀 Deploying CORE_ACCESS API to Render

## Prerequisites

- Render account (free at render.com)
- Neon PostgreSQL database (already set up)
- GitHub repository with your code

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done)
2. **Ensure your `.env` file is NOT committed** (it should be in `.gitignore`)

## Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)** and sign up/login
2. **Click "New +"** and select **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name:** `core-access-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server:prod`
   - **Plan:** `Free`

5. **Add Environment Variables:**
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon PostgreSQL connection string
   - **Key:** `NODE_ENV`
   - **Value:** `production`

6. **Click "Create Web Service"**

## Step 3: Update Your App

Once deployed, Render will give you a URL like: `https://core-access-api.onrender.com`

Update your app's API configuration to use this URL instead of localhost.

## Step 4: Test

1. **Check the health endpoint:** `https://your-app.onrender.com/health`
2. **Test authentication endpoints** from your mobile app
3. **Verify database connections** are working

## Environment Variables Needed

- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NODE_ENV`: Set to `production`
- `PORT`: Render will set this automatically

## Troubleshooting

- **Build fails:** Check that all dependencies are in `package.json`
- **Database connection fails:** Verify your `DATABASE_URL` is correct
- **CORS errors:** Update the CORS origins in `server/index.ts` to include your app's domain
