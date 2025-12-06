# AI-Powered Content Management System

A comprehensive, production-ready content management system with advanced AI capabilities, real-time collaboration, and modern architecture.

## 🚀 Features

### Core Features
- **Modern Frontend**: React.js with Next.js, TypeScript, and Tailwind CSS
- **Dark Mode First**: Sophisticated glassmorphism design with cyan/violet accents
- **AI-Powered Content**: GPT integration for content generation, SEO optimization, and analysis
- **Real-time Collaboration**: WebSocket-based collaborative editing with live cursors
- **Drag & Drop Builder**: Visual content editor with component-based architecture
- **Multi-language Support**: i18n with AI translation capabilities
- **Progressive Web App**: Offline access and mobile installation
- **Advanced Analytics**: Comprehensive dashboard with real-time metrics

### Architecture
- **Microservices**: Independent, scalable services (Auth, AI, Content, Analytics)
- **API Gateway**: Centralized routing and authentication
- **Event-Driven**: RabbitMQ for inter-service communication
- **Search Engine**: Elasticsearch for powerful content search
- **File Storage**: S3-compatible storage with CDN
- **Caching Layer**: Redis for performance optimization
- **Database**: MongoDB with proper indexing and sharding support

### Security & Performance
- **JWT + OAuth 2.0**: Multiple authentication methods
- **Rate Limiting**: DDoS protection and request throttling
- **Input Validation**: Comprehensive request sanitization
- **Error Handling**: Centralized error management
- **Logging**: Structured logging with Winston
- **Monitoring**: Prometheus + Grafana integration

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │  Load Balancer  │
│   (Next.js)     │◄──►│   (Express)      │◄──►│    (Nginx)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         │              ┌────────▼────────┐
         │              │   Microservices │
         │              ├─────────────────┤
         │              │ Auth Service    │
         │              │ AI Service      │
         │              │ Content Service │
         │              │ Analytics Svc   │
         │              └─────────────────┘
         │                       │
┌────────▼────────┐    ┌────────▼────────┐
│   WebSocket     │    │   Message Queue │
│   (Socket.io)   │    │   (RabbitMQ)    │
└─────────────────┘    └─────────────────┘
         │                       │
┌────────▼────────┐    ┌────────▼────────┐
│   Cache Layer   │    │   File Storage  │
│   (Redis)       │    │   (S3/MinIO)    │
└─────────────────┘    └─────────────────┘
         │                       │
┌────────▼────────┐    ┌────────▼────────┐
│   Database      │    │   Search Engine │
│   (MongoDB)     │    │ (Elasticsearch) │
└─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn
- **Docker** and Docker Compose
- **MongoDB** 7.0+
- **Redis** 7.2+
- **Elasticsearch** 8.11+
- **Git** for version control

### API Keys Required
- **OpenAI API Key** (for AI content generation)
- **Google Cloud** credentials (for image analysis)
- **OAuth Provider Keys** (Google, GitHub, LinkedIn)
- **SMTP** credentials (for email notifications)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/ai-cms.git
cd ai-cms
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all service dependencies
npm run setup
```

### 4. Start with Docker (Recommended)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Manual Setup (Alternative)
```bash
# Start databases
docker run -d --name mongo -p 27017:27017 mongo:7.0
docker run -d --name redis -p 6379:6379 redis:7.2-alpine
docker run -d --name elasticsearch -p 9200:9200 elasticsearch:8.11.0

# Start backend services
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

## 🚀 Running the Application

### Development Mode
```bash
# Start all services in development
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend services
```

