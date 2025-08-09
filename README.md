# 🏪 Store Rating Management System

### Credentails:- 

- Admin:- 
  email:- amarjeetchoudhary647@gmail.com
  password:- Manish@786

- StoreOwner:- 
  email:- amarjeetchoudhary6471@gmail.com
  password:- Manish@786

- User:- 
  email:- amarjeetchoudhary64711@gmail.com
  password:- Manish@786


A comprehensive full-stack application for managing store ratings, user authentication, and administrative operations. Built with React, Node.js, Express, and PostgreSQL.

## 🚀 Features

### 👥 User Management
- **Multi-role system**: System Admin, Store Owner, and Normal User
- **Secure authentication** with JWT tokens
- **Role-based access control** (RBAC)
- **Profile management** for all user types

### 🏪 Store Management
- **Store creation** and management by admins and store owners
- **Store discovery** for normal users
- **Store details** with comprehensive information
- **Store-owner association** system

### ⭐ Rating System
- **Rating submission** by normal users
- **Rating moderation** capabilities
- **Rating analytics** and insights
- **Review system** with detailed feedback

### 🛠️ Admin Dashboard
- **User management** (create, edit, delete, role assignment)
- **Store management** (create, edit, delete)
- **System analytics** and reporting
- **Content moderation** tools

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **React Hot Toast** for notifications
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### Database
- **PostgreSQL** as primary database
- **Prisma** as ORM for database operations
- **Migration system** for schema management

## 📁 Project Structure

```
d:/roxiler_system/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Authentication & validation
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema & migrations
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── assets/        # Static assets
│   └── package.json       # Frontend dependencies
└── README.md             # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd roxiler_system
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up the database**
```bash
cd ../backend
# Create .env file with your database credentials
cp .env.example .env
# Update .env with your database connection string

# Run database migrations
npx prisma migrate dev
npx prisma generate
```

5. **Start the development servers**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db"
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=5000
```

#### Frontend (.env)
```env
VITE_API_URL="http://localhost:5000/api"
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id/role` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Stores
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create store (admin/store owner)
- `PUT /api/stores/:id` - Update store (admin/store owner)
- `DELETE /api/stores/:id` - Delete store (admin/store owner)

### Ratings
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Create rating (normal user)
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

## 🎯 User Roles & Permissions

### System Admin
- Full system access
- User management (create, edit, delete)
- Store management (create, edit, delete)
- View all ratings and analytics

### Store Owner
- Manage their own stores
- View ratings for their stores
- Respond to ratings
- Update store information

### Normal User
- Browse stores
- Submit ratings and reviews
- Manage their own profile
- View their rating history

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
npm run build
npm start
```

### Docker Deployment
```bash
docker-compose up --build
```

## 📊 Database Schema

### Users
- id (UUID, Primary Key)
- name (String)
- email (String, Unique)
- password (String, Hashed)
- role (Enum: SYSTEM_ADMIN, STORE_OWNER, NORMAL_USER)
- address (String, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)

### Stores
- id (UUID, Primary Key)
- name (String)
- description (String)
- address (String)
- ownerId (UUID, Foreign Key to Users)
- createdAt (DateTime)
- updatedAt (DateTime)

### Ratings
- id (UUID, Primary Key)
- userId (UUID, Foreign Key to Users)
- storeId (UUID, Foreign Key to Stores)
- rating (Integer, 1-5)
- review (String, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@roxiler.com or join our Slack channel.
