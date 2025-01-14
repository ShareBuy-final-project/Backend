# This Dockerfile should be used to build the `User` microservice.

FROM node:18

WORKDIR /app

COPY services/User/package*.json ./
COPY config/models/package/package.json ./models/
COPY config/models/package/index.js ./models/

RUN npm install
RUN npm update

# Copy the source code
COPY services/User/ ./User

WORKDIR /app/User

# Install the models package
RUN npm install /app/models

CMD ["npm", "start"]
