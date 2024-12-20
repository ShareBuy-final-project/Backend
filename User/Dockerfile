# This Dockerfile should be used to build the `User` microservice.

FROM node:latest

WORKDIR /app

COPY User/package*.json ./
RUN npm install

# Copy the source code
COPY User/ ./User
COPY config ./config

WORKDIR /app/User

CMD ["npm", "start"]