### Production Mode
```bash
# Build all services
npm run build

# Start production servers
npm start
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
ai-cms/
├── frontend/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Reusable UI Components
│   │   ├── services/        # API Service Layer
│   │   ├── hooks/           # Custom React Hooks
│   │   ├── types/           # TypeScript Definitions
│   │   ├── utils/           # Utility Functions
│   │   └── styles/          # Global Styles
│   ├── public/              # Static Assets
│   ├── package.json
│   └── next.config.js
├── backend/                 # Node.js Microservices
│   ├── gateway/             # API Gateway
│   ├── auth/                # Authentication Service
│   ├── ai/                  # AI Content Service
│   ├── content/             # Content Management Service
│   ├── analytics/           # Analytics & Reporting Service
│   └── shared/              # Shared utilities
├── infrastructure/          # Deployment & DevOps
│   ├── docker/             # Docker configurations
│   ├── k8s/                # Kubernetes manifests
│   ├── terraform/          # Infrastructure as Code
│   └── monitoring/         # Monitoring setup
├── docs/                   # Documentation
├── scripts/                # Setup & utility scripts
└── tests/                  # Test suites
```

## 🔧 Configuration

### Environment Variables
Key environment variables you need to configure:

```bash
# Core Application
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-cms
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GITHUB_CLIENT_ID=your-github-client-id

# AI Services
OPENAI_API_KEY=sk-your-openai-key
GOOGLE_APPLICATION_CREDENTIALS=./config/google-credentials.json

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
```

### API Service Configuration
Each microservice can be configured independently:

```bash
# Auth Service
AUTH_PORT=3002
JWT_EXPIRES_IN=24h
SESSION_MAX_AGE=86400000

# AI Service
AI_PORT=3003
OPENAI_MODEL=gpt-4
HUGGING_FACE_API_KEY=your-hf-key

# Content Service
CONTENT_PORT=3004
UPLOAD_MAX_SIZE=10485760
SEARCH_ENGINE_URL=http://localhost:9200

# Analytics Service
ANALYTICS_PORT=3005
BATCH_SIZE=1000
REPORT_RETENTION_DAYS=30
```

## 🎯 Usage Guide

### 1. User Management
```javascript
// Register new user
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "author"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123",
  "rememberMe": true
}
```

### 2. Content Management
```javascript
// Create content
POST /api/content
{
  "title": "My Article",
  "content": "# Hello World",
  "type": "article",
  "categoryId": "category123",
  "status": "draft"
}

// Get content
GET /api/content/:id

// Update content
PATCH /api/content/:id
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### 3. AI Content Generation
```javascript
// Generate content
POST /api/ai/generate
{
  "type": "article",
  "prompt": "Write about sustainable technology",
  "context": {
    "targetAudience": "tech professionals",
    "tone": "professional",
    "length": "medium"
  }
}

// Optimize content for SEO
POST /api/ai/optimize
{
  "content": "Your article content...",
  "target": "seo",
  "keywords": ["sustainable", "technology", "innovation"]
}
```

### 4. Media Management
```javascript
// Upload file
POST /api/media/upload
Content-Type: multipart/form-data
file: [binary data]

// Get media files
GET /api/media?page=1&limit=20&type=image

// Search media
GET /api/media/search?q=logo&type=image
```

## 🧪 Testing

### Run All Tests
```bash
npm test

# Or run individually
npm run test:frontend
npm run test:backend
npm run test:auth
npm run test:ai
npm run test:content
npm run test:analytics
```

### Test Coverage
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### API Testing
```bash
# Test with Postman collection
npm run test:api

# Or use the provided test scripts
./scripts/test-api.sh
```

## 📊 Monitoring & Analytics

### Health Checks
```bash
# Check all service health
curl http://localhost:3001/health

# Individual service health
curl http://localhost:3002/health  # Auth
curl http://localhost:3003/health  # AI
curl http://localhost:3004/health  # Content
curl http://localhost:3005/health  # Analytics
```

### Monitoring Dashboard
- **Grafana**: http://localhost:3006 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **Redis Commander**: http://localhost:8081
- **Elasticsearch**: http://localhost:9200

### Performance Monitoring
- **Application Performance**: Built-in metrics
- **Database Performance**: MongoDB/Redis monitoring
- **API Performance**: Response time tracking
- **Resource Usage**: CPU/Memory/Network monitoring

## 🚀 Deployment

### Docker Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale content=3
```

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/k8s/

# Check deployment status
kubectl get pods -n ai-cms
kubectl get services -n ai-cms
```

### AWS/GCP Deployment
```bash
# Using Terraform for infrastructure
cd infrastructure/terraform
terraform init
terraform plan
terraform apply

