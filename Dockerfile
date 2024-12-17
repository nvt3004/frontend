FROM node:21.6.2-alpine

WORKDIR /app

COPY package.json ./
RUN NODE_OPTIONS=--max-old-space-size=4096 npm install

COPY . .

EXPOSE 3000
ENTRYPOINT ["sh", "-c", "NODE_OPTIONS=--max-old-space-size=4096 npm start"]
