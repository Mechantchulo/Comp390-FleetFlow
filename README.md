# FleetFlow Frontend

Frontend client for FleetFlow built with React + Vite.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional, for containerized run)

## Local Development

1. Install dependencies:
```bash
npm ci
```

2. Start the dev server:
```bash
npm run dev
```

3. Open the app at the URL shown in your terminal (usually `http://localhost:5173`).

## Production Build (Local)

Build static assets:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Run with Docker (Node-only)

This project currently uses a Node-only Docker image (no Nginx).

1. Build image:
```bash
docker build -t fleetflow-frontend .
```

2. Run container:
```bash
docker run -p 4173:4173 fleetflow-frontend
```

3. Open:
`http://localhost:4173`

## Environment Variables

- Frontend-exposed variables must start with `VITE_`.
- In Vite, these values are injected at build time.

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build in `dist/`
- `npm run preview` - serve built app locally
- `npm run lint` - run ESLint
