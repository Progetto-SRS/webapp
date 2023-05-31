FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

COPY . .

EXPOSE 8586

CMD [ "node", "server.js" ]
