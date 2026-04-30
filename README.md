# Hire Seek Pulse 🚀

A modern full-stack job recruitment platform that connects employers with potential candidates. Features real-time messaging, application tracking, and comprehensive dashboards for both applicants and employers.

## ✨ Features

### For Applicants

- 📝 Browse and search job listings
- 📤 Submit job applications
- 💬 Real-time chat with employers
- 📊 Personal dashboard to track applications
- 👤 Comprehensive profile management
- 🔔 Application status notifications

### For Employers

- 📢 Post and manage job listings
- 👥 View and filter candidate applications
- 💬 Real-time chat with applicants
- 📅 Schedule interviews
- 📊 Analytics dashboard
- 🔍 Advanced candidate search

### General Features

- 🔐 Secure authentication system
- 💬 Real-time messaging with Socket.IO
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time updates and notifications

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 15+ (React)
- **Styling:** Tailwind CSS
- **UI Components:** Custom component library (shadcn/ui)
- **State Management:** React Hooks
- **Real-time:** Socket.IO Client
- **File Upload:** UploadThing
- **Type Safety:** TypeScript

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Real-time:** Socket.IO
- **Authentication:** JWT

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/hire-seek-pulse.git
cd hire-seek-pulse
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables
# DATABASE_URL=postgresql://...
# JWT_SECRET=your-secret-key
# PORT=5000

# Run database migrations
npm run db:push

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local

# Configure your environment variables
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Start the development server
npm run dev
```

## 🗂️ Project Structure

```
hire-seek-pulse/
├── backend/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth and validation middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── socket/          # Socket.IO setup and events
│   └── server.ts        # Entry point
│
└── frontend/
    ├── src/
    │   ├── app/         # Next.js app directory
    │   │   ├── (applicant)/    # Applicant routes
    │   │   ├── (auth)/         # Authentication routes
    │   │   └── employer/       # Employer routes
    │   ├── components/  # React components
    │   ├── config/      # Configuration files
    │   ├── hooks/       # Custom React hooks
    │   └── lib/         # Utility functions
    └── public/          # Static assets
```

## 🎯 Usage

1. **Register/Login:** Create an account as an applicant or employer
2. **For Applicants:**
   - Complete your profile with skills and experience
   - Browse available job listings
   - Apply to jobs that match your profile
   - Chat with employers
   - Track your application status

3. **For Employers:**
   - Set up your company profile
   - Post job openings
   - Review candidate applications
   - Schedule interviews
   - Communicate with applicants

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hiresekpulse
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-app-id
```

## 📦 Available Scripts

### Backend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate migrations

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Drizzle ORM for the database toolkit
- shadcn/ui for the beautiful components
- Socket.IO for real-time functionality

---

⭐ Star this repo if you find it helpful!
