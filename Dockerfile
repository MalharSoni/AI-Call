FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./

# Copy all packages and apps
COPY packages/ ./packages/
COPY apps/ ./apps/

# Install dependencies
RUN npm install

# Build all packages
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start", "--workspace=@ai-call/server"]