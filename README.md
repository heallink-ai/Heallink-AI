# Heallink Monorepo

Heallink is a healthcare platform composed of several applications that share a common codebase.  The repository uses **npm workspaces** and contains both Node.js and Python projects.

## Project Overview

According to the [project specification](project-specs.md), Heallink consists of three main interfaces:
- **Admin Panel** – internal tool for administrators
- **User App** – portal for patients
- **Provider App** – clinician portal

A NestJS API and multiple AI services support these front‑end applications.

## Repository Structure

```
apps/      # All runnable applications
  heallink            - Patient facing Next.js app
  heallink-admin      - Admin dashboard (Next.js)
  heallink-providers  - Clinician portal (Next.js)
  api                 - NestJS backend API
  ai-engine           - FastAPI service providing a voice assistant
  avatar-engine       - Real‑time 2D avatar lip‑sync service
packages/  # Shared packages (e.g. @heallink/common)
scripts/   # Utility scripts (LocalStack setup, AWS validation)
```

The workspace configuration and top level scripts are defined in `package.json`:
```json
"workspaces": ["apps/*", "packages/*"],
"scripts": {
  "build": "npm run build --workspaces",
  "dev": "npm run dev --workspaces --if-present",
  "lint": "npm run lint --workspaces",
  "test": "npm run test --workspaces --if-present",
  "start": "docker compose up -d --build",
  "stop": "docker compose down",
  "clean": "docker compose down -v --rmi all --remove-orphans"
},
"engines": { "node": ">=16.0.0" }
```
【F:package.json†L1-L20】

## Local Development with Docker

The repository includes a `docker-compose.yml` file and a separate [Docker README](docker-readme.md) with detailed instructions.  The main steps are:

```bash
# start every service with hot reload
docker-compose up
```
【F:docker-readme.md†L14-L20】

You can also start an individual service:
```bash
docker-compose up heallink   # or api, heallink-admin, etc.
```
【F:docker-readme.md†L22-L29】

Once running, the default ports are:
- Heallink: `http://localhost:3000`
- Heallink Admin: `http://localhost:3001`
- Heallink Providers: `http://localhost:3002`
- API: `http://localhost:3003`
- Mongo Express: `http://localhost:8081`
【F:docker-readme.md†L33-L39】

Services are defined in `docker-compose.yml`.  For example the user application mounts the source code and passes API URLs as environment variables:
```yaml
services:
  heallink:
    build:
      context: .
      dockerfile: ./apps/heallink/Dockerfile.dev
    container_name: heallink
    ports:
      - "3000:3000"
    volumes:
      - ./apps/heallink:/app/apps/heallink
      - ./packages:/app/packages
      - heallink-node-modules:/app/apps/heallink/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
      - NEXT_PUBLIC_API_URL=http://localhost:3003/api/v1
      - NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:8000/api/v1
      - API_URL=http://api:3003/api/v1
      - AI_ENGINE_URL=http://ai-engine:8000/api/v1
    depends_on:
      - api
    networks:
      - heallink-network
```
【F:docker-compose.yml†L1-L26】

Additional services include an avatar engine and an AI agent, MongoDB, and LocalStack for AWS emulation.

## Environment Variables

The API provides an `.env.example` listing all variables.  Important settings include:
```bash
NODE_ENV=development
PORT=3003
DATABASE_URL=mongodb://root:example@mongodb:27017/heallink?authSource=admin
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002
FRONTEND_URL=http://localhost:3000
ADMIN_FRONTEND_URL=http://localhost:3002
# OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
APPLE_CLIENT_ID=your-apple-client-id
...
AWS_ENDPOINT=http://localstack:4566
USE_LOCALSTACK=true
S3_BUCKET_NAME=heallink-storage
AI_ENGINE_URL=http://ai-engine:8000/api/v1
LIVEKIT_URL=wss://your-livekit-cloud-instance.livekit.cloud
```
【F:apps/api/.env.example†L1-L71】

Each Next.js app has its own `.env.local` file (see the app READMEs) for authentication secrets.

## Application Details

### Heallink (User App)
The patient-facing Next.js application includes Auth.js configuration supporting email, phone and social logins.  To start locally:
```bash
npm run dev
```
【F:apps/heallink/README.md†L5-L15】
Users configure OAuth credentials in `.env.local` following the instructions in the app README.

### Heallink Admin
The admin dashboard is another Next.js application.  Its README is the default `create-next-app` documentation.

### Heallink Providers
Clinician portal built with Next.js.  It shares many dependencies with the user app and also contains Jest tests.

### API (NestJS)
The backend service implements authentication and business logic.  After installing dependencies (`npm install`), run it in development mode with:
```bash
npm run start:dev
```
【F:apps/api/README.md†L45-L55】
Swagger documentation will be available at `http://localhost:3003/api/v1/docs`.

### AI Engine
Provides a voice assistant via FastAPI and LiveKit Agents.  Key features include streaming speech recognition, text‑to‑speech and rate limiting:
```text
- Voice AI Assistant
- Streaming Speech Recognition
- Natural Text-to-Speech
- Intelligent Response Generation
- Noise Cancellation
- Voice Activity Detection
- End-of-Utterance Detection
```
【F:apps/ai-engine/README.md†L5-L19】

### Avatar Engine
Real‑time 2D avatar service using MuseTalk.  Example quick start:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv venv
source .venv/bin/activate
uv pip install -e .
python -m avatar_engine.setup download-models
avatar-engine --host 0.0.0.0 --port 8080
```
【F:apps/avatar-engine/README.md†L17-L32】
A Docker setup is available to run it as part of the compose stack.

### Voice Agent Worker
The AI agent communicates with LiveKit to drive conversations.  To run locally:
```bash
python agent.py dev
```
【F:apps/ai-engine/AGENT_README.md†L38-L42】
Docker commands are also provided to build and run the `ai-agent` service.

## AWS Emulation

Local development uses [LocalStack](https://github.com/localstack/localstack) for AWS services.  The `scripts/localstack/init-aws.sh` script creates S3 buckets, DynamoDB tables and Secrets Manager secrets when LocalStack starts.

## Running Tests

Run all workspace tests with:
```bash
npm test
```
This executes Jest suites in the individual applications.

## Cleaning Up

Stop running containers with:
```bash
npm run stop
```
or remove all data with:
```bash
npm run clean
```

---
For full details on each service, see the individual READMEs inside the `apps/` directory.

## Deploying the Heallink App to Vercel

The repository now includes a `vercel.json` file that tells Vercel to build the
user application located in `apps/heallink`. When connecting this GitHub repo to
Vercel, ensure the **root directory** is set to the repository root so that the
configuration file is picked up. Vercel will then execute the build for the
`apps/heallink` project automatically on every push to `main`.
