FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run web-build

EXPOSE 4173

CMD ["npm", "run", "serve"]