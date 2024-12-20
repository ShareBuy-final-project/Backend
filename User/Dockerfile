# This Dockerfile should be used to build the `User` microservice.

FROM node:14

WORKDIR /app

COPY User/package*.json ./
RUN npm install

COPY . .
COPY config ./config

CMD ["npm", "start"]
