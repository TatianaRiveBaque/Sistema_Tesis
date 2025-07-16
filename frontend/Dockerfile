FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the application with SPA fallback
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000} --single"]
