FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY ./src ./src
COPY ./public ./public

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
