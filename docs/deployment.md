# Deployment and CI/CD Workflow

This document outlines the deployment strategy, Docker compose structure, and GitHub Actions CI/CD pipelines for the VibeTree platform.

---

## 1. Environment Configuration

Create a `.env` file in the root directory before running the services:
```ini
# Server Setup
PORT=3000
NODE_ENV=production

# Security & Sessions
JWT_SECRET=super_secret_high_entropy_key_here
SESSION_EXPIRY=15m

# Database Setup
DATABASE_URL=postgresql://vibe_user:vibe_password@postgres_db:5432/vibe_db
REDIS_URL=redis://redis_cache:6379

# LLM Providers (for Live Agent Support)
OPENAI_API_KEY=your-api-key
ANTHROPIC_API_KEY=your-api-key
```

---

## 2. Docker Compose Infrastructure
For production deployment, use the following `docker-compose.yml` to coordinate the web dashboard, database, and Redis cache:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://vibe_user:vibe_password@postgres_db:5432/vibe_db
      - REDIS_URL=redis://redis_cache:6379
      - JWT_SECRET=super_secret_high_entropy_key_here
    depends_on:
      - postgres_db
      - redis_cache
    restart: always

  postgres_db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: vibe_user
      POSTGRES_PASSWORD: vibe_password
      POSTGRES_DB: vibe_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always

  redis_cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: always

volumes:
  pgdata:
```

---

## 3. GitHub Actions CI/CD Pipeline
Save this workflow configuration under `.github/workflows/deploy.yml` for automated testing and deployment:

```yaml
name: VibeTree CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test_and_build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Lint Code
      run: npm run lint --if-present

    - name: Run Tests
      run: npm test --if-present

    - name: Build Dashboard
      run: npm run build

  deploy:
    needs: test_and_build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
    - name: Trigger Remote Deployment
      run: |
        echo "Deploying to production server..."
        # Add server ssh commands or webhook triggers here
```
