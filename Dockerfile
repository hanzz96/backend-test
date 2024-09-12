FROM node:18-alpine

WORKDIR /backend-test

RUN npm i -g @nestjs/cli

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["nest", "start"]

