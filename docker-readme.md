# Docker Setup for Heallink Applications

This document explains how to use the Docker configurations for local development and production.

## Local Development

The Docker Compose file is configured for local development with hot-reloading enabled.

### Prerequisites

- Docker
- Docker Compose

### Starting the Development Environment

To start all applications at once:

```bash
docker-compose up
```

To start a specific service:

```bash
docker-compose up heallink
docker-compose up heallink-admin
docker-compose up heallink-providers
docker-compose up api
docker-compose up mongodb
docker-compose up mongo-express
```

The applications will be available at:
- Heallink: http://localhost:3000
- Heallink Admin: http://localhost:3001
- Heallink Providers: http://localhost:3002
- API: http://localhost:3003
- MongoDB: mongodb://localhost:27017
- Mongo Express (MongoDB UI): http://localhost:8081

### Development Features

- Hot-reloading: Changes to the code will automatically be reflected in the browser.
- Volume mounting: The local codebase is mounted inside the containers, so changes are immediately available.
- Shared package dependencies: The `packages` directory is shared across all services.
- Isolated node_modules: Each service has its own node_modules volume to avoid conflicts.
- Persistent MongoDB data: MongoDB data is stored in a named volume for persistence between restarts.

## Database

The MongoDB database is accessible via:
- From within the Docker network: `mongodb:27017` (use this in your application config)
- From your host machine: `localhost:27017` (for connecting with tools like MongoDB Compass)

The mongo-express web interface provides a simple UI for managing the database and is available at http://localhost:8081.

## Production Deployment

Each application has a separate production Dockerfile that creates optimized builds.

### Building Production Images

To build a production image for each application:

```bash
# For the main Heallink application
docker build -t heallink:prod -f apps/heallink/Dockerfile .

# For the Heallink Admin application
docker build -t heallink-admin:prod -f apps/heallink-admin/Dockerfile .

# For the Heallink Providers application
docker build -t heallink-providers:prod -f apps/heallink-providers/Dockerfile .

# For the API
docker build -t heallink-api:prod -f apps/api/Dockerfile .
```

### Running Production Containers

```bash
# Run the main Heallink application
docker run -p 3000:3000 heallink:prod

# Run the Heallink Admin application
docker run -p 3001:3001 heallink-admin:prod

# Run the Heallink Providers application
docker run -p 3002:3002 heallink-providers:prod

# Run the API 
docker run -p 3003:3003 heallink-api:prod
```

## Docker Configuration Files

- `docker-compose.yml`: Configuration for local development environment.
- `apps/heallink/Dockerfile.dev`: Development Dockerfile for the main Heallink application.
- `apps/heallink/Dockerfile`: Production Dockerfile for the main Heallink application.
- `apps/heallink-admin/Dockerfile.dev`: Development Dockerfile for the Heallink Admin application.
- `apps/heallink-admin/Dockerfile`: Production Dockerfile for the Heallink Admin application.
- `apps/heallink-providers/Dockerfile.dev`: Development Dockerfile for the Heallink Providers application.
- `apps/heallink-providers/Dockerfile`: Production Dockerfile for the Heallink Providers application.
- `apps/api/Dockerfile.dev`: Development Dockerfile for the API.
- `apps/api/Dockerfile`: Production Dockerfile for the API.
- `.dockerignore`: Specifies files and directories that should be excluded from Docker builds.