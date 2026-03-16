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

## GIT WORKFLOW FOR DEVS

Use these steps for every frontend developer(THIS IS A MUST TO AVOID MERGE CONFLICTS)

## STEP 1: In vs code
Make sure you are in main branch to pull the latest changes before working on your feature
```
git checkout main
```

## STEP 2: PULLING THE MAIN BRANCH
```
git pull origin main
```

## STEP 3: GO TO YOUR BRANCH
```
git checkout <branchname>
```

## STEP 4: MERGE YOUR BRANCH WITH MAIN
```
git merge main
```

## STEP 5: WORK ON YOUR FEATURE THEN ADD THE CHANGED FILES
```
git add .
```

## STEP 6: Commit
```
git commit -m "commit-message"
```

## STEP 7: PUSH CHANGES TO BRANCH
```
git push origin <your-branch-name>
```

## STEP 8: Create PR in github and wait for approval then after aproval in github you merge in github

## STEP 9: Then now go to vs-code and repeat the steps from step 1

