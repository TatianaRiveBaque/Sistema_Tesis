FROM python:3.9-alpine

# Copy files
COPY . /app
WORKDIR /app

# Expose port
EXPOSE 8000

# Serve files
CMD ["python", "-m", "http.server", "8000"]
