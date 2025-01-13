# This Dockerfile should be used to build the `Group` microservice.

FROM node:latest

WORKDIR /app

COPY Group/package*.json ./
RUN npm install

# Copy the source code
COPY Group/ ./Group
COPY config ./config

WORKDIR /app/Group

CMD ["npm", "start"]