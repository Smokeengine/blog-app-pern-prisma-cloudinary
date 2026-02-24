# Blog Application - PERN Stack

A full-stack blogging platform built with PostgreSQL, Express, React, and Node.js (PERN stack), featuring user authentication, post management, comments, and image uploads via Cloudinary.

## 🚀 Features

- **User Authentication** - Secure registration and login with JWT tokens and bcrypt password hashing
- **Post Management** - Create, read, update, and delete blog posts
- **Image Uploads** - Upload and manage post images using Cloudinary
- **Comments System** - Add and manage comments on blog posts
- **Protected Routes** - Secure routes requiring authentication
- **Responsive UI** - Built with React and Tailwind CSS
- **Pagination** - Efficient post browsing with react-paginate
- **Database ORM** - Prisma for type-safe database access

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.4 - UI library
- **React Router DOM** 7.13.0 - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Paginate** - Pagination component

### Backend
- **Node.js** with **Express** 5.2.1 - Server framework
- **Prisma** 5.22.0 - ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting and management
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
blog-app-pern-prisma-cloudinary/
├── blog_backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── cloudinary.js       # Cloudinary configuration
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT authentication middleware
│   │   └── routes/
│   │       ├── auth.js             # User registration routes
│   │       ├── login.js            # User login routes
│   │       ├── posts.js            # Post CRUD routes
│   │       ├── comment.js          # Comment routes
│   │       └── upload.js           # Image upload routes
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   ├── migrations/             # Database migrations
│   │   └── lib/
│   │       └── prisma.ts           # Prisma client instance
│   ├── app.js                      # Express server setup
│   └── package.json
│
└── blog_frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Input.jsx           # Reusable input component
    │   │   ├── Navbar.jsx          # Navigation bar
    │   │   ├── Postcards.jsx       # Blog post card component
    │   │   └── ProtectedRoutes.jsx # Route protection wrapper
    │   ├── pages/
    │   │   ├── Home.jsx            # Home page with post list
    │   │   ├── Login.jsx           # Login page
    │   │   ├── Register.jsx        # Registration page
    │   │   ├── CreatePost.jsx      # Create new post
    │   │   ├── UpdatePost.jsx      # Edit existing post
    │   │   └── Singlepost.jsx      # Single post view with comments
    │   ├── App.js                  # Main app component with routing
    │   └── index.js                # React entry point
    └── package.json
```

## 📊 Database Schema

### User Model
```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String?
  createdAt DateTime  @default(now())
  posts     Post[]
  comments  Comment[]
}
```

### Post Model
```prisma
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  image     String?
  published Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  authorId  Int
  author    User      @relation(fields: [authorId], references: [id])
  comments  Comment[]
}
```

### Comment Model
```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  postId    Int
  post      Post     @relation(fields: [postId], references: [id])
}
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd blog-app-pern-prisma-cloudinary
```

2. **Backend Setup**
```bash
cd blog_backend
npm install
```

3. **Frontend Setup**
```bash
cd blog_frontend
npm install
```

### Environment Variables

Create a `.env` file in the `blog_backend` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"

# JWT Secret
JWT_SECRET="your-secret-key-here"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Database Setup

1. **Run Prisma migrations**
```bash
cd blog_backend
npx prisma migrate dev
```

2. **Generate Prisma Client**
```bash
npx prisma generate
```

3. **(Optional) Open Prisma Studio to view your database**
```bash
npx prisma studio
```

### Running the Application

1. **Start the backend server**
```bash
cd blog_backend
npm run dev
```
Backend will run on `http://localhost:4000`

2. **Start the frontend development server**
```bash
cd blog_frontend
npm start
```
Frontend will run on `http://localhost:3000`

## 🔐 API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user and receive JWT token

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post by ID
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

### Comments
- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments` - Create new comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Upload
- `POST /api/upload` - Upload image to Cloudinary (protected)

## 🎨 Features Overview

### User Authentication
- Secure password hashing with bcrypt
- JWT-based authentication
- Protected routes on both frontend and backend
- Persistent login with localStorage

### Post Management
- Rich text content support
- Image upload and display
- Author attribution
- Timestamps for creation and updates
- Pagination for post lists

### Comments System
- Nested comments on posts
- Real-time comment display
- Delete functionality for comment authors
- User attribution for each comment

### Image Upload
- Cloudinary integration for reliable image hosting
- File validation
- Automatic image optimization
- Secure upload with authentication

## 🧪 Testing

Frontend testing with React Testing Library:
```bash
cd blog_frontend
npm test
```

## 📦 Build for Production

### Frontend Build
```bash
cd blog_frontend
npm run build
```
This creates an optimized production build in the `build` folder.

### Backend Production
For production deployment, consider:
- Setting `NODE_ENV=production`
- Using a process manager like PM2
- Implementing proper error handling and logging
- Setting up SSL/HTTPS
- Using environment-specific database URLs

## 🔒 Security Features

- **Password Hashing** - Bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Middleware validation
- **CORS Configuration** - Restricted origins
- **Input Validation** - Server-side validation
- **SQL Injection Prevention** - Prisma parameterized queries

## 🚀 Future Enhancements

- [ ] User profile pages
- [ ] Post categories and tags
- [ ] Search functionality
- [ ] Rich text editor (e.g., TinyMCE, Quill)
- [ ] Like/reaction system
- [ ] Email notifications
- [ ] Social sharing
- [ ] Admin dashboard
- [ ] Comment replies (nested comments)
- [ ] Draft posts functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Anurag Vemula**
- Portfolio: (https://anurag-s-portfolio-wi39.vercel.app/)
- GitHub: (https://github.com/Smokeengine)

## 🙏 Acknowledgments

- React team for the amazing library
- Prisma for the excellent ORM
- Cloudinary for image hosting
- All open-source contributors

---

Built with ❤️ using the PERN Stack
