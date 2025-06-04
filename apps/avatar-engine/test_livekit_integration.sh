#!/bin/bash
# Test LiveKit Integration with Avatar Engine
# This script helps you test the Avatar Engine with LiveKit

echo "🚀 HealLink Avatar Engine - LiveKit Integration Test"
echo "=================================================="

# Check if Avatar Engine is running
echo "🔍 Checking Avatar Engine status..."
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Avatar Engine is running on port 8080"
    curl -s http://localhost:8080/health | jq .
else
    echo "❌ Avatar Engine not running. Starting it..."
    docker compose up -d avatar-engine
    echo "⏳ Waiting for Avatar Engine to start..."
    sleep 10
    
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo "✅ Avatar Engine started successfully"
    else
        echo "❌ Failed to start Avatar Engine. Check Docker logs:"
        docker compose logs avatar-engine --tail 20
        exit 1
    fi
fi

echo ""
echo "🌐 Starting Web Client..."
echo "Opening web client at: http://localhost:3001"

# Start simple HTTP server for web client
cd web-client
python3 -m http.server 3001 &
WEB_SERVER_PID=$!

# Open browser (works on macOS)
if command -v open > /dev/null 2>&1; then
    open http://localhost:3001
elif command -v xdg-open > /dev/null 2>&1; then
    xdg-open http://localhost:3001
fi

echo ""
echo "🧪 Testing Avatar Engine API..."
echo ""

# Test 1: Create avatar session
echo "1️⃣ Creating avatar session..."
SESSION_RESPONSE=$(curl -s -X POST http://localhost:8080/avatars \
  -H "Content-Type: application/json" \
  -d '{"avatar_id": "doctor_avatar_1", "session_id": "test_livekit_integration"}')

echo "Response: $SESSION_RESPONSE"
SESSION_ID=$(echo $SESSION_RESPONSE | jq -r '.session_id')

if [ "$SESSION_ID" != "null" ] && [ "$SESSION_ID" != "" ]; then
    echo "✅ Session created: $SESSION_ID"
else
    echo "❌ Failed to create session"
    kill $WEB_SERVER_PID 2>/dev/null
    exit 1
fi

echo ""

# Test 2: Set emotion
echo "2️⃣ Testing emotion control..."
curl -s -X POST http://localhost:8080/avatars/$SESSION_ID/emotion \
  -H "Content-Type: application/json" \
  -d '{"emotion": "happy", "intensity": 0.8}' | jq .

echo ""

# Test 3: Get session info
echo "3️⃣ Getting session information..."
curl -s http://localhost:8080/avatars/$SESSION_ID | jq .

echo ""

# Test 4: Set background
echo "4️⃣ Testing background change..."
curl -s -X POST http://localhost:8080/avatars/$SESSION_ID/background \
  -H "Content-Type: application/json" \
  -d '{"background_id": "medical_office"}' | jq .

echo ""
echo "🎉 Avatar Engine is ready for LiveKit integration!"
echo ""
echo "📋 Next Steps:"
echo "1. Open the web client at: http://localhost:3001"
echo "2. Use the web interface to test avatar controls"
echo "3. Run your modified ai-engine with: cd ../ai-engine && python avatar_agent_test.py"
echo ""
echo "🔧 Environment Variables for your ai-engine:"
echo "export AVATAR_ENGINE_URL=http://localhost:8080"
echo "export USE_CUSTOM_AVATAR=true"
echo ""
echo "⚠️  Press Ctrl+C to stop the web server and clean up"

# Wait for user interrupt
trap 'echo ""; echo "🧹 Cleaning up..."; kill $WEB_SERVER_PID 2>/dev/null; curl -s -X DELETE http://localhost:8080/avatars/$SESSION_ID > /dev/null 2>&1; echo "✅ Cleanup complete"; exit 0' INT

# Keep script running
while true; do
    sleep 1
done