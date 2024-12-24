# This Dockerfile should be used to build the `Authentication` microservice.

FROM node:latest

WORKDIR /app

COPY Authentication/package*.json ./
RUN npm install

# Copy the source code
COPY Authentication/ ./Authentication
COPY config ./config

WORKDIR /app/Authentication

# Expose port 6000 to the host
EXPOSE 6000

CMD ["npm", "start"]
