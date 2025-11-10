# ✅ Vercel Deployment Checklist

## Pre-Deployment Checklist

- [ ] Code is working locally
- [ ] All dependencies are installed
- [ ] Environment variables are documented
- [ ] `.gitignore` file is in place
- [ ] Code is committed to Git repository
- [ ] Repository is pushed to GitHub/GitLab/Bitbucket

## Deployment Checklist

### 1. Backend Deployment
- [ ] Created new Vercel project
- [ ] Set root directory to `backend`
- [ ] Set framework to "Other"
- [ ] Added `MONGO_URI` environment variable
- [ ] Added `JWT_SECRET` environment variable
- [ ] Added `VERCEL=true` environment variable
- [ ] Deployed successfully
- [ ] Copied backend URL: `_________________________________`

### 2. Frontend Deployment
- [ ] Created new Vercel project
- [ ] Set root directory to `frontend-nextjs`
- [ ] Set framework to "Next.js"
- [ ] Added `NEXT_PUBLIC_API_URL` environment variable with backend URL + `/api`
- [ ] Deployed successfully
- [ ] Copied frontend URL: `_________________________________`

### 3. Backend Configuration Update
- [ ] Went back to backend project settings
- [ ] Added `FRONTEND_URL` environment variable with frontend URL
- [ ] Redeployed backend

### 4. MongoDB Configuration
- [ ] MongoDB Atlas Network Access set to 0.0.0.0/0 (or Vercel IP ranges)
- [ ] Database user has proper permissions
- [ ] Connection string is correct

### 5. Testing
- [ ] Frontend loads without errors
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Token is stored in localStorage
- [ ] API calls work correctly
- [ ] Can create a hackathon (if admin)
- [ ] All CRUD operations work

### 6. Optional Steps
- [ ] Seeded admin user in production database
- [ ] Set up custom domain for frontend
- [ ] Set up custom domain for backend
- [ ] Configured automatic deployments
- [ ] Set up staging environment
- [ ] Added monitoring/analytics

## Post-Deployment

### URLs to Document
- Frontend URL: `_________________________________`
- Backend URL: `_________________________________`
- API Endpoint: `_________________________________`

### Admin Credentials
- Email: `_________________________________`
- Password: `_________________________________`

## Troubleshooting Completed

- [ ] Verified no CORS errors in browser console
- [ ] Checked Vercel function logs for errors
- [ ] Tested all user flows
- [ ] Mobile responsiveness verified
- [ ] Performance is acceptable

## Notes
```
Add any deployment notes here:




```

---

## 🎉 Deployment Complete!

**Share these URLs:**
- Live App: [Your Frontend URL]
- API Docs: [Your Backend URL]

**Next Steps:**
- Monitor performance in Vercel dashboard
- Set up error tracking (Sentry, LogRocket, etc.)
- Configure analytics
- Share with users!
