# This Dockerfile should be used to build the `Group` microservice.

FROM node:18

WORKDIR /app

COPY services/Group/package*.json ./
COPY config/models/package/package.json ./models/
COPY config/models/package/index.js ./models/

RUN npm install
RUN npm update

# Copy the source code
COPY services/Group/ ./Group

WORKDIR /app/Group

# Install the models package
RUN npm install /app/models

CMD ["npm", "start"]