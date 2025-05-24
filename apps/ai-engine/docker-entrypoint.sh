#!/bin/bash
set -e

# Download model files if they don't exist
if [ ! -f ~/.cache/livekit/turn-detector/onnx/model_q8.onnx ]; then
  echo "Downloading model files..."
  python agent.py download-files
else
  echo "Model files already exist, skipping download."
fi

# Start the FastAPI server
exec uvicorn app:app --host 0.0.0.0 --port 8000 --reload