FROM node:18-alpine
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build for production
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the application with SPA fallback
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000} --single"]
