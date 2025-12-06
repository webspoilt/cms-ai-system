<div align="center">

# AI-Powered Content Management System

<img src="https://img.shields.io/badge/MERN-Stack-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack"/>
<img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
<img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"/>

<br/>

**A modern, AI-powered content management system built with the MERN stack**

[Live Demo](#demo) · [Features](#-features) · [Quick Start](#-quick-start) · [Documentation](#-api-documentation) · [Contributing](#-contributing)

<br/>

<a href="https://github.com/webspoilt/cms-ai-system">
  <img src="https://img.shields.io/github/stars/webspoilt/cms-ai-system?style=social" alt="GitHub stars"/>
</a>
<a href="https://github.com/webspoilt/cms-ai-system/fork">
  <img src="https://img.shields.io/github/forks/webspoilt/cms-ai-system?style=social" alt="GitHub forks"/>
</a>

</div>

---

## Table of Contents

- [About The Project](#about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## About The Project

**AI CMS** is a next-generation content management system that leverages artificial intelligence to revolutionize how you create, manage, and optimize digital content. Built with a modern MERN stack architecture, it combines the power of AI with an intuitive, beautifully designed interface.

### Who Is This For?

| User Type | Use Case |
|-----------|----------|
| **Content Creators** | Write blog posts with AI assistance, auto-generate SEO metadata |
| **Marketing Teams** | Create marketing copy at scale, analyze content performance |
| **Developers** | Headless CMS with clean REST API, easy to extend and customize |
| **Agencies** | Multi-user collaboration, client content management |
| **Startups** | Quick content deployment, built-in analytics |

### Why AI CMS?

- **Save Time** - AI generates content drafts, SEO tags, and translations automatically
- **Boost SEO** - Built-in optimization tools improve search rankings
- **Collaborate** - Real-time editing with your team
- **Scale** - Microservices architecture handles growth effortlessly
- **Customize** - Open source and fully extensible

---

## ✨ Features

### Core CMS Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Rich Text Editor** | WYSIWYG editor with markdown support, code blocks, and media embedding | ✅ Ready |
| **Media Library** | Upload, organize, and optimize images with automatic compression | ✅ Ready |
| **Categories & Tags** | Hierarchical content organization with color-coded categories | ✅ Ready |
| **Version Control** | Full revision history with diff view and one-click restore | ✅ Ready |
| **Content Scheduling** | Schedule posts for future publication with timezone support | ✅ Ready |
| **Multi-language** | i18n support with 20+ languages | ✅ Ready |
| **SEO Tools** | Meta tags, sitemap generation, structured data | ✅ Ready |

### AI-Powered Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Content Generation** | Generate articles, blog posts, and marketing copy using GPT-4 | ✅ Ready |
| **SEO Optimization** | AI analyzes and optimizes content for search engines | ✅ Ready |
| **Auto Translation** | Translate content to 50+ languages instantly | ✅ Ready |
| **Plagiarism Detection** | Check content originality before publishing | ✅ Ready |
| **Readability Analysis** | Get readability scores and improvement suggestions | ✅ Ready |
| **Image Alt Text** | Auto-generate accessible alt text for images | ✅ Ready |
| **Content Summarization** | Generate excerpts and social media snippets | ✅ Ready |

### Collaboration Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Real-time Editing** | Google Docs-style simultaneous editing | ✅ Ready |
| **Live Cursors** | See where teammates are working in real-time | ✅ Ready |
| **Comments & Mentions** | Inline commenting with @mentions | ✅ Ready |
| **Role-Based Access** | Admin, Editor, Author, Viewer roles | ✅ Ready |
| **Activity Feed** | Track all changes across your workspace | ✅ Ready |
| **Notifications** | Email and in-app notifications | ✅ Ready |

### Analytics & Insights

| Feature | Description | Status |
|---------|-------------|--------|
| **Traffic Dashboard** | Views, visitors, bounce rate, time on page | ✅ Ready |
| **Content Performance** | Track engagement per article | ✅ Ready |
| **Audience Insights** | Demographics, devices, locations | ✅ Ready |
| **Custom Reports** | Build and export custom analytics reports | ✅ Ready |
| **A/B Testing** | Test headlines and content variations | 🚧 Coming |

### Security Features

| Feature | Description | Status |
|---------|-------------|--------|
| **JWT Authentication** | Secure token-based authentication | ✅ Ready |
| **OAuth 2.0** | Login with Google, GitHub, LinkedIn | ✅ Ready |
| **Two-Factor Auth** | TOTP-based 2FA for enhanced security | ✅ Ready |
| **Rate Limiting** | Protection against brute force attacks | ✅ Ready |
| **Input Sanitization** | XSS and injection prevention | ✅ Ready |
| **CORS Configuration** | Secure cross-origin policies | ✅ Ready |

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with SSR/SSG | 14.0.4 |
| **React** | UI component library | 18.2.0 |
| **TypeScript** | Type-safe JavaScript | 5.3.3 |
| **Tailwind CSS** | Utility-first CSS framework | 3.3.6 |
| **Framer Motion** | Animation library | 10.16.16 |
| **React Query** | Server state management | 3.39.3 |
| **Socket.io Client** | Real-time communication | 4.7.4 |
| **Recharts** | Data visualization | 2.10.3 |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | JavaScript runtime | 18+ |
| **Express.js** | Web framework | 4.18.2 |
| **TypeScript** | Type-safe JavaScript | 5.3.3 |
| **Mongoose** | MongoDB ODM | 8.0.3 |
| **Socket.io** | WebSocket server | 4.7.4 |
| **Passport.js** | Authentication middleware | 0.7.0 |
| **Winston** | Logging library | 3.11.0 |

### Database & Cache

| Technology | Purpose | Version |
|------------|---------|---------|
| **MongoDB** | Primary database | 7.0 |
| **Redis** | Caching & sessions | 7.2 |
| **Elasticsearch** | Full-text search | 8.11 (optional) |

### DevOps & Tools

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **GitHub Actions** | CI/CD pipeline |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Jest** | Testing framework |

---

## 🏗 Architecture

### System Overview

```
                                    ┌─────────────────────────────────┐
                                    │         LOAD BALANCER           │
                                    │           (Nginx)               │
                                    └───────────────┬─────────────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    │                               │                               │
                    ▼                               ▼                               ▼
        ┌───────────────────┐           ┌───────────────────┐           ┌───────────────────┐
        │    FRONTEND       │           │    FRONTEND       │           │    FRONTEND       │
        │   (Next.js)       │           │   (Next.js)       │           │   (Next.js)       │
        │   Instance 1      │           │   Instance 2      │           │   Instance N      │
        └─────────┬─────────┘           └─────────┬─────────┘           └─────────┬─────────┘
                  │                               │                               │
                  └───────────────────────────────┼───────────────────────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────────────┐
                                    │         API GATEWAY             │
                                    │      (Express + JWT Auth)       │
                                    └───────────────┬─────────────────┘
                                                    │
                  ┌─────────────────┬───────────────┼───────────────┬─────────────────┐
                  │                 │               │               │                 │
                  ▼                 ▼               ▼               ▼                 ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │  AUTH SERVICE   │ │   AI SERVICE    │ │ CONTENT SERVICE │ │ANALYTICS SERVICE│
        │                 │ │                 │ │                 │ │                 │
        │ • User CRUD     │ │ • GPT Integration│ │ • CRUD Ops     │ │ • Metrics       │
        │ • JWT/OAuth     │ │ • SEO Analysis  │ │ • Versioning   │ │ • Reports       │
        │ • 2FA           │ │ • Translation   │ │ • Search       │ │ • Tracking      │
        │ • Sessions      │ │ • Summarization │ │ • Categories   │ │ • Dashboards    │
        └────────┬────────┘ └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
                 │                   │                   │                   │
                 └───────────────────┴───────────────────┴───────────────────┘
                                                  │
                          ┌───────────────────────┼───────────────────────┐
                          │                       │                       │
                          ▼                       ▼                       ▼
                ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
                │    MONGODB      │     │     REDIS       │     │   FILE STORAGE  │
                │   (Primary DB)  │     │    (Cache)      │     │   (S3/MinIO)    │
                └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              REQUEST FLOW                                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1. User Action          2. API Request         3. Auth Check                   │
│  ┌─────────┐            ┌─────────────┐        ┌─────────────┐                  │
│  │  User   │ ──────────>│   Next.js   │ ──────>│   Gateway   │                  │
│  │ Browser │            │  Frontend   │        │  + JWT Auth │                  │
│  └─────────┘            └─────────────┘        └──────┬──────┘                  │
│                                                       │                          │
│  6. Response             5. Format                4. Process                    │
│  ┌─────────┐            ┌─────────────┐        ┌──────▼──────┐                  │
│  │  User   │ <──────────│   Next.js   │ <──────│ Microservice│                  │
│  │ Browser │            │  Frontend   │        │   (CRUD)    │                  │
│  └─────────┘            └─────────────┘        └─────────────┘                  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Minimum Version | Check Command |
|-------------|-----------------|---------------|
| Node.js | 18.0.0 | `node --version` |
| npm | 9.0.0 | `npm --version` |
| Docker | 20.0.0 | `docker --version` |
| Git | 2.0.0 | `git --version` |

### Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/webspoilt/cms-ai-system.git
cd cms-ai-system
```

#### Step 2: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Open and edit with your values
nano .env  # or use any text editor
```

#### Step 3: Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend/auth
npm install
```

#### Step 4: Start the Application

**Option A: Using Docker (Recommended)**

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f
```

**Option B: Manual Start**

```bash
# Terminal 1: Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7.0

# Terminal 2: Start Redis
docker run -d -p 6379:6379 --name redis redis:7.2-alpine

# Terminal 3: Start Backend
cd backend/auth
npm run dev

# Terminal 4: Start Frontend
cd frontend
npm run dev
```

#### Step 5: Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3002 |
| API Health Check | http://localhost:3002/health |

---

## 📁 Project Structure

```
cms-ai-system/
│
├── frontend/                          # Next.js Frontend Application
│   ├── public/                        # Static files (images, fonts)
│   ├── src/
│   │   ├── app/                       # Next.js 14 App Router
│   │   │   ├── layout.tsx            # Root layout with providers
│   │   │   ├── page.tsx              # Dashboard home page
│   │   │   ├── content/              # Content management pages
│   │   │   ├── media/                # Media library pages
│   │   │   ├── analytics/            # Analytics dashboard
│   │   │   └── settings/             # User settings
│   │   │
│   │   ├── components/               # React Components
│   │   │   ├── ui/                   # Base UI (Button, Card, Input)
│   │   │   ├── layout/               # Layout (Sidebar, Header)
│   │   │   ├── tables/               # Data tables
│   │   │   ├── charts/               # Chart components
│   │   │   ├── modals/               # Modal dialogs
│   │   │   ├── providers/            # Context providers
│   │   │   └── activity/             # Activity components
│   │   │
│   │   ├── services/                 # API Service Layer
│   │   │   ├── api.ts               # Base API client (Axios)
│   │   │   ├── auth.ts              # Authentication service
│   │   │   ├── content.ts           # Content CRUD service
│   │   │   ├── media.ts             # Media upload service
│   │   │   ├── ai.ts                # AI service integration
│   │   │   └── analytics.ts         # Analytics service
│   │   │
│   │   ├── types/                    # TypeScript Definitions
│   │   │   └── index.ts             # All type definitions
│   │   │
│   │   ├── utils/                    # Utility Functions
│   │   │   └── index.ts             # Helpers (cn, formatDate, etc.)
│   │   │
│   │   └── styles/                   # Global Styles
│   │       └── globals.css          # Tailwind + custom CSS
│   │
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── next.config.js               # Next.js configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── package.json                 # Frontend dependencies
│
├── backend/                          # Node.js Backend Services
│   │
│   ├── auth/                         # Authentication Service
│   │   ├── src/
│   │   │   ├── config/              # Database & Redis config
│   │   │   ├── controllers/         # Route handlers
│   │   │   ├── middleware/          # Auth, validation, rate limit
│   │   │   ├── models/              # Mongoose schemas
│   │   │   ├── routes/              # Express routes
│   │   │   ├── services/            # Business logic
│   │   │   ├── utils/               # Helpers (logger, etc.)
│   │   │   └── index.ts             # App entry point
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ai/                           # AI Service (OpenAI integration)
│   ├── content/                      # Content Management Service
│   ├── analytics/                    # Analytics Service
│   ├── gateway/                      # API Gateway
│   └── package.json                 # Shared dependencies
│
├── docker-compose.yml               # Docker multi-container config
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── LICENSE                          # MIT License
└── README.md                        # This file
```

---

## 🔐 Environment Variables

### Required Variables

```bash
# ===========================================
# APPLICATION
# ===========================================
NODE_ENV=development                    # development | production | test
PORT=3002                               # Backend server port
FRONTEND_URL=http://localhost:3000      # Frontend URL for CORS

# ===========================================
# DATABASE
# ===========================================
MONGODB_URI=mongodb://localhost:27017/ai-cms

# ===========================================
# REDIS (Cache & Sessions)
# ===========================================
REDIS_URL=redis://localhost:6379

# ===========================================
# AUTHENTICATION
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

### Optional Variables

```bash
# ===========================================
# OAUTH PROVIDERS
# ===========================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# ===========================================
# AI SERVICES
# ===========================================
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4                      # gpt-4 | gpt-3.5-turbo

# ===========================================
# FILE STORAGE (S3 Compatible)
# ===========================================
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# ===========================================
# EMAIL (SMTP)
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourcms.com

# ===========================================
# MONITORING (Optional)
# ===========================================
SENTRY_DSN=your-sentry-dsn
```

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3002/api
Production:  https://your-domain.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login and get tokens | No |
| `POST` | `/auth/logout` | Logout and invalidate tokens | Yes |
| `POST` | `/auth/refresh` | Refresh access token | Yes |
| `GET` | `/auth/me` | Get current user profile | Yes |
| `POST` | `/auth/forgot-password` | Request password reset | No |
| `POST` | `/auth/reset-password` | Reset password with token | No |
| `POST` | `/auth/change-password` | Change current password | Yes |
| `POST` | `/auth/2fa/enable` | Enable two-factor auth | Yes |
| `POST` | `/auth/2fa/verify` | Verify 2FA code | Yes |

#### Example: Register User

```bash
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

#### Example: Login

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Content Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/content` | List all content (paginated) | Yes |
| `POST` | `/content` | Create new content | Yes |
| `GET` | `/content/:id` | Get single content by ID | Yes |
| `PATCH` | `/content/:id` | Update content | Yes |
| `DELETE` | `/content/:id` | Delete content | Yes |
| `POST` | `/content/:id/publish` | Publish content | Yes |
| `POST` | `/content/:id/unpublish` | Unpublish content | Yes |
| `POST` | `/content/:id/duplicate` | Duplicate content | Yes |
| `GET` | `/content/:id/revisions` | Get revision history | Yes |

#### Example: Create Content

```bash
curl -X POST http://localhost:3002/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Article",
    "content": "# Hello World\n\nThis is my first article.",
    "type": "article",
    "status": "draft",
    "tags": ["tutorial", "beginner"]
  }'
```

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/ai/generate` | Generate content with AI | Yes |
| `POST` | `/ai/optimize` | Optimize content for SEO | Yes |
| `POST` | `/ai/analyze` | Analyze content quality | Yes |
| `POST` | `/ai/translate` | Translate content | Yes |
| `POST` | `/ai/summarize` | Generate summary/excerpt | Yes |

#### Example: Generate Content

```bash
curl -X POST http://localhost:3002/api/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "article",
    "prompt": "Write a blog post about sustainable technology trends in 2024",
    "context": {
      "tone": "professional",
      "length": "medium",
      "targetAudience": "tech enthusiasts"
    }
  }'
```

### Media Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/media/upload` | Upload a file | Yes |
| `GET` | `/media` | List all media files | Yes |
| `GET` | `/media/:id` | Get file details | Yes |
| `PATCH` | `/media/:id` | Update file metadata | Yes |
| `DELETE` | `/media/:id` | Delete file | Yes |
| `POST` | `/media/:id/optimize` | Optimize image | Yes |

---

## 🗄 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String,              // Required, 2-50 chars
  email: String,             // Required, unique, lowercase
  password: String,          // Hashed, min 8 chars
  avatar: String,            // URL
  role: String,              // admin | editor | author | viewer
  isEmailVerified: Boolean,
  twoFactorEnabled: Boolean,
  preferences: {
    theme: String,           // light | dark | system
    notifications: Boolean,
    language: String
  },
  lastLogin: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Content Model

```javascript
{
  _id: ObjectId,
  title: String,             // Required
  slug: String,              // Auto-generated, unique
  content: String,           // Markdown/HTML
  excerpt: String,           // Short description
  type: String,              // article | page | post | landing
  status: String,            // draft | published | archived
  author: ObjectId,          // Reference to User
  category: ObjectId,        // Reference to Category
  tags: [String],
  featuredImage: ObjectId,   // Reference to Media
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  publishedAt: Date,
  scheduledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Deployment

### Free Hosting Options

| Service | Type | Free Tier | Best For |
|---------|------|-----------|----------|
| **Vercel** | Frontend | Unlimited | Next.js apps |
| **Railway** | Full Stack | $5/month credit | Quick deployment |
| **Render** | Backend | 750 hrs/month | API hosting |
| **MongoDB Atlas** | Database | 512MB | MongoDB hosting |
| **Upstash** | Redis | 10K cmds/day | Redis cache |
| **Cloudflare R2** | Storage | 10GB | File storage |

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Follow prompts to configure
```

### Deploy to Railway (Full Stack)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Deploy from GitHub
4. Add MongoDB service
5. Add Redis service
6. Configure environment variables
7. Deploy!

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

---

## 🗺 Roadmap

### Version 1.0 (Current)
- [x] User authentication (JWT + OAuth)
- [x] Content CRUD operations
- [x] Media library
- [x] AI content generation
- [x] Real-time collaboration
- [x] Analytics dashboard
- [x] Dark mode UI

### Version 1.1 (Q1 2025)
- [ ] GraphQL API support
- [ ] Advanced A/B testing
- [ ] Custom workflows
- [ ] Webhook integrations
- [ ] Content templates

### Version 1.2 (Q2 2025)
- [ ] Mobile app (React Native)
- [ ] Plugin system
- [ ] White-label support
- [ ] Multi-tenant architecture
- [ ] Advanced AI models (Claude, Gemini)

### Version 2.0 (Q3 2025)
- [ ] Headless CMS mode
- [ ] E-commerce integration
- [ ] Automated content pipelines
- [ ] Enterprise SSO (SAML)
- [ ] Custom AI model training

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/cms-ai-system.git
   ```
3. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make** your changes
5. **Test** your changes
   ```bash
   npm test
   ```
6. **Commit** your changes
   ```bash
   git commit -m "feat: add amazing feature"
   ```
7. **Push** to your fork
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open** a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code formatting |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Code Style

- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** strict mode

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

```
MIT License

Copyright (c) 2024 webspoilt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Contact

**webspoilt**

- GitHub: [@webspoilt](https://github.com/webspoilt)
- Repository: [cms-ai-system](https://github.com/webspoilt/cms-ai-system)

---

<div align="center">

### Show Your Support

If this project helped you, please consider giving it a star!

<a href="https://github.com/webspoilt/cms-ai-system">
  <img src="https://img.shields.io/github/stars/webspoilt/cms-ai-system?style=for-the-badge&color=yellow" alt="GitHub Stars"/>
</a>

<br/><br/>

**Made with ❤️ by [webspoilt](https://github.com/webspoilt)**

</div>
