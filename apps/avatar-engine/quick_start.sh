#!/bin/bash

# HealLink Avatar Engine - Quick Start Script
# This script sets up and runs the Avatar Engine for testing

set -e  # Exit on any error

echo "🚀 HealLink Avatar Engine - Quick Start"
echo "======================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "src/main.py" ]; then
    print_error "Please run this script from the avatar-engine directory"
    exit 1
fi

# Step 1: Check Prerequisites
echo -e "\n${BLUE}Step 1: Checking Prerequisites${NC}"

# Check Python version
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_status "Python $PYTHON_VERSION found"
else
    print_error "Python 3.11+ is required"
    exit 1
fi

# Check UV
if command -v uv &> /dev/null; then
    print_status "UV package manager found"
else
    print_warning "UV not found, installing..."
    pip install uv
fi

# Check Node.js (optional)
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js $NODE_VERSION found"
else
    print_warning "Node.js not found (optional for renderer)"
fi

# Step 2: Setup Environment
echo -e "\n${BLUE}Step 2: Setting up Environment${NC}"

# Create virtual environment
if [ ! -d ".venv" ]; then
    print_info "Creating virtual environment..."
    uv venv
    print_status "Virtual environment created"
else
    print_status "Virtual environment already exists"
fi

# Activate virtual environment
print_info "Activating virtual environment..."
source .venv/bin/activate
print_status "Virtual environment activated"

# Install dependencies
print_info "Installing Python dependencies..."
uv pip install -r requirements.txt
print_status "Dependencies installed"

# Step 3: Create Configuration
echo -e "\n${BLUE}Step 3: Creating Configuration${NC}"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_info "Creating .env configuration..."
    cp .env.example .env
    print_status "Configuration file created"
else
    print_status "Configuration file already exists"
fi

# Step 4: Setup Assets
echo -e "\n${BLUE}Step 4: Setting up Assets${NC}"

# Create asset directories
mkdir -p assets/{models,textures,backgrounds,sounds}
print_status "Asset directories created"

# Download sample ReadyPlayer.me avatar (if user wants)
echo -e "\n${YELLOW}Would you like to download a sample ReadyPlayer.me avatar? (y/n)${NC}"
read -r download_avatar

if [[ $download_avatar =~ ^[Yy]$ ]]; then
    print_info "To get a ReadyPlayer.me avatar:"
    echo "1. Go to https://readyplayer.me/"
    echo "2. Create a professional medical avatar"
    echo "3. Download the .glb file"
    echo "4. Move it to assets/models/doctor_avatar_1.glb"
    echo ""
    print_warning "For now, creating placeholder files..."
    
    # Create placeholder files
    touch assets/models/doctor_avatar_1.glb
    touch assets/models/doctor_avatar_2.glb
    touch assets/models/nurse_avatar_1.glb
    print_status "Placeholder model files created"
else
    print_info "Skipping avatar download"
fi

# Create sample backgrounds
if [ ! -f "assets/backgrounds/medical_office.jpg" ]; then
    print_info "Creating sample background images..."
    
    # Create solid color backgrounds (requires ImageMagick)
    if command -v convert &> /dev/null; then
        convert -size 1920x1080 xc:'#f0f8ff' assets/backgrounds/medical_office.jpg 2>/dev/null || true
        convert -size 1920x1080 xc:'#f5f5dc' assets/backgrounds/clinic_room.jpg 2>/dev/null || true
        print_status "Sample backgrounds created"
    else
        # Create placeholder files
        touch assets/backgrounds/medical_office.jpg
        touch assets/backgrounds/clinic_room.jpg
        print_warning "ImageMagick not found, created placeholder backgrounds"
    fi
fi

# Create test audio (requires say command on macOS)
if [ ! -f "assets/sounds/test_speech.wav" ]; then
    if command -v say &> /dev/null; then
        print_info "Creating test audio file..."
        say "Hello, how are you today? I am your AI medical assistant." -o assets/sounds/test_speech.wav
        print_status "Test audio file created"
    else
        touch assets/sounds/test_speech.wav
        print_warning "Text-to-speech not available, created placeholder audio"
    fi
fi

# Step 5: Install Optional Dependencies
echo -e "\n${BLUE}Step 5: Installing Optional Dependencies${NC}"

# Check for Rhubarb Lip Sync
if ! command -v rhubarb &> /dev/null; then
    print_warning "Rhubarb Lip Sync not found"
    echo -e "\n${YELLOW}Would you like to install Rhubarb Lip Sync for better lip syncing? (y/n)${NC}"
    read -r install_rhubarb
    
    if [[ $install_rhubarb =~ ^[Yy]$ ]]; then
        print_info "Installing Rhubarb Lip Sync..."
        
        # Detect OS and install accordingly
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            curl -L -o rhubarb.zip "https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.13.0/rhubarb-lip-sync-1.13.0-osx.zip"
            unzip -q rhubarb.zip
            sudo cp rhubarb-lip-sync-1.13.0-osx/rhubarb /usr/local/bin/ 2>/dev/null || cp rhubarb-lip-sync-1.13.0-osx/rhubarb ./tools/
            rm -rf rhubarb.zip rhubarb-lip-sync-1.13.0-osx
            print_status "Rhubarb Lip Sync installed"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -L -o rhubarb.zip "https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.13.0/rhubarb-lip-sync-1.13.0-linux.zip"
            unzip -q rhubarb.zip
            sudo cp rhubarb-lip-sync-1.13.0-linux/rhubarb /usr/local/bin/ 2>/dev/null || cp rhubarb-lip-sync-1.13.0-linux/rhubarb ./tools/
            rm -rf rhubarb.zip rhubarb-lip-sync-1.13.0-linux
            print_status "Rhubarb Lip Sync installed"
        else
            print_warning "Automatic installation not supported for this OS"
        fi
    fi
else
    print_status "Rhubarb Lip Sync already installed"
fi

# Step 6: Test Installation
echo -e "\n${BLUE}Step 6: Testing Installation${NC}"

print_info "Running basic health check..."

# Test import
python -c "
import sys
sys.path.insert(0, 'src')
try:
    from config.settings import AvatarConfig
    from plugin.avatar_session import AvatarSession
    print('✅ Core modules import successfully')
except Exception as e:
    print(f'❌ Import error: {e}')
    sys.exit(1)
" || exit 1

print_status "Installation test passed"

# Step 7: Start the Service
echo -e "\n${BLUE}Step 7: Starting Avatar Engine${NC}"

echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo -e "\n${BLUE}Starting Avatar Engine in development mode...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the service${NC}\n"

# Ask user if they want to run tests first
echo -e "${YELLOW}Would you like to run the test suite first? (y/n)${NC}"
read -r run_tests

if [[ $run_tests =~ ^[Yy]$ ]]; then
    print_info "Running test suite..."
    python tools/test_avatar.py --avatar-id doctor_avatar_1 --verbose
    echo ""
fi

# Start the service
print_info "Starting Avatar Engine..."
echo -e "\n${GREEN}🌐 Service will be available at: http://localhost:8080${NC}"
echo -e "${GREEN}📊 Health check: http://localhost:8080/health${NC}"
echo -e "${GREEN}📖 API docs: http://localhost:8080/info${NC}\n"

# Function to handle cleanup
cleanup() {
    echo -e "\n\n${YELLOW}🛑 Shutting down Avatar Engine...${NC}"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start the service
python src/main.py --dev --host 0.0.0.0 --port 8080 --log-level INFO