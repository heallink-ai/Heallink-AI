# Heallink AI Engine

This is the AI Engine for the Heallink healthcare platform, providing voice assistant capabilities using LiveKit Agents.

## Features

- Speech-to-Text (STT) using Deepgram
- Natural Language Processing (LLM) using OpenAI
- Text-to-Speech (TTS) using Cartesia
- Background noise cancellation
- Turn detection for natural conversation flow

## Development Setup

### Prerequisites

- Python 3.9 or higher
- uv package manager

### Installation

1. Create and activate a virtual environment:

```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:

```bash
uv pip install -e .
```

3. Set up environment variables by copying the example and filling in your API keys:

```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Download required model files:

```bash
python agent.py download-files
```

### Running the Application

#### CLI Mode (for testing)

```bash
python agent.py console
```

#### API Server Mode

```bash
python app.py
```

or

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/v1/livekit/agents` - Create a new AI agent in a LiveKit room
- `POST /api/v1/livekit/agents/disconnect` - Disconnect an AI agent from a room
- `GET /api/v1/livekit/agents/{agent_id}` - Get agent status

## Integration with Heallink Frontend

The frontend can connect to the AI Engine through the LiveKit client libraries, enabling real-time voice communication with the AI assistant.

## Docker Support

A Dockerfile is provided for containerized deployment. Build with:

```bash
docker build -t heallink-ai-engine .
```

Run with:

```bash
docker run -p 8000:8000 --env-file .env heallink-ai-engine
```