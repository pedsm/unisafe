FROM node:alpine

WORKDIR /usr/src/scraper
COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
