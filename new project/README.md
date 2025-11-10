# Hackathon Management Platform

A full-stack web application for managing hackathons with role-based access control (Admin, Judge, User).

## 🏗️ Project Structure

```
├── backend/              # Node.js + Express API
├── frontend-nextjs/      # Next.js frontend (TypeScript)
└── frontend/            # Vite + React frontend (legacy)
```

## ✨ Features

- **User Management**: Registration, authentication, and role-based access
- **Admin Panel**: Manage users, hackathons, and judge requests
- **Hackathon Management**: Create, update, and manage hackathons
- **Judge System**: Request and approve judge roles
- **Dashboard**: Role-specific dashboards for users, judges, and admins

## 🚀 Quick Start (Local Development)

### Backend Setup
```bash
cd backend
npm install
# Create .env file with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup (Next.js)
```bash
cd frontend-nextjs
npm install
# Create .env.local with API URL
npm run dev
```

Visit `http://localhost:3001` for the frontend and `http://localhost:5000` for the backend API.

## 📦 Deployment on Vercel

**See [`DEPLOYMENT_QUICK_START.md`](DEPLOYMENT_QUICK_START.md) for step-by-step deployment guide.**

**Or see [`VERCEL_DEPLOYMENT_GUIDE.md`](VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.**

### Quick Deploy Summary:
1. Push code to GitHub
2. Deploy backend to Vercel (root: `backend`)
3. Deploy frontend to Vercel (root: `frontend-nextjs`)
4. Configure environment variables
5. Done! 🎉

## 🔧 Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

**Frontend:**
- Next.js 14 (TypeScript)
- React 18
- Tailwind CSS
- Axios for API calls
- Context API for state management

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
VERCEL=true
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=your_backend_url/api
```

## 🛡️ User Roles

- **User**: Register, view hackathons, submit requests
- **Judge**: Review and evaluate submissions
- **Admin**: Full access to manage platform

## 📚 API Endpoints

- `/api/auth/*` - Authentication routes
- `/api/hackathons/*` - Hackathon management
- `/api/judge/*` - Judge operations
- `/api/request/*` - Request management

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

ISC
