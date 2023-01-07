FROM node:18.12.1-alpine3.16
WORKDIR /app
COPY package*.json .
COPY code ./code
RUN npm install
CMD ["npm", "run", "start"]