FROM node:18.12.1-alpine3.16
WORKDIR /app
COPY package*.json .
RUN npm install
COPY code .
ENTRYPOINT npm start 