# Deploy with CI/CD
./scripts/deploy.sh production
```

### Environment-Specific Configurations
- **Development**: Local Docker setup
- **Staging**: Cloud staging environment
- **Production**: High-availability cloud deployment

## 🔒 Security

### Security Features
- **Authentication**: JWT + OAuth 2.0 + 2FA
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Comprehensive request sanitization
- **Rate Limiting**: DDoS protection and request throttling
- **Security Headers**: Helmet.js integration
- **CORS Configuration**: Proper cross-origin setup
- **SQL Injection Prevention**: Parameterized queries

### Security Checklist
- [ ] Change default passwords
- [ ] Configure SSL certificates
- [ ] Set up proper firewall rules
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Implement backup strategy
- [ ] Set up monitoring alerts
- [ ] Security penetration testing

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code linting rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Conventional Commits**: Standardized commit messages

### Development Guidelines
- Write comprehensive tests
- Follow the established architecture patterns
- Document all public APIs
- Ensure responsive design
- Optimize for performance
- Follow accessibility guidelines

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for better loading
- **Image Optimization**: Next.js Image component
- **Caching**: Service worker and HTTP caching
- **Bundle Analysis**: Webpack bundle analyzer
- **Core Web Vitals**: Optimized for performance

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB queries
- **Caching Strategy**: Redis for frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for API responses
- **Load Balancing**: Horizontal scaling support

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MongoDB status
docker logs mongo

# Check MongoDB connection
mongosh --host localhost:27017

# Reset database
docker-compose down -v
docker-compose up -d mongo
```

#### Redis Connection Issues
```bash
# Check Redis status
docker logs redis

# Test Redis connection
redis-cli ping
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod +x scripts/*.sh
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=ai-cms:* npm run dev

# API debugging
curl -v http://localhost:3001/health

# Database debugging
mongosh --eval "db.runCommand('serverStatus')"
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Content Endpoints
- `GET /api/content` - List content with pagination
- `POST /api/content` - Create new content
- `GET /api/content/:id` - Get specific content
- `PATCH /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `POST /api/content/:id/publish` - Publish content
- `POST /api/content/:id/duplicate` - Duplicate content

### AI Endpoints
- `POST /api/ai/generate` - Generate content
- `POST /api/ai/optimize` - Optimize content
- `POST /api/ai/analyze` - Analyze content
- `POST /api/ai/translate` - Translate content
- `POST /api/ai/seo` - SEO optimization

### Media Endpoints
- `POST /api/media/upload` - Upload file
- `GET /api/media` - List media files
- `DELETE /api/media/:id` - Delete media file
- `POST /api/media/optimize` - Optimize image

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/content/:id` - Content analytics
- `GET /api/analytics/audience` - Audience analytics
- `GET /api/analytics/traffic` - Traffic analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: [docs/](docs/)
- **API Reference**: [docs/api/](docs/api/)
- **Community**: [GitHub Discussions](https://github.com/your-org/ai-cms/discussions)
- **Issues**: [GitHub Issues](https://github.com/your-org/ai-cms/issues)

### Professional Support
- **Enterprise Support**: Contact us for enterprise-grade support
- **Custom Development**: We offer custom development services
- **Training**: Team training and workshops available

## 🚀 Roadmap

### Version 1.1 (Q2 2024)
- [ ] Advanced AI content generation
- [ ] Enhanced collaboration features
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

### Version 1.2 (Q3 2024)
- [ ] Multi-tenant support
- [ ] Advanced workflow management
- [ ] API v2 with GraphQL
- [ ] Advanced SEO tools

### Version 2.0 (Q4 2024)
- [ ] Headless CMS capabilities
- [ ] Advanced AI models integration
- [ ] Enterprise-grade security
- [ ] White-label solutions

---

**Built with ❤️ by MiniMax Agent**

*This is a comprehensive, production-ready AI-Powered Content Management System designed for modern web applications. It features a sophisticated architecture with microservices, real-time collaboration, AI-powered content generation, and enterprise-grade security features.*#   c m s - a i - s y s t e m 
 
 
