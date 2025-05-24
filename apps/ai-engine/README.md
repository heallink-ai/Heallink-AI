# Heallink AI Engine

The Heallink AI Engine provides an AI-powered voice assistant for healthcare conversations using LiveKit Agents.

## Features

- **Voice AI Assistant**: Conversational voice assistant specialized for healthcare
- **Streaming Speech Recognition**: Real-time transcription using Deepgram
- **Natural Text-to-Speech**: High-quality voice synthesis with Cartesia
- **Intelligent Response Generation**: Powered by OpenAI's GPT models
- **Noise Cancellation**: Enhanced audio quality with LiveKit's noise cancellation
- **Voice Activity Detection**: Accurate speech detection with Silero
- **End-of-Utterance Detection**: Detects when users stop speaking for natural conversations
- **Multi-language Support**: Works across different languages
- **Request ID Tracking**: Unique ID for each request for traceability
- **Request Timing**: Performance monitoring with request duration tracking
- **Rate Limiting**: Protection against API abuse
- **Enhanced Logging**: Detailed logging with process and thread information
- **Error Handling**: Consistent, informative error responses
- **CORS Support**: Secure cross-origin resource sharing

## Architecture

The AI Engine follows a modular architecture:

- `app.py` - Main FastAPI application with LiveKit integration
- `agent.py` - LiveKit agent implementation
- `core/` - Core utilities (configuration, logging, middleware, etc.)
- `api/` - API endpoints for health checks and metrics

## API Endpoints

### LiveKit Agent Management

- `POST /api/v1/livekit/agents` - Create a new voice assistant agent
- `GET /api/v1/livekit/agents/{agent_id}` - Get agent status
- `POST /api/v1/livekit/agents/disconnect` - Disconnect an agent

### Health & Monitoring

- `GET /health` - Health check with version and timestamp
- `GET /` - Root endpoint with API information

## Setup & Usage

### Prerequisites

- Python 3.9+
- LiveKit account for real-time communication
- API keys for OpenAI, Deepgram, and Cartesia

### Installation

1. Set up a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your API keys and settings
```

### Running the Server

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at http://localhost:8000.

## Docker

You can also run the AI Engine using Docker:

```bash
docker build -t heallink-ai-engine .
docker run -p 8000:8000 heallink-ai-engine
```

Or with Docker Compose:

```bash
docker-compose up ai-engine
```

## Environment Variables

| Variable             | Description                          | Default     |
| -------------------- | ------------------------------------ | ----------- |
| `LIVEKIT_URL`        | LiveKit server URL                   | -           |
| `LIVEKIT_API_KEY`    | LiveKit API key                      | -           |
| `LIVEKIT_API_SECRET` | LiveKit API secret                   | -           |
| `OPENAI_API_KEY`     | OpenAI API key                       | -           |
| `DEEPGRAM_API_KEY`   | Deepgram API key                     | -           |
| `CARTESIA_API_KEY`   | Cartesia API key                     | -           |
| `PORT`               | Server port                          | 8000        |
| `HOST`               | Server host                          | 0.0.0.0     |
| `LOG_LEVEL`          | Logging level                        | INFO        |
| `ENVIRONMENT`        | Environment (development/production) | development |

## Performance & Security Features

The AI Engine includes several performance and security enhancements:

- **Request ID Headers**: Each request is assigned a unique UUID, included in response headers as `X-Request-ID`
- **Processing Time Headers**: Response time metrics in the `X-Process-Time` header
- **Rate Limiting**: Default limit of 100 requests per minute per IP address
- **Error Standardization**: All errors follow a consistent JSON format
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Detailed Logging**: Enhanced logging for better troubleshooting

## Monitoring & Observability

The AI Engine provides comprehensive monitoring capabilities:

- **Prometheus Metrics**: Track request rates, durations, and AI processing times
- **Health Checks**: Monitor system resources and application status
- **Structured Logs**: Detailed, context-rich logging with correlation IDs

## Rate Limiting

The API includes rate limiting to prevent abuse:

- Default: 100 requests per minute per IP address
- Configurable via environment variables
- 429 responses include Retry-After headers

## Error Handling

All error responses follow a consistent format:

```json
{
  "status": "error",
  "code": 400,
  "message": "Validation error",
  "details": { ... }
}
```

## Development

### Project Structure

```
ai-engine/
├── app.py             # Main FastAPI application
├── agent.py           # LiveKit agent implementation
├── main.py            # Entry point for running the app
├── core/              # Core utilities
│   ├── config.py      # Configuration settings
│   ├── logging.py     # Logging configuration
│   ├── middleware.py  # Middleware components
│   ├── rate_limiter.py # Rate limiting
│   └── errors.py      # Error handling
├── api/               # API endpoints
│   ├── health.py      # Health check endpoints
│   └── metrics.py     # Metrics endpoints
├── requirements.txt   # Dependencies
└── .env.example       # Example environment variables
```
