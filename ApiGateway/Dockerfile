FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ApiGateway/package*.json ./

# Install dependencies
RUN npm install

# Ensure all dependencies are updated to their latest versions
RUN npm update

# Ensure the latest versions of http-proxy and http-proxy-middleware are installed
RUN npm install http-proxy@latest http-proxy-middleware@latest

# Copy the rest of the application code to the working directory
COPY ApiGateway/ ./ApiGateway

WORKDIR /app/ApiGateway

# Expose port 3000 to the host
EXPOSE 3000

# Run the application with the --trace-deprecation flag
CMD ["node", "--trace-deprecation", "app.js"]
