FROM node:12.16.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "run", "dev"]