# This Dockerfile should be used to build the `Authentication` microservice.


FROM node:18

WORKDIR /app

COPY services/Authentication/package*.json ./
RUN npm install

# Copy the source code
COPY services/Authentication/ ./Authentication
COPY config ./config

WORKDIR /app/Authentication

CMD ["npm", "start"]
