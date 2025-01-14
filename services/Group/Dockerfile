# This Dockerfile should be used to build the `Group` microservice.

FROM node:18

WORKDIR /app

COPY services/Group/package*.json ./
RUN npm install
RUN npm update

# Copy the source code
COPY services/Group/ ./Group
COPY config ./config

WORKDIR /app/Group

CMD ["npm", "start"]