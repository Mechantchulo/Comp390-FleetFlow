# Node-only image (no nginx)
FROM node:20-alpine

# create the working directory
WORKDIR /app

# copy dependency manifests first
COPY package*.json ./

# install dependencies
RUN npm ci

# Copy source
COPY . .

# Build static files into /app/dist
RUN npm run build

EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
