#!/bin/bash
# Start Web Client for Avatar Engine Testing

echo "🌐 Starting Avatar Engine Web Client"
echo "=================================="

# Check if Avatar Engine is running
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Avatar Engine is running on port 8080"
else
    echo "❌ Avatar Engine not running. Please start it first:"
    echo "   docker compose up -d avatar-engine"
    exit 1
fi

# Check if port 3001 is available
if lsof -i :3001 > /dev/null 2>&1; then
    echo "⚠️  Port 3001 is already in use. Trying port 3002..."
    PORT=3002
else
    PORT=3001
fi

echo "🚀 Starting web server on port $PORT"
echo "📍 Web client will be available at: http://localhost:$PORT"

# Navigate to web-client directory
cd web-client

# Start Python HTTP server
python3 -m http.server $PORT

echo "🛑 Web server stopped"