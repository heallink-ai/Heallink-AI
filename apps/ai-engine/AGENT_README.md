# Heallink Voice Agent

This is the LiveKit agent worker for the Heallink voice assistant. It handles real-time voice interactions with patients, including symptom collection, emergency screening, and healthcare facility recommendations.

## Prerequisites

- Python 3.9 or higher
- LiveKit account and API credentials
- OpenAI, Deepgram, and Cartesia API keys

## Local Development

1. Install dependencies:

```bash
# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .
```

2. Set up environment variables:

Copy `.env.example` to `.env` and fill in your API keys and other configuration.

```bash
cp .env.example .env
```

3. Download model files:

```bash
python agent.py download-files
```

4. Run the agent in development mode:

```bash
python agent.py dev
```

## Docker

The agent can be run using Docker:

```bash
# Build and run only the agent
docker-compose build ai-agent
docker-compose up -d ai-agent

# View logs
docker-compose logs -f ai-agent
```

Or using the provided Makefile:

```bash
make build-run-agent
make logs-agent
```

## Architecture

The agent is built using the LiveKit Agents framework and implements:

- Multi-agent workflows with specialized agents for different parts of the conversation
- Emergency detection and handling
- Location-based healthcare facility recommendations
- Accessibility features
- Multilingual support

## Environment Variables

The following environment variables are required:

- `LIVEKIT_API_KEY`: Your LiveKit API key
- `LIVEKIT_API_SECRET`: Your LiveKit API secret
- `LIVEKIT_URL`: Your LiveKit server URL
- `OPENAI_API_KEY`: Your OpenAI API key
- `DEEPGRAM_API_KEY`: Your Deepgram API key
- `CARTESIA_API_KEY`: Your Cartesia API key (for TTS)
