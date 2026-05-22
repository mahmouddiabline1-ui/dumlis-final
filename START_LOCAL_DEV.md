# DUMLIS Local Development - Quick Start Guide

## 1. Start Backend Server (REQUIRED FIRST)

Open Terminal/PowerShell and run:

```bash
cd d:\desktop\dumlis\backend
python -m uvicorn app.main:app --port 8000 --reload
```

Wait until you see: **"Application startup complete"**

Then test it:
```bash
# In another terminal:
curl http://localhost:8000/health
```

You should see: `{"status":"healthy","version":"1.0.0"}`

## 2. Start Frontend Dev Server (After backend is running)

Open another Terminal/PowerShell:

```bash
cd d:\desktop\dumlis
npm run dev
```

Wait for message like: **"VITE v6.x ready in XXX ms"**
Then open: http://localhost:5173 (or the port shown)

## 3. Login with Test Accounts

- **Super Admin**: username: `president`, password: `admin`
- **Staff**: username: `affairs`, password: `affairs`
- **Student**: username: `student`, password: `student`

## 4. Test Faculty Data

After login, click each faculty in the sidebar to verify:
- Student lists (50 students per faculty)
- Courses (5 per faculty)
- Departments (5 per faculty)
- Programs/Majors

## Troubleshooting

### "Failed to fetch" error
- Backend server NOT running → Start it first (step 1)
- Wrong API URL → Check `.env.local` has `VITE_API_URL=http://localhost:8000`
- CORS blocked → Check backend console for CORS errors

### Backend won't start
- Port 8000 already in use → Kill process or use different port
- Database error → Check PostgreSQL is running

### Frontend won't start  
- Port 5173 in use → Vite will try 5174, 5175, etc (check console)
- Dependencies missing → Run `npm install` first

