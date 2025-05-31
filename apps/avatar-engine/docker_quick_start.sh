#!/bin/bash

# Quick Docker Start Script for Avatar Engine
# This script builds and runs the Avatar Engine using Docker

set -e

echo "🚀 HealLink Avatar Engine - Docker Quick Start"
echo "============================================="

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop."
    exit 1
fi

print_status "Docker is running"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found, creating from template..."
    cp .env.example .env
    print_status ".env file created"
fi

# Create necessary directories
mkdir -p assets/{models,textures,backgrounds,sounds} logs

print_status "Asset directories created"

# Build and run the Avatar Engine
echo -e "\n${YELLOW}Building Avatar Engine Docker image...${NC}"

# Remove old containers if they exist
docker compose down avatar-engine 2>/dev/null || true

# Build and start the service
if docker compose up --build -d avatar-engine; then
    print_status "Avatar Engine built and started successfully"
else
    print_error "Failed to build or start Avatar Engine"
    exit 1
fi

# Wait for service to be ready
echo -e "\n${YELLOW}Waiting for Avatar Engine to start...${NC}"
sleep 10

# Check if service is healthy
for i in {1..30}; do
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        print_status "Avatar Engine is running and healthy!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        print_error "Avatar Engine failed to start properly"
        echo -e "\n${YELLOW}Checking logs:${NC}"
        docker compose logs avatar-engine
        exit 1
    fi
    
    echo "Waiting... (attempt $i/30)"
    sleep 2
done

# Show service information
echo -e "\n${GREEN}🎉 Avatar Engine is ready!${NC}"
echo -e "\n📊 Service Information:"
echo "🌐 Health Check: http://localhost:8080/health"
echo "📖 Service Info: http://localhost:8080/info"
echo "🔧 API Endpoints: http://localhost:8080/"

# Test the service
echo -e "\n${YELLOW}Testing service endpoints...${NC}"

# Test health endpoint
if curl -s http://localhost:8080/health | grep -q "healthy"; then
    print_status "Health check endpoint working"
else
    print_warning "Health check endpoint not responding correctly"
fi

# Test info endpoint
if curl -s http://localhost:8080/info | grep -q "Avatar Engine"; then
    print_status "Info endpoint working"
else
    print_warning "Info endpoint not responding correctly"
fi

# Show quick test commands
echo -e "\n${YELLOW}Quick Test Commands:${NC}"
echo "# Create avatar session:"
echo "curl -X POST http://localhost:8080/avatars -H 'Content-Type: application/json' -d '{\"avatar_id\": \"doctor_avatar_1\"}'"
echo ""
echo "# Set emotion (replace SESSION_ID with actual session ID):"
echo "curl -X POST http://localhost:8080/avatars/SESSION_ID/emotion -H 'Content-Type: application/json' -d '{\"emotion\": \"happy\", \"intensity\": 0.8}'"
echo ""
echo "# View logs:"
echo "docker compose logs -f avatar-engine"
echo ""
echo "# Stop service:"
echo "docker compose down avatar-engine"

echo -e "\n${GREEN}✅ Setup complete! Avatar Engine is running in Docker.${NC}"