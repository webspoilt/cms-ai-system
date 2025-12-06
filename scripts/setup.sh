#!/bin/bash

# AI-Powered CMS Setup Script
# This script helps you set up the AI-Powered Content Management System

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ai-cms"
ENV_FILE=".env"
LOG_FILE="setup.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a $LOG_FILE
}

check_dependencies() {
    log "Checking system dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    fi
    
    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        error "Node.js version 18+ is required. Current version: $(node -v)"
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        warning "Docker is not installed. Some features may not work."
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        warning "Docker Compose is not installed. Please install Docker Compose."
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        error "Git is not installed. Please install Git."
    fi
    
    log "Dependency check completed"
}

setup_environment() {
    log "Setting up environment configuration..."
    
    if [ ! -f $ENV_FILE ]; then
        if [ -f .env.example ]; then
            cp .env.example $ENV_FILE
            log "Created $ENV_FILE from template"
        else
            error "No environment template found"
        fi
    else
        warning "$ENV_FILE already exists, skipping creation"
    fi
    
    # Generate secure secrets
    generate_secrets
}

generate_secrets() {
    log "Generating secure secrets..."
    
    # JWT Secret
    local jwt_secret=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    
    # Refresh Token Secret
    local refresh_secret=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    
    # Session Secret
    local session_secret=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    
    # Update environment file
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$jwt_secret/" $ENV_FILE
    sed -i.bak "s/REFRESH_TOKEN_SECRET=.*/REFRESH_TOKEN_SECRET=$refresh_secret/" $ENV_FILE
    sed -i.bak "s/SESSION_SECRET=.*/SESSION_SECRET=$session_secret/" $ENV_FILE
    
    # Generate VAPID keys for push notifications
    if command -v npx &> /dev/null; then
        local vapid_keys=$(npx web-push generate-vapid-keys 2>/dev/null || echo "")
        if [ -n "$vapid_keys" ]; then
            info "VAPID keys generated for push notifications"
        fi
    fi
    
    log "Secrets generated successfully"
    info "Please update the following in $ENV_FILE:"
    info "- OpenAI API Key: OPENAI_API_KEY"
    info "- Google OAuth credentials (if using Google login)"
    info "- Database passwords and other sensitive data"
}

install_dependencies() {
    log "Installing project dependencies..."
    
    # Check if npm is available
    if ! command -v npm &> /dev/null; then
        error "npm is not available. Please install Node.js and npm."
    fi
    
    # Install root dependencies
    log "Installing root dependencies..."
    npm install
    
    # Install frontend dependencies
    log "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Install backend dependencies
    log "Installing backend dependencies..."
    cd backend
    
    # Install gateway dependencies
    cd gateway
    npm install
    cd ..
    
    # Install auth service dependencies
    cd auth
    npm install
    cd ..
    
    # Install AI service dependencies
    cd ai
    npm install
    cd ..
    
    # Install content service dependencies
    cd content
    npm install
    cd ..
    
    # Install analytics service dependencies
    cd analytics
    npm install
    cd ..
    
    cd ..
    
    log "All dependencies installed successfully"
}

setup_databases() {
    log "Setting up databases..."
    
    if command -v docker-compose &> /dev/null; then
        # Start only the database services
        info "Starting database services with Docker..."
        docker-compose up -d mongo redis elasticsearch minio
        
        # Wait for databases to be ready
        log "Waiting for databases to be ready..."
        sleep 30
        
        info "Database services started successfully"
        info "MongoDB: localhost:27017"
        info "Redis: localhost:6379"
        info "Elasticsearch: localhost:9200"
        info "MinIO: http://localhost:9000 (console: http://localhost:9001)"
    else
        warning "Docker Compose not available. Please set up databases manually."
        info "Required services:"
        info "- MongoDB 7.0+ on port 27017"
        info "- Redis 7.2+ on port 6379"
        info "- Elasticsearch 8.11+ on port 9200"
    fi
}

create_directories() {
    log "Creating required directories..."
    
    # Create upload directories
    mkdir -p uploads/images
    mkdir -p uploads/videos
    mkdir -p uploads/documents
    
    # Create log directories
    mkdir -p logs
    
    # Create backup directories
    mkdir -p backups
    
    # Create SSL directory
    mkdir -p ssl
    
    # Set permissions
    chmod 755 uploads backups ssl
    chmod 755 logs
    
    log "Directories created successfully"
}

create_nginx_config() {
    log "Creating Nginx configuration..."
    
    cat > nginx.conf << EOF
server {
    listen 80;
    server_name localhost;
    
    client_max_body_size 50M;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API Gateway
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    log "Nginx configuration created: nginx.conf"
}

print_completion_message() {
    log "Setup completed successfully!"
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}  AI CMS Setup Complete!      ${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Edit $ENV_FILE with your API keys and configuration"
    echo "2. Start the application:"
    echo "   ${BLUE}npm run dev${NC} - Start development server"
    echo "   ${BLUE}docker-compose up${NC} - Start with Docker"
    echo ""
    echo -e "${YELLOW}Services:${NC}"
    echo "Frontend:     http://localhost:3000"
    echo "API Gateway:  http://localhost:3001"
    echo "Auth Service: http://localhost:3002"
    echo "AI Service:   http://localhost:3003"
    echo "Content Svc:  http://localhost:3004"
    echo "Analytics:    http://localhost:3005"
    echo ""
    echo -e "${YELLOW}Monitoring:${NC}"
    echo "Grafana:      http://localhost:3006"
    echo "Prometheus:   http://localhost:9090"
    echo "Elasticsearch: http://localhost:9200"
    echo "MinIO Console: http://localhost:9001"
    echo ""
    echo -e "${YELLOW}Documentation:${NC}"
    echo "README:       ./README.md"
    echo "API Docs:     http://localhost:3001/docs"
    echo ""
    echo -e "${YELLOW}Configuration Files:${NC}"
    echo "Environment:  $ENV_FILE"
    echo "Nginx:        nginx.conf"
    echo ""
    echo -e "${YELLOW}Logs:${NC}"
    echo "Setup log:    $LOG_FILE"
    echo "App logs:     ./logs/"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

main() {
    echo -e "${BLUE}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         AI-Powered Content Management System Setup           ║
║                                                              ║
║              Welcome to your new CMS! 🚀                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    log "Starting AI CMS setup..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
        error "Please run this script from the project root directory"
    fi
    
    # Run setup steps
    check_dependencies
    setup_environment
    install_dependencies
    setup_databases
    create_directories
    create_nginx_config
    print_completion_message
}

# Run main function
main "$@"