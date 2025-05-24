# This Dockerfile should be used to build the `Group` microservice.

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

COPY services/Recommendations/package*.json ./

RUN npm install
RUN npm update

# Copy the models tarball from the builder stage
COPY --from=builder /app/models/models-1.0.0.tgz /app/models-1.0.0.tgz

# Install the models package from the tarball
RUN npm install /app/models-1.0.0.tgz

# Copy the source code
COPY services/Recommendations/ ./Recommendations

WORKDIR /app/Recommendations

CMD ["npm", "start"]