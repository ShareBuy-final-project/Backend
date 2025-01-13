# This Dockerfile should be used to build the `User` microservice.

FROM node:18

WORKDIR /app

COPY services/User/package*.json ./
RUN npm install
RUN npm update

# Copy the source code
COPY services/User/ ./User
COPY config ./config

WORKDIR /app/User

# Run the application with the --trace-deprecation flag

CMD ["npm", "start"]
