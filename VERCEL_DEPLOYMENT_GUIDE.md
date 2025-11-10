# Vercel Deployment Guide

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- MongoDB Atlas connection string

## Deployment Steps

### Option 1: Deploy Both Frontend and Backend Together (Monorepo)

1. **Push your code to a Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your Git repository
   - Vercel will detect the configuration automatically

3. **Configure Environment Variables**
   
   **For Backend:**
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `FRONTEND_URL`: Your frontend Vercel URL (will be provided after deployment)
   - `VERCEL`: true

   **For Frontend:**
   - `NEXT_PUBLIC_API_URL`: Your backend Vercel URL + /api

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Deploy Frontend and Backend Separately (Recommended)

#### Deploy Backend First:

1. **Create a new project on Vercel**
   - Go to https://vercel.com/new
   - Select your repository
   - Set **Root Directory** to `backend`
   - Set **Framework Preset** to "Other"

2. **Add Environment Variables:**
   - `MONGO_URI`: `mongodb+srv://laxmivardhan:Vardhan1234@cluster0.mmu3ymo.mongodb.net/hackathonDB?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: `hackathon_platform_secret_key_2024`
   - `VERCEL`: `true`
   - `FRONTEND_URL`: (leave empty for now, update after frontend deployment)

3. **Deploy**
   - Click "Deploy"
   - Copy the deployed URL (e.g., `https://your-backend.vercel.app`)

#### Deploy Frontend Next:

1. **Create another project on Vercel**
   - Go to https://vercel.com/new
   - Select the same repository
   - Set **Root Directory** to `frontend-nextjs`
   - Set **Framework Preset** to "Next.js"

2. **Add Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.vercel.app/api`

3. **Deploy**
   - Click "Deploy"
   - Copy the deployed URL (e.g., `https://your-frontend.vercel.app`)

4. **Update Backend Environment Variable**
   - Go back to your backend project settings
   - Update `FRONTEND_URL` to `https://your-frontend.vercel.app`
   - Redeploy the backend

## Important Notes

1. **MongoDB Connection**: Ensure your MongoDB Atlas is configured to allow connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges.

2. **CORS**: The backend is configured to accept requests from your frontend URL.

3. **Environment Variables**: Never commit `.env` files. Use Vercel's environment variable settings.

4. **Custom Domains**: You can add custom domains in Vercel project settings.

5. **Automatic Deployments**: Vercel automatically deploys on git push to main branch.

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas network access settings
- Verify MONGO_URI is correct in Vercel environment variables

### Frontend can't reach backend API
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check browser console for CORS errors
- Ensure backend FRONTEND_URL matches your frontend domain

### 404 Errors on API routes
- Ensure vercel.json is properly configured
- Check that routes are correctly defined

## Testing Your Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Login with credentials
4. Test creating a hackathon
5. Check all CRUD operations work

## Admin Seeding

To seed an admin user in production:

1. Create a serverless function or run locally with production MongoDB:
   ```bash
   cd backend
   node seedAdmin.js
   ```

2. Or manually create an admin user in MongoDB Atlas console.

## Monitoring

- Use Vercel dashboard to monitor:
  - Deployment logs
  - Function logs
  - Analytics
  - Performance metrics

## Next Steps

- Set up custom domain
- Configure automatic deployments
- Set up monitoring and alerts
- Add staging environment
- Configure environment-specific variables
