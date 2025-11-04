## docker-ecom

Step-by-step guide to develop and run this Node.js app with Docker.

### Prerequisites
1. Install Docker Desktop and ensure it is running.
2. Open a terminal in the project folder: `D:\Backend\docker-ecom`.

### Project structure
- `app.js`: Express server entry
- `Dockerfile`: Build image for dev/prod
- `docker-compose.yml`: Services for dev (`app-dev`) and prod-like (`app`)
- `nodemon.json`: Nodemon config for reliable file watching in Docker on Windows
- `.dockerignore`: Excludes files from the image

### First-time setup (dev)
1. Build the dev service (installs dev dependencies in image):
   ```powershell
   docker compose build app-dev
   ```
2. Start dev service (auto installs dependencies on start, watches files):
   ```powershell
   docker compose up app-dev
   ```
3. Open http://localhost:3000

Notes:
- Local files are bind-mounted into the container; saving changes restarts the server via nodemon.
- Dependencies install inside the container and persist to a named volume `node_modules`.

### Day-to-day usage (dev)
- Start:
  ```powershell
  docker compose up app-dev
  ```
- Start detached and tail logs:
  ```powershell
  docker compose up -d app-dev
  docker compose logs -f app-dev
  ```
- Stop/remove containers:
  ```powershell
  docker compose down
  ```

### Installing packages (inside container)
- Install runtime dependency:
  ```powershell
  docker compose exec app-dev npm install <package>
  ```
- Install dev dependency:
  ```powershell
  docker compose exec app-dev npm install -D <package>
  ```

This updates `package.json`/`package-lock.json` in your working directory and installs modules into the container’s named volume (`node_modules`).

### Production-like run
1. Build and start:
   ```powershell
   docker compose up --build app
   ```
2. Open http://localhost:8080

### Rebuild rules
- After changing `Dockerfile` or `package.json`, rebuild:
  ```powershell
  docker compose build app-dev
  ```
- For normal code changes, no rebuild is needed; nodemon restarts automatically.

### Logs
- Follow dev logs (restarts, console output):
  ```powershell
  docker compose logs -f app-dev
  ```

### Environment variables
- Dev service sets:
  - `NODE_ENV=development`
  - `CHOKIDAR_USEPOLLING=1` and `CHOKIDAR_INTERVAL=300` for reliable file watching on Windows
- Prod service sets: `NODE_ENV=production`

To add custom env vars, append under the appropriate service in `docker-compose.yml`:
```yaml
environment:
  - YOUR_VAR=your_value
```

### Troubleshooting
- Nodemon not restarting on file save:
  - Ensure you started `app-dev` service (not `app`).
  - Verify `CHOKIDAR_USEPOLLING=1` is present in `docker-compose.yml` under `app-dev`.
  - Rebuild dev image if `Dockerfile` changed: `docker compose build app-dev`.

- Package missing inside container after installing on host:
  - Always install inside container: `docker compose exec app-dev npm install <package>`.

- Clean node_modules volume if needed (forces fresh install next start):
  ```powershell
  docker compose down -v
  ```

### Ports
- Dev: host `3000` → container `3000`
- Prod-like: host `8080` → container `3000`

To change ports, edit `docker-compose.yml` port mappings, e.g. `"5000:3000"`.

### Notes
- Compose file intentionally omits the legacy `version` key (it is obsolete in newer Compose).
- The dev service runs: `sh -c "npm install && npm run dev"` so dependencies are ensured each start.

## Full configuration files

These are the exact files used in this repo for quick reference.

### docker-compose.yml
```yaml
services:
  app:
    build: .
    image: docker-ecom:latest
    ports:
      - "8080:3000"
    environment:
      - NODE_ENV=production
    command: npm start

  app-dev:
    build:
      context: .
      args:
        NODE_ENV: development
    image: docker-ecom:dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=1
      - CHOKIDAR_INTERVAL=300
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    command: sh -c "npm install && npm run dev"

volumes:
  node_modules:
```

### Dockerfile
```Dockerfile
FROM node:18-alpine

# Allow compose to set NODE_ENV at build time (defaults to production)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Install dependencies based on NODE_ENV
COPY package*.json ./
RUN if [ "$NODE_ENV" = "production" ]; then \
      npm ci --only=production || npm install --production; \
    else \
      npm ci || npm install; \
    fi

# Copy app source
COPY . .

EXPOSE 3000

CMD ["npm","start"]
```

### .dockerignore
```gitignore
# dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env
.env
.env.*

# docker
Dockerfile
.dockerignore

docker-compose.yml

# VCS
.git
.gitignore

# misc
.DS_Store
```


