# 🚀 Quick Deployment Guide for Vercel

## ⚡ Fastest Way to Deploy

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy Backend
1. Go to https://vercel.com/new
2. Import your repository
3. **Root Directory**: `backend`
4. **Framework**: Other
5. Add these environment variables:
   - `MONGO_URI` = `mongodb+srv://laxmivardhan:Vardhan1234@cluster0.mmu3ymo.mongodb.net/hackathonDB?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET` = `hackathon_platform_secret_key_2024`
   - `VERCEL` = `true`
6. Click **Deploy**
7. **Copy the backend URL** (e.g., `https://your-backend-abc123.vercel.app`)

### Step 3: Deploy Frontend
1. Go to https://vercel.com/new (again)
2. Import the **same** repository
3. **Root Directory**: `frontend-nextjs`
4. **Framework**: Next.js
5. Add this environment variable:
   - `NEXT_PUBLIC_API_URL` = `<your-backend-url-from-step-2>/api`
     (e.g., `https://your-backend-abc123.vercel.app/api`)
6. Click **Deploy**
7. **Copy the frontend URL** (e.g., `https://your-frontend-xyz789.vercel.app`)

### Step 4: Update Backend CORS
1. Go back to your **backend** project on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add:
   - `FRONTEND_URL` = `<your-frontend-url-from-step-3>`
     (e.g., `https://your-frontend-xyz789.vercel.app`)
4. Go to **Deployments** tab
5. Click **Redeploy** on the latest deployment

### Step 5: Seed Admin User (Optional)
Run locally with production MongoDB:
```bash
cd backend
node seedAdmin.js
```

## ✅ Test Your Deployment
1. Visit your frontend URL
2. Register a new user
3. Login
4. Test creating a hackathon

## 📝 Important URLs to Save
- **Frontend**: `https://your-frontend-xyz789.vercel.app`
- **Backend**: `https://your-backend-abc123.vercel.app`
- **API Endpoint**: `https://your-backend-abc123.vercel.app/api`

## 🔧 Common Issues

**Issue**: MongoDB connection fails
**Fix**: Check MongoDB Atlas → Network Access → Allow from anywhere (0.0.0.0/0)

**Issue**: CORS errors
**Fix**: Make sure `FRONTEND_URL` is set in backend environment variables

**Issue**: 404 on API calls
**Fix**: Verify `NEXT_PUBLIC_API_URL` ends with `/api`

---

## 🎉 That's it! Your app is now live on Vercel!

Every time you push to `main` branch, Vercel will automatically redeploy both projects.
