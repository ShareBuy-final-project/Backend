# This Dockerfile should be used to build the `Authentication` microservice.

FROM node:latest

WORKDIR /app

COPY Authentication/package*.json ./
RUN npm install

# Copy the source code
COPY Authentication/ ./Authentication
COPY config ./config

WORKDIR /app/Authentication

CMD ["npm", "start"]
