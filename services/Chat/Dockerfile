# This Dockerfile should be used to build the `Chat` microservice.

# Builder stage
FROM node:18 AS builder

WORKDIR /app

# Copy the models package and create a tarball
COPY config/models /app/models
WORKDIR /app/models
RUN npm pack

# Final stage
FROM node:18

WORKDIR /app

COPY services/Chat/package*.json ./

RUN npm install
RUN npm update

# Copy the models tarball from the builder stage
COPY --from=builder /app/models/*.tgz /app/models.tgz

# Install the models package from the tarball
RUN npm install /app/models.tgz

# Copy the source code
COPY services/Chat/ ./Chat

WORKDIR /app/Chat

CMD ["npm", "start"]
