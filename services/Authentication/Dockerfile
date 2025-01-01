# This Dockerfile should be used to build the `Authentication` microservice.

FROM node:18

WORKDIR /app

COPY services/Authentication/package*.json ./
RUN npm install

# Copy the source code
COPY services/Authentication/ ./Authentication
COPY config ./config

WORKDIR /app/Authentication

# Expose port 6000 to the host
EXPOSE 6000

CMD ["npm", "start"]
