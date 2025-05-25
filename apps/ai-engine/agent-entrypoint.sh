#!/bin/bash
set -e

echo "Heallink Agent Entrypoint Script"
echo "Current working directory: $(pwd)"
echo "Script permissions: $(ls -la agent-entrypoint.sh)"
echo "User: $(whoami)"

# Download model files if they don't exist
if [ ! -f ~/.cache/livekit/turn-detector/onnx/model_q8.onnx ] || \
   [ ! -f ~/.cache/livekit/silero/silero_vad.onnx ] || \
   [ ! -f ~/.cache/livekit/noise-cancellation/bvccfg.bin ]; then
  echo "Downloading model files..."
  python agent.py download-files
else
  echo "Model files already exist, skipping download."
fi

# Start the agent in dev mode
echo "Starting Heallink Agent in dev mode using new refactored code..."
exec python agent.py dev 