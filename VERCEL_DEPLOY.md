# Vercel Deployment Instructions

## Quick Deploy

### 1. Backend Deployment

1. Go to https://vercel.com/new
2. Import repository: `vardhan303/hackathon2`
3. Settings:
   - **Root Directory**: `backend`
   - **Framework**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

4. Environment Variables (click "Add" for each):
   ```
   MONGO_URI = mongodb+srv://laxmivardhan:Vardhan1234@cluster0.mmu3ymo.mongodb.net/hackathonDB?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET = hackathon_platform_secret_key_2024
   FRONTEND_URL = * (update after frontend deployment)
   ```

5. Click **Deploy**
6. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

### 2. Frontend Deployment

1. Go to https://vercel.com/new (create new project)
2. Import same repository: `vardhan303/hackathon2`
3. Settings:
   - **Root Directory**: `frontend-nextjs`
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.vercel.app
   ```

5. Click **Deploy**
6. Copy your frontend URL (e.g., `https://your-frontend.vercel.app`)

### 3. Update Backend CORS

1. Go back to backend project settings
2. Update environment variable:
   ```
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
3. Redeploy backend

## Testing

- Backend: `https://your-backend.vercel.app/` - Should show API info
- Frontend: `https://your-frontend.vercel.app/` - Should load the app
- Test login/register functionality

## Troubleshooting

- If you get 404 errors, ensure Root Directory is correct
- If API calls fail, check CORS settings and NEXT_PUBLIC_API_URL
- Check Vercel function logs for backend errors
