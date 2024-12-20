# This Dockerfile should be used to build the `User` microservice.

FROM node:14

WORKDIR /app

COPY User/package*.json ./
RUN npm install

COPY User/ ./User
COPY config ./config

WORKDIR /app/User

CMD ["npm", "start"]
