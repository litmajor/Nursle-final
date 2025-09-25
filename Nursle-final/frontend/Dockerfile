FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./


# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .


# Build the application
RUN npm run build

# Remove devDependencies for production
RUN npm prune --production

# Install serve to serve the static files
RUN npm install -g serve

# Expose port 5000
EXPOSE 5000

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "5000", "-n"]